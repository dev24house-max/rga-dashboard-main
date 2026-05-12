import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoogleSearchConsoleOAuthService } from './google-search-console-oauth.service';

@ApiTags('auth/google/search-console')
@Controller('auth/google/search-console')
export class GoogleSearchConsoleAuthController {
    private readonly frontendUrl: string;

    constructor(
        private readonly oauthService: GoogleSearchConsoleOAuthService,
        private readonly configService: ConfigService,
    ) {
        this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    }

    @Get('url')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Google Search Console OAuth authorization URL' })
    async getAuthUrl(@Req() req: any) {
        const authUrl = await this.oauthService.generateAuthUrl(req.user.id, req.user.tenantId);
        return {
            authUrl,
            message: 'Open this URL in a browser to authorize Search Console access',
        };
    }

    @Get('callback')
    @ApiOperation({ summary: 'Google Search Console OAuth callback endpoint' })
    async handleCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Res() res: Response,
    ) {
        try {
            if (!code) {
                return res.redirect(`${this.frontendUrl}/data-sources?error=missing_code`);
            }

            const result = await this.oauthService.handleCallback(code, state);

            return res.redirect(
                `${this.frontendUrl}/data-sources?status=${result.status}&tempToken=${result.tempToken}&platform=gsc`,
            );
        } catch (error: any) {
            return res.redirect(
                `${this.frontendUrl}/data-sources?error=${encodeURIComponent(error.message)}`,
            );
        }
    }

    @Get('temp-sites')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get temporary Search Console properties for selection' })
    async getTempSites(@Query('tempToken') tempToken: string) {
        if (!tempToken) {
            throw new BadRequestException('Missing tempToken');
        }
        return this.oauthService.getTempSites(tempToken);
    }

    @Post('complete')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Complete Search Console connection by selecting a property' })
    @ApiBody({ schema: { type: 'object', properties: { tempToken: { type: 'string' }, siteUrl: { type: 'string' } } } })
    async completeConnection(
        @Req() req: any,
        @Body('tempToken') tempToken: string,
        @Body('siteUrl') siteUrl: string,
    ) {
        if (!tempToken || !siteUrl) {
            throw new BadRequestException('Missing tempToken or siteUrl');
        }

        return this.oauthService.completeConnection(tempToken, siteUrl, req.user.tenantId);
    }
}
