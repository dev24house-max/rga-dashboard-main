import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SeoService } from './seo.service';
import { SeoAggregationService } from './seo-aggregation.service';
import { BingWebmasterService } from '../integrations/bing-webmaster/bing-webmaster.service';

@Injectable()
export class SeoSyncSchedulerService {
    private readonly logger = new Logger(SeoSyncSchedulerService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly seoService: SeoService,
        private readonly seoAggregationService: SeoAggregationService,
        private readonly bingWebmasterService: BingWebmasterService,
    ) { }

    @Cron(CronExpression.EVERY_6_HOURS)
    async scheduledGscSync() {
        const tenants = await this.prisma.tenant.findMany({
            select: { id: true, name: true },
        });

        for (const t of tenants) {
            try {
                // 1. Sync raw data from GSC
                await this.seoService.syncGscForTenant(t.id, { days: 30 });
                this.logger.log(`[GSC Sync] Completed for tenant ${t.id}`);

                // 2. Sync backlinks from Bing Webmaster
                await this.bingWebmasterService.syncBacklinksForTenant(t.id);
                this.logger.log(`[Bing Backlinks Sync] Completed for tenant ${t.id}`);

                // 3. Aggregate the raw data into SEO tables
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                await this.seoAggregationService.aggregateGscDataForTenant(t.id, today);
                this.logger.log(`[SEO Aggregation] Completed for tenant ${t.id}`);
            } catch (error: any) {
                this.logger.error(`[SEO Sync] Failed for tenant ${t.id} (${t.name}): ${error.message}`);
            }
        }
    }
}
