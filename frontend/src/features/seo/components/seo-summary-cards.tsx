import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowDownRight,
    ArrowUpRight,
    Target,
    Timer,
    Trophy,
    Users,
    HelpCircle,
    Eye,
    Activity,
    MousePointerClick,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SeoMetricSummary } from '../types';
import { useTranslation } from '@/i18n/use-translation';

interface SeoSummaryCardsProps {
    data: SeoMetricSummary;
    isLoading?: boolean;
}

type SeoT = (path: string, params?: Record<string, string | number>) => string;

// SEO Metric tooltip content with contextual logic
const getSeoMetricTooltip = (
    metric: string,
    data: SeoMetricSummary,
    t: SeoT
) => {
    const safe = (val: number | null | undefined) =>
        val === undefined || val === null || isNaN(val) ? 0 : val;

    const organicSessions = safe(data.organicSessions);
    const goalCompletions = safe(data.goalCompletions);
    const avgPosition = safe(data.avgPosition);
    const avgTimeOnPage = safe(data.avgTimeOnPage);

    switch (metric) {
        case 'organicSessions':
            return {
                explanation: t(
                    'summaryCards.tooltips.organicSessions.explanation'
                ),
                contextual:
                    organicSessions === 0
                        ? t(
                              'summaryCards.tooltips.organicSessions.contextualEmpty'
                          )
                        : t(
                              'summaryCards.tooltips.organicSessions.contextualValue',
                              { count: organicSessions.toLocaleString() }
                          ),
            };

        case 'goalCompletions':
            return {
                explanation: t(
                    'summaryCards.tooltips.goalCompletions.explanation'
                ),
                contextual:
                    goalCompletions === 0
                        ? t(
                              'summaryCards.tooltips.goalCompletions.contextualEmpty'
                          )
                        : t(
                              'summaryCards.tooltips.goalCompletions.contextualValue',
                              { count: goalCompletions.toLocaleString() }
                          ),
            };

        case 'avgPosition':
            if (avgPosition === 0) {
                return {
                    explanation: t(
                        'summaryCards.tooltips.avgPosition.explanation'
                    ),
                    contextual: t(
                        'summaryCards.tooltips.avgPosition.contextualEmpty'
                    ),
                };
            }
            return {
                explanation: t('summaryCards.tooltips.avgPosition.explanation'),
                contextual:
                    avgPosition <= 3
                        ? t(
                              'summaryCards.tooltips.avgPosition.contextualExcellent',
                              { position: avgPosition.toFixed(1) }
                          )
                        : avgPosition <= 10
                          ? t(
                                'summaryCards.tooltips.avgPosition.contextualGood',
                                { position: avgPosition.toFixed(1) }
                            )
                          : t(
                                'summaryCards.tooltips.avgPosition.contextualLow',
                                { position: avgPosition.toFixed(1) }
                            ),
            };

        case 'avgTimeOnPage':
            return {
                explanation: t(
                    'summaryCards.tooltips.avgTimeOnPage.explanation'
                ),
                contextual:
                    avgTimeOnPage < 30
                        ? t(
                              'summaryCards.tooltips.avgTimeOnPage.contextualLow',
                              { seconds: Math.floor(avgTimeOnPage) }
                          )
                        : avgTimeOnPage < 120
                          ? t(
                                'summaryCards.tooltips.avgTimeOnPage.contextualDecent',
                                {
                                    minutes: Math.floor(avgTimeOnPage / 60),
                                    seconds: Math.floor(avgTimeOnPage % 60),
                                }
                            )
                          : t(
                                'summaryCards.tooltips.avgTimeOnPage.contextualExcellent',
                                {
                                    minutes: Math.floor(avgTimeOnPage / 60),
                                    seconds: Math.floor(avgTimeOnPage % 60),
                                }
                            ),
            };

        case 'activeUsers':
            return {
                explanation: t('summaryCards.tooltips.activeUsers.explanation'),
                contextual:
                    data.activeUsers === undefined || data.activeUsers === null
                        ? t('summaryCards.tooltips.activeUsers.contextualEmpty')
                        : t(
                              'summaryCards.tooltips.activeUsers.contextualValue',
                              { count: data.activeUsers.toLocaleString() }
                          ),
            };

        case 'screenPageViews':
            return {
                explanation: t(
                    'summaryCards.tooltips.screenPageViews.explanation'
                ),
                contextual:
                    data.screenPageViews === undefined ||
                    data.screenPageViews === null
                        ? t(
                              'summaryCards.tooltips.screenPageViews.contextualEmpty'
                          )
                        : t(
                              'summaryCards.tooltips.screenPageViews.contextualValue',
                              {
                                  count: data.screenPageViews.toLocaleString(),
                              }
                          ),
            };

        case 'engagementRate':
            return {
                explanation: t(
                    'summaryCards.tooltips.engagementRate.explanation'
                ),
                contextual:
                    data.engagementRate === undefined ||
                    data.engagementRate === null
                        ? t(
                              'summaryCards.tooltips.engagementRate.contextualEmpty'
                          )
                        : t(
                              'summaryCards.tooltips.engagementRate.contextualValue',
                              { rate: data.engagementRate }
                          ),
            };

        case 'bounceRate':
            return {
                explanation: t('summaryCards.tooltips.bounceRate.explanation'),
                contextual:
                    data.bounceRate === undefined || data.bounceRate === null
                        ? t('summaryCards.tooltips.bounceRate.contextualEmpty')
                        : data.bounceRate <= 40
                          ? t(
                                'summaryCards.tooltips.bounceRate.contextualLow',
                                { rate: data.bounceRate }
                            )
                          : data.bounceRate <= 60
                            ? t(
                                  'summaryCards.tooltips.bounceRate.contextualModerate',
                                  { rate: data.bounceRate }
                              )
                            : t(
                                  'summaryCards.tooltips.bounceRate.contextualHigh',
                                  { rate: data.bounceRate }
                              ),
            };

        default:
            return {
                explanation: t('summaryCards.tooltips.default.explanation'),
                contextual: t('summaryCards.tooltips.default.contextual'),
            };
    }
};

