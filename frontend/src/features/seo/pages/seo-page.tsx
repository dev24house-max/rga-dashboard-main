import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SeoPremiumCards } from '../components/seo-premium-cards';
import { SeoSummaryCards } from '../components/seo-summary-cards';
import { TrafficByLocation } from '../components/traffic-by-location';
import { SeoPerformanceChart } from '../components/seo-performance-chart';
import { useSeoSummary } from '../hooks';
import { useIntegrationStatus } from '@/hooks/useIntegrationStatus';
import { SeoMetricSummary } from '../types';
import { OrganicKeywordsByIntent } from '../components/organic-keywords-by-intent';
import { AdsConnectionStatus } from '../components/ads-connection-status';
import { SeoAnchorText } from '../components/seo-anchor-text';
import { TopOrganicKeywords } from '../components/top-organic-keywords';
import { SeoOffPageMetrics } from '../components/seo-offpage-metrics';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// =============================================================================
// Info Tooltip Component
// =============================================================================

function InfoTooltip({ content }: { content: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function SeoPage() {
    const { data, isLoading } = useSeoSummary();
    const { status: integrationStatus, isLoading: integrationLoading, error: integrationError } = useIntegrationStatus();

    // Default fallback data if API fails or is loading (to prevent crash)
    const displayData: SeoMetricSummary = data || {
        organicSessions: 0,
        organicSessionsTrend: 0,
        goalCompletions: null,
        avgPosition: null,
        avgTimeOnPage: 0,
        avgTimeOnPageTrend: 0,
        bounceRate: 0,
        ur: null,
        dr: null,
        backlinks: null,
        referringDomains: null,
        keywords: null,
        trafficCost: null
    };


    return (
        <DashboardLayout>
            <div className="space-y-6 p-4 sm:p-6 md:p-8">
                {/* Page Header */}
                <div data-tutorial="seo-header">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-2">SEO & Web Analytics</h1>
                    <div className="flex items-center gap-3 mb-3">
                        <AdsConnectionStatus
                            data={integrationStatus}
                            isLoading={integrationLoading}
                            error={integrationError ?? null}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Track your organic search performance and website engagement.
                    </p>
                </div>

                {/* Section 1: Performance Summary */}
                <section data-tutorial="seo-performance" className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Performance Summary</h2>
                        <InfoTooltip content="Key metrics including organic sessions, engagement time, bounce rate, and goal completions from Google Analytics." />
                    </div>
                    <SeoSummaryCards data={displayData} isLoading={isLoading} />
                </section>

                {/* Section 2: Performance Trends */}
                <section data-tutorial="seo-performance-trends" className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Performance Trends</h2>
                        <InfoTooltip content="Track your organic search performance metrics over time including sessions, clicks, and rankings." />
                    </div>
                    <SeoPerformanceChart />
                </section>

                {/* Section 3: Keyword & Traffic Analysis */}
                <section data-tutorial="seo-keyword-analysis" className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Keyword & Traffic Analysis</h2>
                        <InfoTooltip content="Comprehensive analysis of your organic keywords, traffic sources, search intent, and anchor text patterns." />
                    </div>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-max">
                        {/* Top Organic Keywords */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">Top Organic Keywords</h3>
                                <InfoTooltip content="Your highest-performing keywords ranked in organic search results, ranked by traffic and position." />
                            </div>
                            <div className="w-full">
                                <TopOrganicKeywords />
                            </div>
                        </div>

                        {/* Traffic by Location */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">Traffic by Location</h3>
                                <InfoTooltip content="Geographic distribution of your organic search traffic showing which regions drive the most sessions." />
                            </div>
                            <div className="w-full">
                                <TrafficByLocation isLoading={isLoading} />
                            </div>
                        </div>

                        {/* Keywords by Intent */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">Keywords by Intent</h3>
                                <InfoTooltip content="Keywords grouped by search intent type including informational, navigational, and transactional queries." />
                            </div>
                            <div className="w-full">
                                <OrganicKeywordsByIntent isLoading={isLoading} />
                            </div>
                        </div>

                        {/* Anchor Text Analysis */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">Anchor Text Analysis</h3>
                                <InfoTooltip content="Analysis of anchor text used in backlinks pointing to your site, helping identify linking patterns and opportunities." />
                            </div>
                            <div className="w-full">
                                <SeoAnchorText />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Off-Page & Authority */}
                <section data-tutorial="seo-offpage-metrics" className="space-y-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Off-Page & Authority</h2>
                        <InfoTooltip content="External SEO factors including domain authority, backlink profile, referring domains, and link quality analysis from Ahrefs data." />
                    </div>

                    {/* Advanced SEO Metrics Sub-section */}
                    <div className="space-y-3">
                        <h3 className="text-base font-medium text-muted-foreground">Authority Metrics</h3>
                        <SeoPremiumCards data={displayData} isLoading={isLoading} />
                    </div>

                    {/* Off-Page Metrics Sub-section */}
                    <div className="space-y-3">
                        <h3 className="text-base font-medium text-muted-foreground">Backlink Profile</h3>
                        <SeoOffPageMetrics />
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
