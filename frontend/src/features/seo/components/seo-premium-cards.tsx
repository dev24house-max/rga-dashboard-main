import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoveUpRight, HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SeoMetricSummary } from '../types';
import { useTranslation } from '@/i18n/use-translation';

interface SeoPremiumCardsProps {
    data: SeoMetricSummary;
    isLoading?: boolean;
}

type SeoT = (path: string, params?: Record<string, string | number>) => string;

const getSeoPremiumMetricTooltip = (
    metric: string,
    data: SeoMetricSummary,
    t: SeoT
) => {
    const safe = (val: number | null | undefined) =>
        val === undefined || val === null || isNaN(val) ? 0 : val;
    const ur = safe(data.ur);
    const dr = safe(data.dr);
    const backlinks = safe(data.backlinks);
    const referringDomains = safe(data.referringDomains);
    const organicSessions = safe(data.organicSessions);

    switch (metric) {
        case 'ur':
            if (ur === 0)
                return {
                    explanation: t('premiumCards.tooltips.ur.explanation'),
                    contextual: t('premiumCards.tooltips.ur.contextualEmpty'),
                };
            return {
                explanation: t('premiumCards.tooltips.ur.explanation'),
                contextual:
                    ur >= 80
                        ? t('premiumCards.tooltips.ur.contextualExcellent', {
                              score: ur,
                          })
                        : ur >= 60
                          ? t('premiumCards.tooltips.ur.contextualGood', {
                                score: ur,
                            })
                          : ur >= 30
                            ? t('premiumCards.tooltips.ur.contextualFair', {
                                  score: ur,
                              })
                            : t('premiumCards.tooltips.ur.contextualLow', {
                                  score: ur,
                              }),
            };
        case 'dr':
            if (dr === 0)
                return {
                    explanation: t('premiumCards.tooltips.dr.explanation'),
                    contextual: t('premiumCards.tooltips.dr.contextualEmpty'),
                };
            return {
                explanation: t('premiumCards.tooltips.dr.explanation'),
                contextual:
                    dr >= 80
                        ? t('premiumCards.tooltips.dr.contextualOutstanding', {
                              score: dr,
                          })
                        : dr >= 60
                          ? t('premiumCards.tooltips.dr.contextualStrong', {
                                score: dr,
                            })
                          : dr >= 30
                            ? t('premiumCards.tooltips.dr.contextualModerate', {
                                  score: dr,
                              })
                            : t('premiumCards.tooltips.dr.contextualLow', {
                                  score: dr,
                              }),
            };
        case 'backlinks':
            return {
                explanation: t('premiumCards.tooltips.backlinks.explanation'),
                contextual:
                    backlinks === 0
                        ? t('premiumCards.tooltips.backlinks.contextualEmpty')
                        : t('premiumCards.tooltips.backlinks.contextualValue', {
                              backlinks: backlinks.toLocaleString(),
                              domains: referringDomains.toLocaleString(),
                          }),
            };
        case 'organicSearch':
            return {
                explanation: t(
                    'premiumCards.tooltips.organicSearch.explanation'
                ),
                contextual:
                    organicSessions === 0
                        ? t(
                              'premiumCards.tooltips.organicSearch.contextualEmpty'
                          )
                        : t(
                              'premiumCards.tooltips.organicSearch.contextualValue',
                              { count: organicSessions.toLocaleString() }
                          ),
            };
        default:
            return {
                explanation: t('premiumCards.tooltips.default.explanation'),
                contextual: t('premiumCards.tooltips.default.contextual'),
            };
    }
};

