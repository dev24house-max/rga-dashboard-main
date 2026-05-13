import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { google } from 'googleapis';
import { EncryptionService } from '../../common/services/encryption.service';

function isJsonObject(value: Prisma.JsonValue | null | undefined): value is Prisma.JsonObject {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

@Injectable()
export class GoogleSearchConsoleService {
    private readonly logger = new Logger(GoogleSearchConsoleService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
    ) { }

    getSiteUrl(tenantSettings?: any): string | null {
        const fromTenant = tenantSettings?.seo?.gscSiteUrl;
        const fromEnv = this.configService.get<string>('GSC_SITE_URL');
        return (fromTenant || fromEnv || null) as string | null;
    }

    hasCredentials(tenantSettings?: Prisma.JsonValue | null): boolean {
        if (this.getEncryptedRefreshToken(tenantSettings)) {
            return true;
        }

        const json = this.configService.get<string>('GSC_SERVICE_ACCOUNT_JSON');
        const keyFile = this.configService.get<string>('GSC_SERVICE_ACCOUNT_KEY_FILE');
        return !!(json || keyFile);
    }

    getEncryptedRefreshToken(tenantSettings?: Prisma.JsonValue | null): string | null {
        const settings = isJsonObject(tenantSettings) ? tenantSettings : {};
        const seo = isJsonObject(settings.seo) ? settings.seo : {};
        return typeof seo.gscRefreshToken === 'string' ? seo.gscRefreshToken : null;
    }

    private getAuth(encryptedRefreshToken?: string | null) {
        if (encryptedRefreshToken) {
            const oauth2Client = new google.auth.OAuth2(
                this.configService.get<string>('GOOGLE_CLIENT_ID'),
                this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
            );
            oauth2Client.setCredentials({
                refresh_token: this.encryptionService.decrypt(encryptedRefreshToken),
            });
            return oauth2Client;
        }

        const json = this.configService.get<string>('GSC_SERVICE_ACCOUNT_JSON');
        const keyFile = this.configService.get<string>('GSC_SERVICE_ACCOUNT_KEY_FILE');
        const scopes = ['https://www.googleapis.com/auth/webmasters.readonly'];

        if (json) {
            try {
                const credentials = JSON.parse(json);
                return new google.auth.GoogleAuth({ credentials, scopes });
            } catch (error: any) {
                throw new Error(`Invalid GSC_SERVICE_ACCOUNT_JSON: ${error.message}`);
            }
        }

        if (keyFile) {
            return new google.auth.GoogleAuth({ keyFile, scopes });
        }

        throw new Error('GSC credentials not configured');
    }

    async querySearchAnalytics(params: {
        siteUrl: string;
        startDate: string;
        endDate: string;
        rowLimit?: number;
        startRow?: number;
        dimensions?: string[];
        encryptedRefreshToken?: string | null;
    }) {
        const auth = this.getAuth(params.encryptedRefreshToken);

        const searchconsole = google.searchconsole({
            version: 'v1',
            auth,
        });

        try {
            const response = await searchconsole.searchanalytics.query({
                siteUrl: params.siteUrl,
                requestBody: {
                    startDate: params.startDate,
                    endDate: params.endDate,
                    dimensions: params.dimensions ?? ['date', 'page', 'query', 'device', 'country'],
                    startRow: params.startRow ?? 0,
                    rowLimit: params.rowLimit ?? 25000,
                },
            });

            return response.data;
        } catch (error: any) {
            this.logger.error(`GSC query failed: ${error.message}`);
            throw error;
        }
    }
}
