import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SeoPremiumCards } from '../components/seo-premium-cards';
import { SeoSummaryCards } from '../components/seo-summary-cards';
import { TrafficByLocation } from '../components/traffic-by-location';
import { SeoPerformanceChart } from '../components/seo-performance-chart';
import { useSeoSummary } from '../hooks';
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
import { Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { integrationService } from '@/services/integration-service';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/use-translation';

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
                <TooltipContent
                    side="top"
                    className="max-w-xs text-sm leading-relaxed"
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function SeoPage() {
    const { t } = useTranslation('seo');
    const { data, isLoading, refetch } = useSeoSummary();
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Sync GA4
            try {
                await integrationService.syncGoogleAnalytics();
                toast.success(t('page.toasts.syncGaSuccess'));
            } catch (error) {
                toast.error(t('page.toasts.syncGaFailed'));
            }

            // Sync GSC
            try {
                await integrationService.syncGoogleSearchConsole(30);
                toast.success(t('page.toasts.syncGscSuccess'));
            } catch (error) {
                toast.error(t('page.toasts.syncGscFailed'));
            }

            await refetch();
        } finally {
            setIsSyncing(false);
        }
    };

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
        trafficCost: null,
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 p-4 sm:p-6 md:p-8">
                {/* Page Header */}
                <div data-tutorial="seo-header">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-2">
                        {t('page.title')}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                        <AdsConnectionStatus />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
                            />
                            {isSyncing
                                ? t('page.syncing')
                                : t('page.refreshData')}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        {t('page.subtitle')}
                    </p>
                </div>

                {/* Section 1: Performance Summary */}
                <section data-tutorial="seo-performance" className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {t('page.sections.performanceSummary')}
                        </h2>
                        <InfoTooltip
                            content={t(
                                'page.sections.performanceSummaryTooltip'
                            )}
                        />
                    </div>
                    <SeoSummaryCards data={displayData} isLoading={isLoading} />
                </section>

                {/* Section 2: Performance Trends */}
                <section
                    data-tutorial="seo-performance-trends"
                    className="space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {t('page.sections.performanceTrends')}
                        </h2>
                        <InfoTooltip
                            content={t(
                                'page.sections.performanceTrendsTooltip'
                            )}
                        />
                    </div>
                    <SeoPerformanceChart />
                </section>

                {/* Section 3: Keyword & Traffic Analysis */}
                <section
                    data-tutorial="seo-keyword-analysis"
                    className="space-y-3"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {t('page.sections.keywordTrafficAnalysis')}
                        </h2>
                        <InfoTooltip
                            content={t(
                                'page.sections.keywordTrafficAnalysisTooltip'
                            )}
                        />
                    </div>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-max">
                        {/* Top Organic Keywords */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">
                                    {t('page.sections.topOrganicKeywords')}
                                </h3>
                                <InfoTooltip
                                    content={t(
                                        'page.sections.topOrganicKeywordsTooltip'
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <TopOrganicKeywords />
                            </div>
                        </div>

                        {/* Traffic by Location */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">
                                    {t('page.sections.trafficByLocation')}
                                </h3>
                                <InfoTooltip
                                    content={t(
                                        'page.sections.trafficByLocationTooltip'
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <TrafficByLocation isLoading={isLoading} />
                            </div>
                        </div>

                        {/* Keywords by Intent */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">
                                    {t('page.sections.keywordsByIntent')}
                                </h3>
                                <InfoTooltip
                                    content={t(
                                        'page.sections.keywordsByIntentTooltip'
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <OrganicKeywordsByIntent
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        {/* Anchor Text Analysis */}
                        <div className="space-y-3 w-full">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium">
                                    {t('page.sections.anchorTextAnalysis')}
                                </h3>
                                <InfoTooltip
                                    content={t(
                                        'page.sections.anchorTextAnalysisTooltip'
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <SeoAnchorText />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Off-Page & Authority */}
                <section
                    data-tutorial="seo-offpage-metrics"
                    className="space-y-6"
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {t('page.sections.offPageAuthority')}
                        </h2>
                        <InfoTooltip
                            content={t('page.sections.offPageAuthorityTooltip')}
                        />
                    </div>

                    {/* Advanced SEO Metrics Sub-section */}
                    <div className="space-y-3">
                        <h3 className="text-base font-medium text-muted-foreground">
                            {t('page.sections.authorityMetrics')}
                        </h3>
                        <SeoPremiumCards
                            data={displayData}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Off-Page Metrics Sub-section */}
                    <div className="space-y-3">
                        <h3 className="text-base font-medium text-muted-foreground">
                            {t('page.sections.backlinkProfile')}
                        </h3>
                        <SeoOffPageMetrics />
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
