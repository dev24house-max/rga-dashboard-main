import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { GoogleAnalyticsService } from '../integrations/google-analytics/google-analytics.service';

@Injectable()
export class SeoAggregationService {
    private readonly logger = new Logger(SeoAggregationService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly ga4Service: GoogleAnalyticsService,
    ) { }

    /**
     * Aggregate real GSC data from search_console_performance into SEO tables
     */
    async aggregateGscDataForTenant(tenantId: string, date: Date) {
        const day = new Date(date);
        day.setUTCHours(0, 0, 0, 0);

        try {
            // 1. Fetch all GSC data for the day
            const gscData = await this.prisma.searchConsolePerformance.findMany({
                where: {
                    tenantId,
                    date: day,
                },
            });

            if (gscData.length > 0) {
                // Aggregate to seo_top_keywords (group by query)
                await this.aggregateTopKeywords(tenantId, day, gscData);

                // Aggregate to seo_traffic_by_location (group by country)
                await this.aggregateTrafficByLocation(tenantId, day, gscData);

                // Classify to seo_search_intent (branded vs non-branded)
                await this.aggregateSearchIntent(tenantId, day, gscData);
                
                this.logger.log(`[SEO Aggregation] Tenant ${tenantId}: aggregated ${gscData.length} GSC rows`);
            } else {
                this.logger.debug(`No GSC data found for tenant ${tenantId} on ${day.toISOString().split('T')[0]}`);
            }

            // 2. Aggregate GA4 Location Data (City Level) - Runs independently of GSC
            await this.aggregateGa4LocationData(tenantId, day);

        } catch (error) {
            this.logger.error(`Failed to aggregate SEO data for tenant ${tenantId}`, error instanceof Error ? error.stack : error);
            throw error;
        }
    }

    /**
     * Aggregate GSC data by query to get top keywords
     */
    private async aggregateTopKeywords(tenantId: string, date: Date, gscData: any[]) {
        // Group by query (keyword)
        const queryGroups = new Map<string, any[]>();
        gscData.forEach(row => {
            const query = row.query || 'unknown';
            if (!queryGroups.has(query)) {
                queryGroups.set(query, []);
            }
            queryGroups.get(query)!.push(row);
        });

        const keywordRows = Array.from(queryGroups.entries()).map(([query, rows]) => {
            const clicks = rows.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0);
            const impressions = rows.reduce((sum, r) => sum + (Number(r.impressions) || 0), 0);
            
            // Calculate average position, ensuring we handle Decimal types from Prisma
            const sumPosition = rows.reduce((sum, r) => {
                const pos = r.position ? Number(r.position) : 0;
                return sum + (isNaN(pos) ? 0 : pos);
            }, 0);
            
            const avgPosition = rows.length > 0 ? sumPosition / rows.length : 0;

            return {
                tenantId,
                date,
                keyword: query,
                position: isNaN(avgPosition) ? 0 : Number(avgPosition.toFixed(1)),
                volume: impressions, // Use impressions as proxy for search volume
                traffic: clicks,
                trafficPercentage: 0, // Will be calculated after
                url: rows[0].page || '/',
                change: 0, // Day-to-day change - needs historical data
                cpc: 0, // Not available from GSC
            };
        });

        // Calculate traffic percentage
        const totalTraffic = keywordRows.reduce((sum, r) => sum + r.traffic, 0) || 1;
        const keywordRowsFinal = keywordRows.map(r => ({
            ...r,
            trafficPercentage: Number(((r.traffic / totalTraffic) * 100).toFixed(1)),
        }));

        // Delete old data and insert new
        await this.prisma.seoTopKeywords.deleteMany({
            where: { tenantId, date },
        });
        await this.prisma.seoTopKeywords.createMany({
            data: keywordRowsFinal,
            skipDuplicates: true,
        });

