import { Module, forwardRef } from '@nestjs/common';
import { FacebookAdsService } from './facebook-ads.service';
import { FacebookAdsAuthController } from './facebook-ads-auth.controller';
import { FacebookAdsIntegrationController } from './facebook-ads-integration.controller';
import { FacebookAdsOAuthService } from './facebook-ads-oauth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SyncModule } from '../../sync/sync.module';

@Module({
    imports: [PrismaModule, ConfigModule, HttpModule, forwardRef(() => SyncModule)],
    providers: [FacebookAdsService, FacebookAdsOAuthService],
    exports: [FacebookAdsService, FacebookAdsOAuthService],
    controllers: [FacebookAdsAuthController, FacebookAdsIntegrationController],
})
export class FacebookAdsModule { }

