import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { SyncModule } from '../../sync/sync.module';
import { LineAdsAdapterService } from './line-ads-adapter.service';
import { LineAdsOAuthService } from './line-ads-oauth.service';
import { LineAdsController } from './line-ads.controller';
import { LineAdsIntegrationController } from './line-ads-integration.controller';

@Module({
    imports: [ConfigModule, PrismaModule, forwardRef(() => SyncModule)],
    providers: [LineAdsAdapterService, LineAdsOAuthService],
    controllers: [LineAdsController, LineAdsIntegrationController],
    exports: [LineAdsAdapterService],
})
export class LineAdsModule { }
