import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { GoogleSearchConsoleService } from './google-search-console.service';
import { SeoSyncSchedulerService } from './seo-sync-scheduler.service';
import { GoogleSearchConsoleOAuthService } from './google-search-console-oauth.service';
import { GoogleSearchConsoleAuthController } from './google-search-console-auth.controller';
import { SeoAggregationService } from './seo-aggregation.service';
import { GoogleAnalyticsModule } from '../integrations/google-analytics/google-analytics.module';
import { BingWebmasterModule } from '../integrations/bing-webmaster/bing-webmaster.module';

@Module({
    imports: [PrismaModule, ConfigModule, GoogleAnalyticsModule, BingWebmasterModule],
    controllers: [SeoController, GoogleSearchConsoleAuthController],
    providers: [
        SeoService,
        GoogleSearchConsoleService,
        GoogleSearchConsoleOAuthService,
        SeoSyncSchedulerService,
        SeoAggregationService,
    ],
    exports: [SeoService, SeoAggregationService],
})
export class SeoModule { }
