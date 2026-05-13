import { BadRequestException, Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SeoService } from './seo.service';
import { SeoAggregationService } from './seo-aggregation.service';
import { ConnectGscDto } from './dto/connect-gsc.dto';
import { ConnectBingDto } from './dto/connect-bing.dto';
import { GoogleSearchConsoleOAuthService } from './google-search-console-oauth.service';
import { BingWebmasterService } from '../integrations/bing-webmaster/bing-webmaster.service';

@ApiTags('SEO')
@ApiBearerAuth()
@Controller('seo')
@UseGuards(JwtAuthGuard)
export class SeoController {
    constructor(
        private readonly seoService: SeoService,
        private readonly gscOAuthService: GoogleSearchConsoleOAuthService,
        private readonly seoAggregationService: SeoAggregationService,
        private readonly bingWebmasterService: BingWebmasterService,
    ) { }

    @Get('summary')
    @ApiOperation({ summary: 'Get SEO summary metrics' })
    async getSummary(@CurrentUser() user: any, @Query('days') days?: number) {
        return this.seoService.getSeoSummary(user.tenantId, days ? Number(days) : undefined);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get SEO history for chart' })
    async getHistory(
        @CurrentUser() user: any,
        @Query('days') days?: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        if (startDate || endDate) {
            if (!startDate || !endDate) {
                throw new BadRequestException('startDate and endDate must be provided together');
            }

            return this.seoService.getSeoHistory(user.tenantId, undefined, startDate, endDate);
        }

        return this.seoService.getSeoHistory(user.tenantId, days ? Number(days) : undefined);
    }

    @Get('keyword-intent')
    @ApiOperation({ summary: 'Get SEO keyword intent breakdown' })
    async getKeywordIntent(@CurrentUser() user: any) {
        return this.seoService.getSeoKeywordIntent(user.tenantId);
    }

    @Get('traffic-by-location')
    @ApiOperation({ summary: 'Get SEO traffic by location' })
    async getTrafficByLocation(@CurrentUser() user: any) {
        return this.seoService.getSeoTrafficByLocation(user.tenantId);
    }

    @Get('overview')
    @ApiOperation({ summary: 'Get SEO overview (GA4 + GSC)' })
    @ApiQuery({ name: 'period', required: false, description: 'Time period (7d, 14d, 30d, 90d). Default: 30d' })
    async getSeoOverview(
        @CurrentUser('tenantId') tenantId: string,
        @Query('period') period?: string,
    ) {
        return this.seoService.getOverview(tenantId, period);
    }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get SEO dashboard details (trends + top breakdown)' })
    @ApiQuery({ name: 'period', required: false, description: 'Time period (7d, 14d, 30d, 90d). Default: 30d' })
    @ApiQuery({ name: 'limit', required: false, description: 'Top N breakdown rows. Default: 10' })
    async getSeoDashboard(
        @CurrentUser('tenantId') tenantId: string,
        @Query('period') period?: string,
        @Query('limit') limit?: string,
    ) {
        const limitNum = limit ? Math.max(1, parseInt(limit, 10) || 10) : 10;
        return this.seoService.getDashboard(tenantId, period, limitNum);
    }

    @Post('gsc/connect')
    @ApiOperation({ summary: 'Configure Google Search Console site URL for this tenant' })
    async connectGsc(
        @CurrentUser('tenantId') tenantId: string,
        @Body() dto: ConnectGscDto,
    ) {
        return this.seoService.setGscSiteUrl(tenantId, dto.siteUrl);
    }

    @Get('gsc/status')
    @ApiOperation({ summary: 'Get Google Search Console OAuth connection status' })
    async getGscStatus(@CurrentUser('tenantId') tenantId: string) {
        return this.gscOAuthService.getConnectionStatus(tenantId);
    }

    @Post('sync/gsc')
    @ApiOperation({ summary: 'Manually sync Google Search Console data into DB' })
    @ApiQuery({ name: 'days', required: false, description: 'How many days back to sync. Default: 30' })
    async syncGsc(
        @CurrentUser('tenantId') tenantId: string,
        @Query('days') days?: string,
    ) {
        const daysNum = days ? Math.max(1, parseInt(days, 10) || 30) : 30;
        return this.seoService.syncGscForTenant(tenantId, { days: daysNum });
    }

    @Post('aggregate/seo')
    @ApiOperation({ summary: 'Manually aggregate GSC data into SEO tables (top keywords, traffic by location, search intent)' })
    @ApiQuery({ name: 'days', required: false, description: 'How many days back to aggregate. Default: 1 (today only)' })
    async aggregateSeoData(
        @CurrentUser('tenantId') tenantId: string,
        @Query('days') days?: string,
    ) {
        const daysNum = days ? Math.max(1, parseInt(days, 10) || 1) : 1;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (daysNum === 1) {
            await this.seoAggregationService.aggregateGscDataForTenant(tenantId, today);
            return { success: true, message: `Aggregated SEO data for ${today.toISOString().split('T')[0]}` };
        } else {
            await this.seoAggregationService.backfillAggregationForLastNDays(tenantId, daysNum);
            return { success: true, message: `Backfilled SEO aggregation for last ${daysNum} days` };
        }
    }

    @Delete('gsc')
    @ApiOperation({ summary: 'Disconnect Google Search Console' })
    async disconnectGsc(@CurrentUser('tenantId') tenantId: string) {
        return this.gscOAuthService.disconnect(tenantId);
    }

    @Post('bing/connect')
    @ApiOperation({ summary: 'Configure Bing Webmaster site URL for this tenant' })
    async connectBing(
        @CurrentUser('tenantId') tenantId: string,
        @Body() dto: ConnectBingDto,
    ) {
        try {
            await this.bingWebmasterService.setSiteUrl(tenantId, dto.siteUrl);
            return { success: true, siteUrl: dto.siteUrl };
        } catch (error: any) {
            return {
                success: false,
                error: 'Failed to connect Bing Webmaster',
                message: error.message
            };
        }
    }

    @Get('bing/status')
    @ApiOperation({ summary: 'Get Bing Webmaster connection status' })
    async getBingStatus(@CurrentUser('tenantId') tenantId: string) {
        try {
            const siteUrl = await this.bingWebmasterService.getSiteUrl(tenantId);
            return {
                connected: !!siteUrl,
                siteUrl,
            };
        } catch (error: any) {
            return {
                connected: false,
                error: 'Failed to get Bing status',
                message: error.message
            };
        }
    }

    @Post('sync/bing')
    @ApiOperation({ summary: 'Manually sync Bing Webmaster backlinks data into DB' })
    async syncBing(@CurrentUser('tenantId') tenantId: string) {
        try {
            return await this.bingWebmasterService.syncBacklinksForTenant(tenantId);
        } catch (error: any) {
            return {
                success: false,
                error: 'Failed to sync Bing backlinks',
                message: error.message
            };
        }
    }

    @Delete('bing')
    @ApiOperation({ summary: 'Disconnect Bing Webmaster' })
    async disconnectBing(@CurrentUser('tenantId') tenantId: string) {
        try {
            await this.bingWebmasterService.setSiteUrl(tenantId, '');
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: 'Failed to disconnect Bing Webmaster',
                message: error.message
            };
        }
    }