const SeoMetricTooltip = ({
    metric,
    data,
    children,
}: {
    metric: string;
    data: SeoMetricSummary;
    children: React.ReactNode;
}) => {
    const { t } = useTranslation('seo');
    const tip = getSeoMetricTooltip(metric, data, t);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[260px] p-0 border-0 shadow-2xl overflow-hidden rounded-[10px]"
                    style={{ background: '#111827' }}
                >
                    <div>
                        {/* Header with orange accent */}
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
                                    {t(`summaryCards.tooltipHeaders.${metric}`)}
                                </span>
                            </div>
                            <p className="text-[12.5px] text-slate-100 leading-relaxed m-0">
                                {tip.explanation}
                            </p>
                            <p className="text-[12.5px] text-slate-300 leading-relaxed mt-2">
                                {tip.contextual}
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export function SeoSummaryCards({ data, isLoading }: SeoSummaryCardsProps) {
    const { t } = useTranslation('seo');
    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return t('summaryCards.duration', {
            minutes,
            seconds: remainingSeconds,
        });
    };
    const formatTrend = (value?: number | null) =>
        `${value && value > 0 ? '+' : ''}${value ?? 0}%`;

    const metrics = [
        {
            title: t('summaryCards.titles.organicSessions'),
            value: data.organicSessions.toLocaleString(),
            icon: Users,
            trend: formatTrend(data.organicSessionsTrend),
            trendUp: (data.organicSessionsTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.organicSessions'),
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            metric: 'organicSessions',
        },
        {
            title: t('summaryCards.titles.goalCompletions'),
            value:
                data.goalCompletions !== null
                    ? data.goalCompletions.toLocaleString()
                    : '-',
            icon: Target,
            trend: formatTrend(data.goalCompletionsTrend),
            trendUp: (data.goalCompletionsTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.goalCompletions'),
            color: 'text-green-500',
            bg: 'bg-green-50',
            metric: 'goalCompletions',
        },
        {
            title: t('summaryCards.titles.avgPosition'),
            value:
                data.avgPosition !== null ? data.avgPosition.toFixed(1) : '-',
            icon: Trophy,
            trend: formatTrend(data.avgPositionTrend),
            trendUp: (data.avgPositionTrend ?? 0) <= 0,
            description: t('summaryCards.descriptions.avgPosition'),
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            metric: 'avgPosition',
        },
        {
            title: t('summaryCards.titles.avgTimeOnPage'),
            value: formatDuration(data.avgTimeOnPage),
            icon: Timer,
            trend: formatTrend(data.avgTimeOnPageTrend),
            trendLabel: t('summaryCards.trendVsPrev', {
                trend: `${data.avgTimeOnPageTrend && data.avgTimeOnPageTrend > 0 ? '+' : ''}${data.avgTimeOnPageTrend ?? 0}`,
            }),
            trendUp: (data.avgTimeOnPageTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.avgTimeOnPage'),
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            metric: 'avgTimeOnPage',
        },
        {
            title: t('summaryCards.titles.activeUsers'),
            value:
                data.activeUsers !== undefined
                    ? data.activeUsers.toLocaleString()
                    : '-',
            icon: Users,
            trend: formatTrend(data.activeUsersTrend),
            trendUp: (data.activeUsersTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.activeUsers'),
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            metric: 'activeUsers',
        },
        {
            title: t('summaryCards.titles.screenPageViews'),
            value:
                data.screenPageViews !== undefined
                    ? data.screenPageViews.toLocaleString()
                    : '-',
            icon: Eye,
            trend: formatTrend(data.screenPageViewsTrend),
            trendUp: (data.screenPageViewsTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.screenPageViews'),
            color: 'text-sky-500',
            bg: 'bg-sky-50',
            metric: 'screenPageViews',
        },
        {
            title: t('summaryCards.titles.engagementRate'),
            value:
                data.engagementRate !== undefined
                    ? `${data.engagementRate}%`
                    : '-',
            icon: Activity,
            trend: formatTrend(data.engagementRateTrend),
            trendUp: (data.engagementRateTrend ?? 0) >= 0,
            description: t('summaryCards.descriptions.engagementRate'),
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            metric: 'engagementRate',
        },
        {
            title: t('summaryCards.titles.bounceRate'),
            value: data.bounceRate !== undefined ? `${data.bounceRate}%` : '-',
            icon: MousePointerClick,
            trend: formatTrend(data.bounceRateTrend),
            trendUp: (data.bounceRateTrend ?? 0) <= 0,
            description: t('summaryCards.descriptions.bounceRate'),
            color: 'text-rose-500',
            bg: 'bg-rose-50',
            metric: 'bounceRate',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6 h-32" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <Card
                    key={metric.title}
                    className="hover:shadow-md transition-shadow duration-200"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle
                            className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1"
                            title={metric.title}
                        >
                            {metric.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <SeoMetricTooltip
                                metric={metric.metric}
                                data={data}
                            >
                                <div className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                                </div>
                            </SeoMetricTooltip>
                            <div className={`p-2 rounded-full ${metric.bg}`}>
                                <metric.icon
                                    className={`h-4 w-4 ${metric.color}`}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-baseline justify-between pt-2">
                            <div className="text-2xl font-bold">
                                {metric.value}
                            </div>
                            <div
                                className={`flex items-center text-xs ${metric.trendUp ? 'text-green-600' : 'text-red-600'} bg-opacity-10 px-2 py-1 rounded-full ${metric.trendUp ? 'bg-green-50' : 'bg-red-50'}`}
                            >
                                {metric.trendUp ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                {metric.trendLabel ?? metric.trend}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {metric.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
