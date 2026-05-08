import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

interface BingUserSite {
    Url: string;
    VerificationMethod: string;
    VerificationState: string;
}

interface BingLinkCount {
    TotalPages: number;
    TotalLinks: number;
}

interface BingLink {
    SourceUrl: string;
    DateFirstSeen: string;
    DateLastSeen: string;
    AnchorText: string;
    LinkType: string;
    PageTitle: string;
    StatusCode: number;
}

@Injectable()
export class BingWebmasterService {
    private readonly logger = new Logger(BingWebmasterService.name);
    private readonly baseUrl = 'https://ssl.bing.com/webmaster/api.svc/json';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) { }

    private getApiKey(): string {
        return this.configService.get<string>('BING_WEBMASTER_API_KEY') || '96199516b15447ac97ea34ffc10ce366';
    }

    private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
        const apiKey = this.getApiKey();
        const url = `${this.baseUrl}/${endpoint}?apikey=${apiKey}`;

        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        const fullUrl = queryParams.toString() ? `${url}&${queryParams.toString()}` : url;

        try {
            const response = await firstValueFrom(
                this.httpService.get(fullUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            );
            return response.data;
        } catch (error: any) {
            this.logger.error(`Bing Webmaster API error for ${endpoint}:`, error.response?.data || error.message);
            throw error;
        }
    }

    async getUserSites(tenantId: string): Promise<BingUserSite[]> {
        const data = await this.makeRequest('GetUserSites');
        const sites = data.d || [];
        await this.saveBingSitesForTenant(tenantId, sites);
        return sites;
    }

    async getLinkCounts(siteUrl: string): Promise<BingLinkCount> {
        const data = await this.makeRequest('GetLinkCounts', { siteurl: siteUrl });
        return data.d || { TotalPages: 0, TotalLinks: 0 };
    }

    private async saveBingSitesForTenant(tenantId: string, sites: BingUserSite[]) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        const existingSettings = tenant?.settings || {};
        const settings = typeof existingSettings === 'string'
            ? JSON.parse(existingSettings)
            : (typeof existingSettings === 'object' && existingSettings !== null)
                ? { ...existingSettings }
                : {};

        const currentSeo = settings.seo && typeof settings.seo === 'string'
            ? JSON.parse(settings.seo)
            : { ...(settings.seo || {}) };

        currentSeo.bingSites = sites;
        settings.seo = currentSeo;

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                settings,
            },
        });
    }

    async getLinks(siteUrl: string, start: number = 0, count: number = 100): Promise<BingLink[]> {
        const data = await this.makeRequest('GetLinks', {
            siteurl: siteUrl,
            start: start,
            count: count
        });
        return data.d || [];
    }

    async syncBacklinksForTenant(tenantId: string) {
        try {
            this.logger.log(`Starting Bing backlinks sync for tenant ${tenantId}`);

            // Get tenant's configured site URL
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
            });

            const settings = tenant?.settings || {};
            const parsedSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
            const seoSettings = parsedSettings?.seo || {};
            const siteUrl = seoSettings?.bingSiteUrl;

            if (!siteUrl) {
                throw new Error('No Bing site URL configured for tenant');
            }

            // Get all backlinks
            const allLinks: BingLink[] = [];
            let start = 0;
            const batchSize = 100;

            while (true) {
                const links = await this.getLinks(siteUrl, start, batchSize);
                if (links.length === 0) break;

                allLinks.push(...links);
                start += batchSize;

                // Safety limit
                if (start > 10000) break;
            }

            this.logger.log(`Fetched ${allLinks.length} backlinks for ${siteUrl}`);

            // Process and save backlinks data
            await this.saveBacklinksData(tenantId, siteUrl, allLinks);

            return {
                success: true,
                backlinksCount: allLinks.length,
                siteUrl
            };

        } catch (error: any) {
            this.logger.error(`Failed to sync Bing backlinks for tenant ${tenantId}:`, error.message);
            throw error;
        }
    }

    private async saveBacklinksData(tenantId: string, siteUrl: string, links: BingLink[]) {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Calculate metrics
            const totalBacklinks = links.length;
            const referringDomains = new Set(links.map(link => {
                try {
                    return new URL(link.SourceUrl).hostname;
                } catch {
                    return link.SourceUrl;
                }
            })).size;

            // Group by anchor text
            const anchorTextMap = new Map<string, { count: number; domains: Set<string> }>();
            links.forEach(link => {
                const anchor = link.AnchorText || '';
                if (!anchorTextMap.has(anchor)) {
                    anchorTextMap.set(anchor, { count: 0, domains: new Set() });
                }
                const data = anchorTextMap.get(anchor)!;
                data.count++;
                try {
                    data.domains.add(new URL(link.SourceUrl).hostname);
                } catch {
                    data.domains.add(link.SourceUrl);
                }
            });

            // Save offpage snapshot
            const existingSnapshot = await this.prisma.seoOffpageMetricSnapshots.findUnique({
                where: {
                    tenantId_date: {
                        tenantId,
                        date: today,
                    }
                }
            });

            if (existingSnapshot) {
                await this.prisma.seoOffpageMetricSnapshots.update({
                    where: {
                        tenantId_date: {
                            tenantId,
                            date: today,
                        }
                    },
                    data: {
                        backlinks: totalBacklinks,
                        referringDomains,
                        ur: 0,
                        dr: 0,
                        organicTrafficValue: 0,
                    }
                });
            } else {
                await this.prisma.seoOffpageMetricSnapshots.create({
                    data: {
                        tenantId,
                        date: today,
                        backlinks: totalBacklinks,
                        referringDomains,
                        ur: 0,
                        dr: 0,
                        keywords: 0,
                        trafficCost: 0,
                        organicTraffic: 0,
                        organicTrafficValue: 0,
                    }
                });
            }

            // Save anchor texts
            const anchorTextRecords = Array.from(anchorTextMap.entries()).map(([anchorText, data]) => ({
                tenantId,
                date: today,
                anchorText,
                domains: data.domains.size,
                referringDomains: data.domains.size,
                totalBacklinks: data.count,
                dofollowBacklinks: data.count,
                traffic: 0,
                trafficPercentage: 0,
            }));

            // Clear existing anchor texts for this tenant
            await this.prisma.seoAnchorText.deleteMany({
                where: { tenantId }
            });

            // Insert new anchor texts
            if (anchorTextRecords.length > 0) {
                await this.prisma.seoAnchorText.createMany({
                    data: anchorTextRecords,
                    skipDuplicates: true,
                });
            }

            this.logger.log(`Saved backlinks data: ${totalBacklinks} backlinks, ${referringDomains} domains, ${anchorTextRecords.length} anchor texts`);
        } catch (error: any) {
            this.logger.error(`Failed to save backlinks data for tenant ${tenantId}:`, error.message);
            throw new Error(`Database error while saving backlinks: ${error.message}`);
        }
    }

    async getSiteUrl(tenantId: string): Promise<string | null> {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        const settings = tenant?.settings || {};
        const parsedSettings = typeof settings === 'string' ? JSON.parse(settings) : settings;
        const seoSettings = parsedSettings?.seo || {};
        return seoSettings?.bingSiteUrl || null;
    }

    async setSiteUrl(tenantId: string, siteUrl: string) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        const existingSettings = tenant?.settings || {};
        const settings = typeof existingSettings === 'string'
            ? JSON.parse(existingSettings)
            : (typeof existingSettings === 'object' && existingSettings !== null)
                ? { ...existingSettings }
                : {};

        const currentSeo = settings.seo && typeof settings.seo === 'string'
            ? JSON.parse(settings.seo)
            : { ...(settings.seo || {}) };

        currentSeo.bingSiteUrl = siteUrl;
        settings.seo = currentSeo;

        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                settings,
            },
        });
    }
}