    @Get('bing/sites')
    @ApiOperation({ summary: 'Get user sites from Bing Webmaster API' })
    async getBingUserSites(@CurrentUser('tenantId') tenantId: string): Promise<any> {
        try {
            return await this.bingWebmasterService.getUserSites(tenantId);
        } catch (error: any) {
            return {
                error: 'Failed to fetch Bing user sites',
                message: error.message,
                sites: []
            };
        }
    }

    @Get('top-keywords')
    @ApiOperation({ summary: 'Get top organic keywords' })
    async getTopKeywords(@CurrentUser() user: any) {
        return this.seoService.getTopKeywords(user.tenantId);
    }

    @Get('offpage-snapshots')
    @ApiOperation({ summary: 'Get SEO offpage snapshots' })
    async getOffpageSnapshots(@CurrentUser() user: any) {
        return this.seoService.getOffpageSnapshots(user.tenantId);
    }

    @Get('anchor-texts')
    @ApiOperation({ summary: 'Get SEO anchor texts' })
    async getAnchorTexts(@CurrentUser() user: any) {
        return this.seoService.getAnchorTexts(user.tenantId);
    }

    @Get('ai-insights')
    @ApiOperation({ summary: 'Get AI insights for Google Assistant' })
    async getAiInsights(@CurrentUser() user: any) {
        return this.seoService.getAiInsights(user.tenantId);
    }
}
