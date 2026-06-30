import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { EncryptionService } from '../../common/services/encryption.service';
import { resolveGoogleOAuthRedirectUri } from '../../common/utils/google-oauth.util';
import { PrismaService } from '../prisma/prisma.service';
import { SeoService } from './seo.service';

const GSC_OAUTH_CALLBACK_PATH = '/auth/google/search-console/callback';

export interface SearchConsoleSite {
    siteUrl: string;
    permissionLevel?: string | null;
}

function isJsonObject(value: Prisma.JsonValue | null | undefined): value is Prisma.JsonObject {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

@Injectable()
export class GoogleSearchConsoleOAuthService {
    private readonly logger = new Logger(GoogleSearchConsoleOAuthService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @Inject(forwardRef(() => SeoService))
        private readonly seoService: SeoService,
    ) { }

    private createOAuthClient() {
        const clientId =
            this.configService.get<string>('GOOGLE_GSC_CLIENT_ID') ||
            this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret =
            this.configService.get<string>('GOOGLE_GSC_CLIENT_SECRET') ||
            this.configService.get<string>('GOOGLE_CLIENT_SECRET');
        const redirectUri = this.getRedirectUri();

        if (!clientId || !clientSecret) {
            throw new Error('Missing Google Search Console OAuth client credentials');
        }

        return new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri,
        );
    }

    async generateAuthUrl(userId: string, tenantId: string): Promise<string> {
        const state = Buffer.from(
            JSON.stringify({ userId, tenantId, timestamp: Date.now() }),
        ).toString('base64');

        const redirectUri = this.getRedirectUri();
        const authUrl = this.createOAuthClient().generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
            state,
            prompt: 'consent',
        });

        this.logger.log(
            `[GSC OAuth] Generated auth URL with client_id=${this.getMaskedClientId()} redirect_uri=${redirectUri}`,
        );
        return authUrl;
    }

    private getRedirectUri(): string {
        return resolveGoogleOAuthRedirectUri(
            this.configService,
            'GOOGLE_REDIRECT_URI_GSC',
            GSC_OAUTH_CALLBACK_PATH,
        );
    }

    private getMaskedClientId(): string {
        const clientId =
            this.configService.get<string>('GOOGLE_GSC_CLIENT_ID') ||
            this.configService.get<string>('GOOGLE_CLIENT_ID') ||
            '';

        if (!clientId) {
            return 'missing';
        }

        const [prefix, domain] = clientId.split('-', 2);
        return `${prefix}-${domain ? '...' : ''}`;
    }

    async handleCallback(code: string, state: string) {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
        const { tenantId } = stateData;

        const oauth2Client = this.createOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.access_token) {
            throw new BadRequestException('Failed to get access token from Google');
        }

        if (!tokens.refresh_token) {
            this.logger.warn(`[GSC OAuth] No refresh token received for tenant ${tenantId}`);
            throw new BadRequestException(
                'Google did not return a refresh token. Remove this app from your Google Account third-party access, then try connecting again.',
            );
        }

        const sites = await this.listSites(tokens.access_token);
        if (sites.length === 0) {
            throw new BadRequestException('No Search Console properties found for this Google account');
        }

        const tempToken = uuidv4();
        await this.cacheManager.set(`gsc_temp_token:${tempToken}`, tokens.refresh_token, 600000);
        await this.cacheManager.set(`gsc_temp_sites:${tempToken}`, sites, 600000);

        return {
            status: 'select_account',
            tempToken,
            sites,
        };
    }

    async getTempSites(tempToken: string): Promise<SearchConsoleSite[]> {
        const sites = await this.cacheManager.get<SearchConsoleSite[]>(`gsc_temp_sites:${tempToken}`);
        if (!sites) {
            throw new BadRequestException('Session expired or invalid token');
        }
        return sites;
    }

    async completeConnection(tempToken: string, siteUrl: string, tenantId: string) {
        const refreshToken = await this.cacheManager.get<string>(`gsc_temp_token:${tempToken}`);
        const sites = await this.cacheManager.get<SearchConsoleSite[]>(`gsc_temp_sites:${tempToken}`);

        if (!refreshToken || !sites) {
            throw new BadRequestException('Session expired or invalid token');
        }

        const selectedSite = sites.find((site) => site.siteUrl === siteUrl);
        if (!selectedSite) {
            throw new BadRequestException('Invalid Search Console property selection');
        }

        await this.saveGscConnection(tenantId, siteUrl, refreshToken, selectedSite.permissionLevel);
        await this.cacheManager.del(`gsc_temp_token:${tempToken}`);
        await this.cacheManager.del(`gsc_temp_sites:${tempToken}`);

        // Sync initial data (30 days)
        try {
            await this.seoService.syncGscForTenant(tenantId, { days: 30 });
            this.logger.log(`[GSC Sync] Initial sync completed for tenant ${tenantId}`);
        } catch (err: any) {
            this.logger.error(`[GSC Sync] Initial sync failed for tenant ${tenantId}: ${err.message}`);
            // We don't throw here to allow the connection to remain active, but the sync status will show failure/never.
        }

        return {
            success: true,
            accountId: siteUrl,
            accountName: siteUrl,
            siteUrl,
        };
    }

    async getConnectionStatus(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { settings: true },
        });

        const settings = isJsonObject(tenant?.settings) ? tenant.settings : {};
        const seo = isJsonObject(settings.seo) ? settings.seo : {};
        const siteUrl = typeof seo.gscSiteUrl === 'string' ? seo.gscSiteUrl : null;
        const hasRefreshToken = typeof seo.gscRefreshToken === 'string' && seo.gscRefreshToken.length > 0;
        const lastSyncAt = typeof seo.gscLastSyncedAt === 'string' ? seo.gscLastSyncedAt : null;

        return {
            isConnected: !!siteUrl && hasRefreshToken,
            lastSyncAt: lastSyncAt,
            accounts: siteUrl
                ? [{
                    id: siteUrl,
                    externalId: siteUrl,
                    name: siteUrl,
                    status: hasRefreshToken ? 'ACTIVE' : 'CONFIGURED',
                    lastSyncAt: lastSyncAt,
                }]
                : [],
        };
    }

    async disconnect(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { settings: true },
        });

        const currentSettings = isJsonObject(tenant?.settings) ? tenant.settings : {};
        const currentSeoSettings = isJsonObject(currentSettings.seo) ? currentSettings.seo : {};

        // Remove GSC related settings
        const {
            gscSiteUrl,
            gscRefreshToken,
            gscPermissionLevel,
            gscConnectedAt,
            gscLastSyncedAt,
            ...otherSeoSettings
        } = currentSeoSettings;

        const updatedSettings = {
            ...currentSettings,
            seo: otherSeoSettings,
        } satisfies Prisma.InputJsonObject;

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { settings: updatedSettings },
        });

        // Optionally delete performance data
        await this.prisma.searchConsolePerformance.deleteMany({
            where: { tenantId },
        });

        return { success: true };
    }

    private async saveGscConnection(
        tenantId: string,
        siteUrl: string,
        refreshToken: string,
        permissionLevel?: string | null,
    ) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { settings: true },
        });

        const currentSettings = isJsonObject(tenant?.settings) ? tenant.settings : {};
        const currentSeoSettings = isJsonObject(currentSettings.seo) ? currentSettings.seo : {};
        const updatedSettings = {
            ...currentSettings,
            seo: {
                ...currentSeoSettings,
                gscSiteUrl: siteUrl,
                gscRefreshToken: this.encryptionService.encrypt(refreshToken),
                gscPermissionLevel: permissionLevel ?? null,
                gscConnectedAt: new Date().toISOString(),
            },
        } satisfies Prisma.InputJsonObject;

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { settings: updatedSettings },
        });
    }

    private async listSites(accessToken: string): Promise<SearchConsoleSite[]> {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const searchconsole = google.searchconsole({ version: 'v1', auth });
        const response = await searchconsole.sites.list();
        const sites = response.data.siteEntry ?? [];

        return sites
            .filter((site) => !!site.siteUrl)
            .map((site) => ({
                siteUrl: site.siteUrl!,
                permissionLevel: site.permissionLevel,
            }));
    }
}