        this.logger.log(`[Top Keywords] Tenant ${tenantId}: inserted ${keywordRowsFinal.length} keywords`);
    }

    /**
     * Aggregate GSC data by country to get traffic by location
     */
    private async aggregateTrafficByLocation(tenantId: string, date: Date, gscData: any[]) {
        // Group by country
        const countryGroups = new Map<string, any[]>();
        gscData.forEach(row => {
            const country = row.country || 'unknown';
            if (!countryGroups.has(country)) {
                countryGroups.set(country, []);
            }
            countryGroups.get(country)!.push(row);
        });

        const locationRows = Array.from(countryGroups.entries()).map(([country, rows]) => {
            const clicks = rows.reduce((sum, r) => sum + (r.clicks || 0), 0);
            const keywordCount = new Set(rows.map(r => r.query)).size;

            return {
                tenantId,
                date,
                location: this.countryCodeToName(country),
                traffic: clicks,
                trafficPercentage: 0, // Will be calculated after
                keywords: keywordCount,
            };
        });

        // Calculate traffic percentage
        const totalTraffic = locationRows.reduce((sum, r) => sum + (Number(r.traffic) || 0), 0) || 1;
        const locationRowsFinal = locationRows.map(r => ({
            ...r,
            traffic: Number(r.traffic) || 0,
            trafficPercentage: Number(((Number(r.traffic) / totalTraffic) * 100).toFixed(1)),
        }));

        // Upsert data (in case location exists, update)
        for (const row of locationRowsFinal) {
            await this.prisma.seoTrafficByLocation.upsert({
                where: {
                    tenantId_date_location: {
                        tenantId,
                        date,
                        location: row.location,
                    },
                },
                create: row,
                update: {
                    traffic: row.traffic,
                    trafficPercentage: row.trafficPercentage,
                    keywords: row.keywords,
                },
            });
        }

        this.logger.log(`[Traffic by Location] Tenant ${tenantId}: upserted ${locationRowsFinal.length} locations`);
    }

    /**
     * Classify GSC data by search intent
     */
    private async aggregateSearchIntent(tenantId: string, date: Date, gscData: any[]) {
        // Classify each query into multiple intent buckets
        const intents = {
            branded: gscData.filter(row => this.isBrandedQuery(row.query || '')),
            non_branded: gscData.filter(row => !this.isBrandedQuery(row.query || '')),
            informational: gscData.filter(row => this.matchesIntent(row.query || '', 'informational')),
            navigational: gscData.filter(row => this.matchesIntent(row.query || '', 'navigational')),
            commercial: gscData.filter(row => this.matchesIntent(row.query || '', 'commercial')),
            transactional: gscData.filter(row => this.matchesIntent(row.query || '', 'transactional')),
        };

        const intentTypes = Object.keys(intents);

        // Calculate metrics for each intent type
        for (const type of intentTypes) {
            const rows = intents[type as keyof typeof intents];
            const keywords = new Set(rows.map(r => r.query)).size;
            const traffic = rows.reduce((sum, r) => sum + (Number(r.clicks) || 0), 0);

            // Only save if there's data to prevent empty charts
            if (keywords > 0 || traffic > 0) {
                // Delete old record if exists, then create new
                await this.prisma.seoSearchIntent.deleteMany({
                    where: {
                        tenantId,
                        date,
                        type,
                    },
                });

                await this.prisma.seoSearchIntent.create({
                    data: {
                        tenantId,
                        date,
                        type,
                        keywords,
                        traffic,
                    },
                });
            }
        }

        this.logger.log(`[Search Intent] Tenant ${tenantId}: classified keywords into ${intentTypes.length} intent types`);
    }

    /**
     * Match query against intent patterns
     */
    private matchesIntent(query: string, intent: string): boolean {
        const q = query.toLowerCase();
        
        const patterns: Record<string, string[]> = {
            informational: ['how', 'what', 'why', 'when', 'guide', 'tutorial', 'list', 'example', 'tips', 'ideas', 'วิธี', 'คือ', 'อย่างไร', 'ทำไม'],
            navigational: ['login', 'contact', 'about', 'pricing', 'support', 'rga', 'rise group'],
            commercial: ['best', 'top', 'review', 'vs', 'comparison', 'cheap', 'discount', 'ดีที่สุด', 'รีวิว', 'ราคา', 'เปรียบเทียบ'],
            transactional: ['buy', 'purchase', 'order', 'shop', 'booking', 'near me', 'service', 'agency', 'hire', 'จ้าง', 'ซื้อ', 'บริการ', 'บริษัท'],
        };

        const list = patterns[intent] || [];
        return list.some(word => q.includes(word));
    }

    /**
     * Check if query is branded (contains brand name)
     */
    private isBrandedQuery(query: string): boolean {
        const brandKeywords = ['rga', 'rise group', 'rise group asia'];
        return brandKeywords.some(brand => query.toLowerCase().includes(brand));
    }

    /**
     * Convert country code to country name
     */
    private countryCodeToName(code: string): string {
        const countryMap: Record<string, string> = {
            'TH': 'Thailand',
            'US': 'United States',
            'GB': 'United Kingdom',
            'JP': 'Japan',
            'CN': 'China',
            'IN': 'India',
            'SG': 'Singapore',
            'MY': 'Malaysia',
            'ID': 'Indonesia',
            'VN': 'Vietnam',
            'KR': 'South Korea',
            'AU': 'Australia',
            'NZ': 'New Zealand',
            'DE': 'Germany',
            'FR': 'France',
            'IT': 'Italy',
            'ES': 'Spain',
            'BR': 'Brazil',
            'MX': 'Mexico',
            'CA': 'Canada',
        };
        return countryMap[code] || code;
    }

    /**
     * Aggregate data for all tenants on a specific date
     */
    async aggregateGscDataForAllTenants(date: Date) {
        const tenants = await this.prisma.tenant.findMany({
            select: { id: true, name: true },
        });

        for (const tenant of tenants) {
            try {
                await this.aggregateGscDataForTenant(tenant.id, date);
            } catch (error) {
                this.logger.error(`Failed to aggregate GSC data for tenant ${tenant.id} (${tenant.name})`, error);
            }
        }
    }

    /**
     * Backfill aggregation for last N days
     */
    async backfillAggregationForLastNDays(tenantId: string, days: number = 30) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setUTCDate(date.getUTCDate() - i);
            try {
                await this.aggregateGscDataForTenant(tenantId, date);
            } catch (error) {
                this.logger.error(`Failed to backfill aggregation for tenant ${tenantId} on ${date.toISOString().split('T')[0]}`, error);
            }
        }
    }

    /**
     * Aggregate GA4 Location data (Country + City)
     */
    private async aggregateGa4LocationData(tenantId: string, date: Date) {
        const dateStr = date.toISOString().split('T')[0];
        
        try {
            this.logger.debug(`[GA4 Location] Starting aggregation for tenant ${tenantId} on ${dateStr}`);
            const ga4Data = await this.ga4Service.getLocationData(tenantId, dateStr, dateStr);
            
            if (!ga4Data || ga4Data.length === 0) {
                this.logger.debug(`[GA4 Location] No data found for tenant ${tenantId} on ${dateStr}`);
                return;
            }

            this.logger.log(`[GA4 Location] Found ${ga4Data.length} rows from GA4 for tenant ${tenantId} on ${dateStr}`);

            // Calculate total sessions for percentage
            const totalSessions = ga4Data.reduce((sum, item) => sum + (Number(item.sessions) || 0), 0) || 1;

            for (const item of ga4Data) {
                const locationLabel = item.city && item.city !== '(not set)' 
                    ? `${item.city}, ${item.country}` 
                    : item.country;

                const traffic = Number(item.sessions) || 0;
                const trafficPercentage = Number(((traffic / totalSessions) * 100).toFixed(1));

                await this.prisma.seoTrafficByLocation.upsert({
                    where: {
                        tenantId_date_location: {
                            tenantId,
                            date,
                            location: locationLabel,
                        },
                    },
                    create: {
                        tenantId,
                        date,
                        location: locationLabel,
                        traffic: traffic,
                        trafficPercentage: trafficPercentage,
                        keywords: 0,
                    },
                    update: {
                        traffic: traffic,
                        trafficPercentage: trafficPercentage,
                    },
                });
            }

            this.logger.log(`[GA4 Location Aggregation] Tenant ${tenantId}: successfully upserted ${ga4Data.length} locations`);
        } catch (error) {
            this.logger.error(`[GA4 Location] Failed to aggregate GA4 location data for tenant ${tenantId}`, error.message);
        }
    }
}
