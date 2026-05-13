import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { GoogleAdsClientService } from './google-ads-client.service';
import { EncryptionService } from '../../../../common/services/encryption.service';
import { AdsApiLogService } from '../../../../common/services/ads-api-log.service';

@Injectable()
export class GoogleAdsApiService {
  private readonly logger = new Logger(GoogleAdsApiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleAdsClientService: GoogleAdsClientService,
    private readonly encryptionService: EncryptionService,
    private readonly adsApiLogService: AdsApiLogService,
  ) { }

  /**
   * Helper: Decrypt refresh token
   */
  private decryptRefreshToken(encryptedToken: string): string {
    return this.encryptionService.decrypt(encryptedToken);
  }

  /**
   * Fetch campaigns using Raw REST (Axios) to ensure Hostinger compatibility
   */
  async fetchCampaigns(account: any) {
    if (!account.refreshToken) {
      throw new BadRequestException('Account not authenticated.');
    }

    const decryptedRefreshToken = this.decryptRefreshToken(account.refreshToken);

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros,
        campaign_budget.total_amount_micros,
        campaign.start_date,
        campaign.end_date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY campaign.id
    `;

    try {
      this.logger.log(`[fetchCampaigns] Executing Raw REST query for account ${account.customerId}`);
      await this.adsApiLogService.info('GoogleAds', '[fetchCampaigns] Executing Raw REST query', {
        customerId: account.customerId,
        loginCustomerId: account.loginCustomerId,
        query: query.trim(),
      });

      const results = await this.googleAdsClientService.rawRestQuery(
        account.customerId,
        decryptedRefreshToken,
        query,
        account.loginCustomerId
      );

      this.logger.log(`[fetchCampaigns] Successfully retrieved ${results.length} campaigns via REST.`);
      await this.adsApiLogService.info('GoogleAds', `[fetchCampaigns] Retrieved ${results.length} campaigns`, {
        sample: results.slice(0, 2),
      });

      return results;
    } catch (error: any) {
      this.logger.error(`❌ Google Ads REST Error (fetching campaigns): ${error.message}`);
      await this.adsApiLogService.error('GoogleAds', 'fetchCampaigns failed', error, {
        customerId: account.customerId,
      });

      // Parse error for better user feedback
      let userMessage = `Failed to fetch campaigns via REST: ${error.message}`;

      if (error.message?.includes('unauthorized_client')) {
        userMessage = 'Google OAuth authentication failed (unauthorized_client). Your connection may have expired - please reconnect.';
      } else if (error.message?.includes('invalid_grant')) {
        userMessage = 'Your Google Ads authentication has expired. Please reconnect your Google Ads account.';
      } else if (error.message?.includes('permission')) {
        userMessage = 'Your account does not have permission to access Google Ads API. Check your Google Cloud project settings.';
      }

      throw new Error(userMessage);
    }
  }

  /**
   * Fetch metrics using Raw REST (Axios)
   */
  async fetchCampaignMetrics(
    account: any,
    campaignId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const decryptedRefreshToken = this.decryptRefreshToken(account.refreshToken);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Build REST compliant metrics query
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.id = '${campaignId}'
      AND segments.date >= '${startDateStr}'
      AND segments.date <= '${endDateStr}'
    `;

    try {
      this.logger.debug(`[fetchCampaignMetrics] Executing Raw REST query for campaign ${campaignId}`);
      await this.adsApiLogService.info('GoogleAds', '[fetchCampaignMetrics] Executing Raw REST query', {
        customerId: account.customerId,
        campaignId,
        startDate: startDateStr,
        endDate: endDateStr,
        query: query.trim(),
      });

      const results = await this.googleAdsClientService.rawRestQuery(
        account.customerId,
        decryptedRefreshToken,
        query,
        account.loginCustomerId
      );

      this.logger.debug(`[fetchCampaignMetrics] Retrieved ${results.length} daily metric records via REST.`);
      await this.adsApiLogService.info('GoogleAds', `[fetchCampaignMetrics] Retrieved ${results.length} metrics records`, {
        campaignId,
        sample: results.slice(0, 1),
      });

      if (results.length === 0) {
        this.logger.warn(`[fetchCampaignMetrics] ⚠️ No metrics returned for campaign ${campaignId} from ${startDateStr} to ${endDateStr}`);
        await this.adsApiLogService.warn('GoogleAds', 'No metrics returned for campaign', {
          campaignId,
          startDate: startDateStr,
          endDate: endDateStr,
        });
      }

      return results;
    } catch (error: any) {
      this.logger.error(`❌ Google Ads REST Error (fetching metrics): ${error.message}`);
      this.logger.error(`[fetchCampaignMetrics] Stack: ${error.stack}`);
      await this.adsApiLogService.error('GoogleAds', 'fetchCampaignMetrics failed', error, {
        campaignId,
        customerId: account.customerId,
      });

      let userMessage = `Failed to fetch metrics via REST: ${error.message}`;

      if (error.message?.includes('unauthorized_client')) {
        userMessage = 'Google OAuth authentication failed. Please reconnect.';
      }

      throw new Error(userMessage);
    }
  }

  // Error handler (Simplified for now as we use Axios)
  private handleApiError(error: any, accountId: string, action: string) {
    this.logger.error(`[API-ERROR] Action: ${action}, Error: ${error.message}`);
  }
}
