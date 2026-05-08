import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarketingPlatformAdapter, PlatformCredentials, DateRange } from '../common/marketing-platform.adapter';
import { Campaign, Metric, CampaignStatus, AdPlatform, Prisma } from '@prisma/client';
import axios from 'axios';
import { AdsApiLogService } from '../../../common/services/ads-api-log.service';

@Injectable()
export class TikTokAdsService implements MarketingPlatformAdapter {
  private readonly logger = new Logger(TikTokAdsService.name);
  private readonly baseUrl = 'https://business-api.tiktok.com/open_api/v1.3';

  constructor(
    private readonly configService: ConfigService,
    private readonly adsApiLogService: AdsApiLogService,
  ) { }

  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    try {
      // Simple check: try to fetch advertiser info
      const response = await axios.get(`${this.baseUrl}/advertiser/get/`, {
        headers: {
          'Access-Token': credentials.accessToken,
        },
        params: {
          app_id: this.configService.get('TIKTOK_APP_ID'),
          advertiser_ids: JSON.stringify([credentials.accountId]),
        },
      });
      return response.data?.code === 0;
    } catch (error) {
      this.logger.error(`TikTok Credentials Validation Failed: ${error.message}`);
      return false;
    }
  }

  async fetchCampaigns(credentials: PlatformCredentials): Promise<Partial<Campaign>[]> {
    await this.adsApiLogService.info('TikTokAds', 'Fetching campaigns', {
      accountId: credentials.accountId,
      endpoint: `${this.baseUrl}/campaign/get/`,
      params: {
        advertiser_id: credentials.accountId,
        page_size: 1000,
      },
    });

    try {
      const response = await axios.get(`${this.baseUrl}/campaign/get/`, {
        headers: {
          'Access-Token': credentials.accessToken,
        },
        params: {
          advertiser_id: credentials.accountId,
          page_size: 1000,
        },
      });

      if (response.data?.code !== 0) {
        await this.adsApiLogService.error('TikTokAds', 'fetchCampaigns API returned non-zero code', null, {
          response: response.data,
        });
        throw new Error(`TikTok API Error: ${response.data?.message}`);
      }

      const campaignList = response.data.data.list || [];
      await this.adsApiLogService.info('TikTokAds', 'Fetched campaigns', {
        accountId: credentials.accountId,
        count: campaignList.length,
        sample: campaignList.slice(0, 2),
      });
      const campaignIds = campaignList.map((c: any) => c.campaign_id);

      // 2. Fetch Absolute Lifetime Metrics for these campaigns
      // We use a very wide range to simulate "Lifetime"
      let lifetimeMetricsMap = new Map();
      if (campaignIds.length > 0) {
        await this.adsApiLogService.info('TikTokAds', 'Fetching lifetime metrics', {
          accountId: credentials.accountId,
          endpoint: `${this.baseUrl}/report/integrated/get/`,
          campaignIds: campaignIds.slice(0, 10),
        });

        try {
          const metricsResponse = await axios.get(`${this.baseUrl}/report/integrated/get/`, {
            headers: { 'Access-Token': credentials.accessToken },
            params: {
              advertiser_id: credentials.accountId,
              report_type: 'BASIC',
              data_level: 'AUCTION_CAMPAIGN',
              dimensions: JSON.stringify(['campaign_id']),
              metrics: JSON.stringify(['impressions', 'clicks', 'spend']),
              start_date: '2020-01-01',
              end_date: new Date().toISOString().split('T')[0],
              filtering: JSON.stringify([{ field_name: 'campaign_ids', filter_type: 'IN', filter_value: JSON.stringify(campaignIds) }]),
              page_size: 1000,
            },
          });
          if (metricsResponse.data?.code === 0) {
            const lifetimeList = metricsResponse.data.data.list || [];

            // DEBUG: Log sample lifetime metrics
            if (lifetimeList.length > 0) {
              this.logger.debug(`[TikTok Lifetime Metrics Sample] First row: ${JSON.stringify(lifetimeList[0], null, 2)}`);
              this.logger.debug(`[TikTok Lifetime Metrics] Metric keys: ${JSON.stringify(Object.keys(lifetimeList[0].metrics || {}))}`);
            }

            lifetimeList.forEach((row: any) => {
              this.logger.debug(`[TikTok Lifetime] Campaign ${row.dimensions.campaign_id}: spend=${row.metrics.spend}, impressions=${row.metrics.impressions}`);
              lifetimeMetricsMap.set(row.dimensions.campaign_id, row.metrics);
            });
          }
        } catch (e) {
          this.logger.warn(`Failed to fetch lifetime metrics for TikTok campaigns: ${e.message}`);
          await this.adsApiLogService.warn('TikTokAds', 'Failed to fetch lifetime metrics', {
            error: e instanceof Error ? e.message : e,
            accountId: credentials.accountId,
          });
        }
      }

      return campaignList.map((c: any) => {
        // DEBUG: Log all budget-related fields
        this.logger.debug(`[TikTok Campaign Budget Debug] Campaign: ${c.campaign_id}`);
        this.logger.debug(`  budget: ${c.budget}, budget_amount: ${c.budget_amount}, lifetime_budget: ${c.lifetime_budget}, daily_budget: ${c.daily_budget}`);
        this.logger.debug(`  All campaign fields: ${JSON.stringify(c, null, 2)}`);

        let budget = parseFloat(c.budget || c.budget_amount || c.lifetime_budget || '0');
        const dailyBudget = parseFloat(c.daily_budget || '0');

        // If total budget is not set but we have daily budget + duration, calculate it
        if (budget <= 0 && dailyBudget > 0 && c.start_time && c.end_time) {
          const start = new Date(c.start_time);
          const end = new Date(c.end_time);
          const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
          budget = dailyBudget * days;
        }

        this.logger.log(`[TikTok Budget Result] Campaign ${c.campaign_id}: budget=${budget}, dailyBudget=${dailyBudget}`);

        const metrics = lifetimeMetricsMap.get(c.campaign_id);
        if (metrics) {
          this.logger.debug(`[TikTok Metrics Debug] Campaign ${c.campaign_id} metrics: ${JSON.stringify(metrics)}`);
        }

        return {
          externalId: String(c.campaign_id || c.id || ''),
          name: c.campaign_name || c.name || '',
          status: this.mapStatus(c.operation_status || c.status),
          // Preserve the raw TikTok budget_mode for downstream consumers
          budgetMode: c.budget_mode || c.budgetMode || null,
          budget: new Prisma.Decimal(budget || dailyBudget || 0),
          startDate: c.start_time ? new Date(c.start_time) : null,
          endDate: c.end_time ? new Date(c.end_time) : null,
          platform: AdPlatform.TIKTOK,
          metrics: metrics ? {
            impressions: parseInt(metrics.impressions || '0'),
            clicks: parseInt(metrics.clicks || '0'),
            spend: parseFloat(metrics.spend || '0'),
            revenue: parseFloat(metrics.total_conversion_value || '0'),
            conversions: parseInt(metrics.conversion || '0'),
          } : undefined,
        };
      });
    } catch (error) {
      this.logger.error(`Failed to fetch TikTok campaigns: ${error.message}`);
      throw error;
    }
  }

  async fetchMetrics(
    credentials: PlatformCredentials,
    campaignId: string,
    range: DateRange,
  ): Promise<Partial<Metric>[]> {
    await this.adsApiLogService.info('TikTokAds', 'Fetching metrics', {
      campaignId,
      accountId: credentials.accountId,
      startDate: range.startDate.toISOString().split('T')[0],
      endDate: range.endDate.toISOString().split('T')[0],
    });

    try {
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive-ish

      const maxDays = 30;

      const performRequest = async (sDate: Date, eDate: Date) => {
        const s = sDate.toISOString().split('T')[0];
        const e = eDate.toISOString().split('T')[0];
        await this.adsApiLogService.info('TikTokAds', 'Fetching metrics chunk', {
          campaignId,
          accountId: credentials.accountId,
          startDate: s,
          endDate: e,
        });

        const resp = await axios.get(`${this.baseUrl}/report/integrated/get/`, {
          headers: { 'Access-Token': credentials.accessToken },
          params: {
            advertiser_id: credentials.accountId,
            report_type: 'BASIC',
            data_level: 'AUCTION_CAMPAIGN',
            dimensions: JSON.stringify(['campaign_id', 'stat_time_day']),
            // Request only basic metrics to avoid invalid-field errors
            metrics: JSON.stringify(['impressions', 'clicks', 'spend']),
            start_date: s,
            end_date: e,
            filtering: JSON.stringify([
              { field_name: 'campaign_ids', filter_type: 'IN', filter_value: JSON.stringify([campaignId]) },
            ]),
            page_size: 1000,
          },
        });

        if (resp.data?.code !== 0) {
          await this.adsApiLogService.error('TikTokAds', 'fetchMetrics API returned non-zero code', null, {
            response: resp.data,
            campaignId,
          });
          // propagate code so caller can decide
          const e: any = new Error(`TikTok API Error: ${resp.data?.message}`);
          e.code = resp.data?.code;
          throw e;
        }

        return resp.data.data.list || [];
      };

      let combined: any[] = [];

      if (diffDays > maxDays) {
        // Split into <=30-day chunks
        let cursor = new Date(startDate);
        while (cursor <= endDate) {
          const chunkEnd = new Date(Math.min(endDate.getTime(), cursor.getTime() + (maxDays - 1) * 24 * 60 * 60 * 1000));
          try {
            const chunkList = await performRequest(cursor, chunkEnd);
            combined = combined.concat(chunkList || []);
          } catch (err) {
            // If TikTok complains about max span, continue with smaller chunks; otherwise log and rethrow
            if (err?.code === 40002) {
              this.logger.warn(`TikTok chunk request failed with 40002 for ${cursor.toISOString()} - ${chunkEnd.toISOString()}, trying smaller chunks`);
              // break chunk into single-day calls as fallback
              let singleCursor = new Date(cursor);
              while (singleCursor <= chunkEnd) {
                const singleEnd = new Date(singleCursor.getTime());
                try {
                  const singleList = await performRequest(singleCursor, singleEnd);
                  combined = combined.concat(singleList || []);
                } catch (singleErr) {
                  this.logger.error(`Failed single-day fetch for ${singleCursor.toISOString()}: ${singleErr.message}`);
                }
                singleCursor.setDate(singleCursor.getDate() + 1);
              }
            } else {
              this.logger.error(`Chunk fetch failed: ${err?.message || err}`);
            }
          }
          cursor.setDate(cursor.getDate() + maxDays);
        }
      } else {
        // single request
        try {
          combined = await performRequest(startDate, endDate);
        } catch (err) {
          // If API rejects for span even though our calculation thought it's <=30 days, attempt chunking fallback
          if (err?.code === 40002) {
            this.logger.warn('TikTok API returned 40002 despite small range — falling back to chunking');
            let cursor = new Date(startDate);
            while (cursor <= endDate) {
              const chunkEnd = new Date(Math.min(endDate.getTime(), cursor.getTime() + (maxDays - 1) * 24 * 60 * 60 * 1000));
              try {
                const chunkList = await performRequest(cursor, chunkEnd);
                combined = combined.concat(chunkList || []);
              } catch (chunkErr) {
                this.logger.error(`Fallback chunk fetch failed: ${chunkErr?.message || chunkErr}`);
              }
              cursor.setDate(cursor.getDate() + maxDays);
            }
          } else {
            this.logger.error(`Failed to fetch TikTok metrics: ${err?.message || err}`);
            await this.adsApiLogService.error('TikTokAds', 'fetchMetrics failed', err, {
              campaignId,
              accountId: credentials.accountId,
            });
            return [];
          }
        }
      }

      await this.adsApiLogService.info('TikTokAds', `Fetched ${combined.length} metric rows (combined)`, {
        campaignId,
        sample: combined.slice(0, 2),
      });

      // Map combined rows to Metric objects
      return (combined || []).map((row: any, index: number) => {
        const spendRaw = row.metrics?.spend || row.metrics?.stat_cost;
        const spend = parseFloat(spendRaw || '0');
        if (isNaN(spend)) {
          this.logger.warn(`[TikTok Spend NaN] Row ${index}: parseFloat returned NaN for value "${spendRaw}". All metrics: ${JSON.stringify(row.metrics)}`);
        }
        const revenue = parseFloat(
          row.metrics?.total_conversion_value ||
          row.metrics?.conversion_value ||
          row.metrics?.total_conversions_value ||
          '0'
        );

        const result = {
          date: new Date(row.dimensions?.stat_time_day),
          impressions: parseInt(row.metrics?.impressions || '0'),
          clicks: parseInt(row.metrics?.clicks || '0'),
          spend: new Prisma.Decimal(isNaN(spend) ? 0 : spend),
          conversions: parseInt(row.metrics?.conversions || row.metrics?.total_conversions || row.metrics?.conversion || '0'),
          revenue: new Prisma.Decimal(isNaN(revenue) ? 0 : revenue),
          roas: new Prisma.Decimal((isNaN(spend) || spend <= 0) ? 0 : revenue / spend),
        };

        if (index < 3) {
          this.logger.log(`[TikTok Metric Result] Date ${result.date}: spend=${result.spend}, impressions=${result.impressions}, clicks=${result.clicks}`);
        }

        return result;
      });
    } catch (error) {
      this.logger.error(`Failed to fetch TikTok metrics: ${error.message}`);
      await this.adsApiLogService.error('TikTokAds', 'fetchMetrics failed', error, {
        campaignId,
        accountId: credentials.accountId,
      });
      return [];
    }
  }

  private mapStatus(status: string): CampaignStatus {
    switch (status?.toUpperCase()) {
      case 'ENABLE':
      case 'ENABLED':
      case 'ACTIVE':
        return CampaignStatus.ACTIVE;
      case 'DISABLE':
      case 'DISABLED':
      case 'PAUSED':
        return CampaignStatus.PAUSED;
      default:
        return CampaignStatus.PAUSED;
    }
  }
}