const SeoPremiumMetricTooltip = ({
    metric,
    data,
    children,
}: {
    metric: string;
    data: SeoMetricSummary;
    children: React.ReactNode;
}) => {
    const { t } = useTranslation('seo');
    const tip = getSeoPremiumMetricTooltip(metric, data, t);
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[260px] p-0 border-0 shadow-2xl overflow-hidden rounded-[10px]"
                    style={{ background: '#111827' }}
                >
                    <div className="px-3.5 pt-2.5 pb-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                                className="w-0.5 h-3.5 rounded-full shrink-0"
                                style={{ background: '#F97316' }}
                            />
                            <span
                                className="text-[10px] font-medium uppercase tracking-wider"
                                style={{ color: '#FB923C' }}
                            >
                                {t(`premiumCards.tooltipHeaders.${metric}`)}
                            </span>
                        </div>
                        <p className="text-[12.5px] text-slate-100 leading-relaxed m-0">
                            {tip.explanation}
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export function SeoPremiumCards({ data, isLoading }: SeoPremiumCardsProps) {
    const { t } = useTranslation('seo');

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse h-48 bg-white/50" />
                ))}
            </div>
        );
    }

    const r = 38;
    const circumference = r * 2 * Math.PI;
    const arc = circumference * 0.75;

    const GaugeCard = ({
        title,
        metric,
        value,
        colorClass,
    }: {
        title: string;
        metric: string;
        value: number | null;
        colorClass: string;
    }) => {
        const offset = arc - ((value ?? 0) / 100) * arc;
        return (
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 min-w-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric={metric} data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 pb-4 flex justify-center">
                    <div
                        className="relative flex items-center justify-center"
                        style={{ width: 120, height: 120 }}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            width={120}
                            height={120}
                            className="rotate-135"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r={r}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-100"
                                strokeDasharray={`${arc} ${circumference}`}
                                strokeLinecap="round"
                            />
                            {value !== null && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={r}
                                    fill="none"
                                    strokeWidth="8"
                                    className={colorClass}
                                    strokeDasharray={`${arc} ${circumference}`}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    style={{
                                        transition:
                                            'stroke-dashoffset 1s ease-out',
                                    }}
                                />
                            )}
                        </svg>
                        <span
                            className={`absolute text-3xl font-bold ${value === null ? 'text-gray-300' : 'text-gray-900'}`}
                        >
                            {value ?? 0}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <GaugeCard
                title="UR"
                metric="ur"
                value={data.ur}
                colorClass="stroke-green-500"
            />
            <GaugeCard
                title="DR"
                metric="dr"
                value={data.dr}
                colorClass="stroke-orange-400"
            />

            {/* Backlinks Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 min-w-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('premiumCards.backlinks')}
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="backlinks" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 pb-5 space-y-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">
                            {data.backlinks
                                ? data.backlinks.toLocaleString()
                                : '0'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {t('premiumCards.totalBacklinks')}
                        </span>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>{t('premiumCards.referringDomains')}</span>
                            <span className="font-medium text-gray-900">
                                {data.referringDomains
                                    ? data.referringDomains.toLocaleString()
                                    : '0'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('premiumCards.keywords')}</span>
                            <span className="font-medium text-gray-900">
                                {data.keywords
                                    ? data.keywords.toLocaleString()
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('premiumCards.trafficCost')}</span>
                            <span className="font-medium text-gray-900">
                                $
                                {data.trafficCost
                                    ? data.trafficCost.toLocaleString()
                                    : '0'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Organic Search Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 min-w-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t('premiumCards.organicSearch')}
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="organicSearch" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 pb-5 space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-green-500">
                                {data.organicSessions.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {t('premiumCards.totalTraffic')}
                            </span>
                        </div>
                        {data.organicSessionsTrend !== undefined && (
                            <div
                                className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full ${data.organicSessionsTrend >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}
                            >
                                <MoveUpRight
                                    className={`h-3 w-3 ${data.organicSessionsTrend < 0 ? 'rotate-90' : ''}`}
                                />
                                {Math.abs(data.organicSessionsTrend)}%
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>{t('premiumCards.keywords')}</span>
                            <span className="font-medium text-gray-900">
                                {data.keywords
                                    ? data.keywords.toLocaleString()
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('premiumCards.trafficCost')}</span>
                            <span className="font-medium text-gray-900">
                                $
                                {data.trafficCost
                                    ? data.trafficCost.toLocaleString()
                                    : '0'}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
