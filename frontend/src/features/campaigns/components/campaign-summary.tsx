import {
    CreditCard,
    MousePointer,
    Eye,
    BarChart,
    Percent,
    TrendingUp,
    DollarSign,
    Activity,
    Target,
    Wallet,
    Info,
    HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { CampaignSummaryMetrics } from '../api/campaign-service';
import { useFormatter } from '@/hooks/use-formatter';
import { useTranslation } from '@/i18n/use-translation';

interface CampaignSummaryProps {
    summary?: CampaignSummaryMetrics;
    isLoading?: boolean;
}

type CampaignT = (
    path: string,
    params?: Record<string, string | number>
) => string;

// Metric tooltip content with contextual logic
const getMetricTooltip = (
    metric: string,
    summary: CampaignSummaryMetrics,
    t: CampaignT
) => {
    const safe = (val: number | undefined) =>
        val === undefined || val === null || isNaN(val) ? 0 : val;

    const spend = safe(summary.spend);
    const budget = safe(summary.budget);
    const impressions = safe(summary.impressions);
    const clicks = safe(summary.clicks);
    const revenue = safe(summary.revenue);
    const ctr = safe(summary.ctr);
    const cpc = safe(summary.cpc);
    const cpm = safe(summary.cpm);
    const roas = safe(summary.roas);
    const roi = safe(summary.roi);

    switch (metric) {
        case 'budget':
            return {
                explanation: t('summary.tooltips.budget.explanation'),
                formula: t('summary.tooltips.budget.formula'),
                interpretation: t('summary.tooltips.budget.interpretation'),
                goodRange: t('summary.tooltips.budget.goodRange'),
                watchOut:
                    spend > budget
                        ? t('summary.tooltips.budget.watchOutOverspending')
                        : t('summary.tooltips.budget.watchOutWithin'),
                contextual:
                    spend > budget
                        ? t('summary.tooltips.budget.contextualOverspending')
                        : t('summary.tooltips.budget.contextualWithin'),
            };

        case 'spend':
            return {
                explanation: t('summary.tooltips.spend.explanation'),
                interpretation: t('summary.tooltips.spend.interpretation'),
                goodRange: t('summary.tooltips.spend.goodRange'),
                watchOut:
                    spend === 0
                        ? t('summary.tooltips.spend.watchOutNoSpend')
                        : t('summary.tooltips.spend.watchOutActive'),
                contextual:
                    spend === 0
                        ? t('summary.tooltips.spend.contextualNoSpend')
                        : budget > 0
                          ? t('summary.tooltips.spend.contextualPercent', {
                                percent: ((spend / budget) * 100).toFixed(0),
                            })
                          : t('summary.tooltips.spend.contextualUnavailable'),
            };

        case 'revenue':
            return {
                explanation: t('summary.tooltips.revenue.explanation'),
                interpretation: t('summary.tooltips.revenue.interpretation'),
                goodRange: t('summary.tooltips.revenue.goodRange'),
                watchOut:
                    revenue === 0
                        ? t('summary.tooltips.revenue.watchOutNoRevenue')
                        : t('summary.tooltips.revenue.watchOutGenerated'),
                contextual:
                    revenue === 0
                        ? t('summary.tooltips.revenue.contextualNoRevenue')
                        : spend > 0
                          ? t('summary.tooltips.revenue.contextualReturn', {
                                percent: ((revenue / spend) * 100).toFixed(0),
                            })
                          : t('summary.tooltips.revenue.contextualUnavailable'),
            };

        case 'roi':
            return {
                explanation: t('summary.tooltips.roi.explanation'),
                formula: t('summary.tooltips.roi.formula'),
                interpretation: t('summary.tooltips.roi.interpretation'),
                goodRange: t('summary.tooltips.roi.goodRange'),
                watchOut:
                    roi < 0
                        ? t('summary.tooltips.roi.watchOutNegative')
                        : t('summary.tooltips.roi.watchOutPositive'),
                contextual:
                    roi < 0
                        ? t('summary.tooltips.roi.contextualNegative', {
                              percent: Math.abs(roi).toFixed(0),
                          })
                        : t('summary.tooltips.roi.contextualPositive', {
                              percent: roi.toFixed(0),
                          }),
            };

        case 'impressions':
            return {
                explanation: t('summary.tooltips.impressions.explanation'),
                interpretation: t(
                    'summary.tooltips.impressions.interpretation'
                ),
                goodRange: t('summary.tooltips.impressions.goodRange'),
                watchOut:
                    impressions === 0
                        ? t('summary.tooltips.impressions.watchOutNone')
                        : t('summary.tooltips.impressions.watchOutShown'),
                contextual:
                    impressions === 0
                        ? t('summary.tooltips.impressions.contextualNone')
                        : t('summary.tooltips.impressions.contextualShown', {
                              count: impressions.toLocaleString(),
                          }),
            };

        case 'clicks':
            return {
                explanation: t('summary.tooltips.clicks.explanation'),
                interpretation: t('summary.tooltips.clicks.interpretation'),
                goodRange: t('summary.tooltips.clicks.goodRange'),
                watchOut:
                    clicks === 0
                        ? t('summary.tooltips.clicks.watchOutNone')
                        : t('summary.tooltips.clicks.watchOutClicking'),
                contextual:
                    clicks === 0
                        ? t('summary.tooltips.clicks.contextualNone')
                        : t('summary.tooltips.clicks.contextualClicking', {
                              count: clicks.toLocaleString(),
                          }),
            };

        case 'ctr':
            if (impressions === 0) {
                return {
                    explanation: t('summary.tooltips.ctr.explanation'),
                    formula: t('summary.tooltips.ctr.formula'),
                    interpretation: t(
                        'summary.tooltips.ctr.interpretationNoImpressions'
                    ),
                    goodRange: t('summary.tooltips.ctr.goodRangeTypical'),
                    watchOut: t('summary.tooltips.ctr.watchOutNoImpressions'),
                    contextual: t(
                        'summary.tooltips.ctr.contextualNoImpressions'
                    ),
                };
            }
            return {
                explanation: t('summary.tooltips.ctr.explanation'),
                formula: t('summary.tooltips.ctr.formula'),
                interpretation: t('summary.tooltips.ctr.interpretation'),
                goodRange: t('summary.tooltips.ctr.goodRangeExcellent'),
                watchOut:
                    ctr < 1
                        ? t('summary.tooltips.ctr.watchOutLow')
                        : t('summary.tooltips.ctr.watchOutGood'),
                contextual:
                    ctr < 1
                        ? t('summary.tooltips.ctr.contextualLow', {
                              value: ctr.toFixed(2),
                          })
                        : t('summary.tooltips.ctr.contextualGood', {
                              value: ctr.toFixed(2),
                          }),
            };

        case 'roas':
            if (spend === 0) {
                return {
                    explanation: t('summary.tooltips.roas.explanation'),
                    formula: t('summary.tooltips.roas.formula'),
                    interpretation: t(
                        'summary.tooltips.roas.interpretationNoSpend'
                    ),
                    goodRange: t('summary.tooltips.roas.goodRangeExcellent'),
                    watchOut: t('summary.tooltips.roas.watchOutNoSpend'),
                    contextual: t('summary.tooltips.roas.contextualNoSpend'),
                };
            }
            return {
                explanation: t('summary.tooltips.roas.explanation'),
                formula: t('summary.tooltips.roas.formula'),
                interpretation: t('summary.tooltips.roas.interpretation'),
                goodRange: t('summary.tooltips.roas.goodRangeGood'),
                watchOut:
                    roas < 1
                        ? t('summary.tooltips.roas.watchOutLow')
                        : t('summary.tooltips.roas.watchOutProfitable'),
                contextual:
                    roas < 1
                        ? t('summary.tooltips.roas.contextualLow', {
                              value: roas.toFixed(2),
                          })
                        : t('summary.tooltips.roas.contextualExcellent', {
                              value: roas.toFixed(2),
                          }),
            };

        case 'cpc':
            if (clicks === 0) {
                return {
                    explanation: t('summary.tooltips.cpc.explanation'),
                    formula: t('summary.tooltips.cpc.formula'),
                    interpretation: t(
                        'summary.tooltips.cpc.interpretationNoClicks'
                    ),
                    goodRange: t('summary.tooltips.cpc.goodRangeShort'),
                    watchOut: t('summary.tooltips.cpc.watchOutNoClicks'),
                    contextual: t('summary.tooltips.cpc.contextualNoClicks'),
                };
            }
            return {
                explanation: t('summary.tooltips.cpc.explanation'),
                formula: t('summary.tooltips.cpc.formula'),
                interpretation: t('summary.tooltips.cpc.interpretation'),
                goodRange: t('summary.tooltips.cpc.goodRange'),
                watchOut:
                    cpc > 5
                        ? t('summary.tooltips.cpc.watchOutHigh')
                        : t('summary.tooltips.cpc.watchOutReasonable'),
                contextual:
                    cpc > 5
                        ? t('summary.tooltips.cpc.contextualHigh', {
                              amount: cpc.toLocaleString('th-TH', {
                                  style: 'currency',
                                  currency: 'THB',
                              }),
                          })
                        : t('summary.tooltips.cpc.contextualEfficient', {
                              amount: cpc.toLocaleString('th-TH', {
                                  style: 'currency',
                                  currency: 'THB',
                              }),
                          }),
            };

        case 'cpm':
            if (impressions === 0) {
                return {
                    explanation: t('summary.tooltips.cpm.explanation'),
                    formula: t('summary.tooltips.cpm.formula'),
                    interpretation: t(
                        'summary.tooltips.cpm.interpretationNoImpressions'
                    ),
                    goodRange: t('summary.tooltips.cpm.goodRangeShort'),
                    watchOut: t('summary.tooltips.cpm.watchOutNoImpressions'),
                    contextual: t(
                        'summary.tooltips.cpm.contextualNoImpressions'
                    ),
                };
            }
            return {
                explanation: t('summary.tooltips.cpm.explanation'),
                formula: t('summary.tooltips.cpm.formula'),
                interpretation: t('summary.tooltips.cpm.interpretation'),
                goodRange: t('summary.tooltips.cpm.goodRange'),
                watchOut:
                    cpm > 20
                        ? t('summary.tooltips.cpm.watchOutHigh')
                        : t('summary.tooltips.cpm.watchOutReasonable'),
                contextual:
                    cpm > 20
                        ? t('summary.tooltips.cpm.contextualHigh', {
                              amount: cpm.toLocaleString('th-TH', {
                                  style: 'currency',
                                  currency: 'THB',
                              }),
                          })
                        : t('summary.tooltips.cpm.contextualEfficient', {
                              amount: cpm.toLocaleString('th-TH', {
                                  style: 'currency',
                                  currency: 'THB',
                              }),
                          }),
            };

        default:
            return {
                explanation: t('summary.tooltips.default.explanation'),
                interpretation: t('summary.tooltips.default.interpretation'),
                contextual: t('summary.tooltips.default.contextual'),
            };
    }
};

const MetricTooltip = ({
    metric,
    summary,
    children,
}: {
    metric: string;
    summary: CampaignSummaryMetrics;
    children: React.ReactNode;
}) => {
    const { t } = useTranslation('campaigns');
    const tip = getMetricTooltip(metric, summary, t);

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
                                    {metric.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-[12.5px] text-slate-100 leading-relaxed m-0">
                                {tip.explanation}
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const SummaryCard = ({
    title,
    value,
    mobileValue,
    icon: Icon,
    trend,
    trendLabel,
    colorClass = 'text-muted-foreground',
    bgClass = 'bg-muted/20',
    metric,
    summary,
}: {
    title: string;
    value: string;
    mobileValue?: string;
    icon: any;
    trend?: string;
    trendLabel?: string;
    colorClass?: string;
    bgClass?: string;
    metric?: string;
    summary?: CampaignSummaryMetrics;
}) => {
    const { t } = useTranslation('campaigns');

    return (
        <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                    className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1"
                    title={title}
                >
                    {title}
                </CardTitle>
                <div className="flex items-center gap-2">
                    {metric && summary && (
                        <MetricTooltip metric={metric} summary={summary}>
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                        </MetricTooltip>
                    )}
                    <div className={`p-2 rounded-full ${bgClass}`}>
                        <Icon className={`h-4 w-4 ${colorClass}`} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {mobileValue ? (
                    <>
                        <div className="text-xl sm:text-2xl font-bold hidden sm:block">
                            {value}
                        </div>
                        <div className="text-xl font-bold sm:hidden">
                            {mobileValue}
                        </div>
                    </>
                ) : (
                    <div className="text-xl sm:text-2xl font-bold">{value}</div>
                )}
                {trend && (
                    <p className="text-xs text-muted-foreground mt-1">
                        <span
                            className={
                                trend.startsWith('+')
                                    ? 'text-emerald-500'
                                    : 'text-red-500'
                            }
                        >
                            {trend}
                        </span>{' '}
                        {trendLabel ?? t('summary.trendLabel')}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export function CampaignSummary({
    summary,
    isLoading = false,
}: CampaignSummaryProps) {
    const { formatCurrency, formatNumber, formatCurrencyShort } =
        useFormatter();
    const { t } = useTranslation('campaigns');

    if (isLoading || !summary) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded-md" />
                ))}
            </div>
        );
    }

    // Formatters
    const safeValue = (val?: number) =>
        val === undefined || val === null || Number.isNaN(val) ? 0 : val;
    const currency = (val?: number) => formatCurrency(safeValue(val));
    const currencyShort = (val?: number) => formatCurrencyShort(safeValue(val));
    const number = (val?: number) => formatNumber(safeValue(val));
    const percent = (val?: number) => `${safeValue(val).toFixed(2)}%`;

    const safe = (val: number | undefined) => {
        if (val === undefined || val === null || isNaN(val)) return 0;
        return val;
    };

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5">
            {/* 1. Total Budget */}
            <SummaryCard
                title={t('summary.cards.totalBudget')}
                value={currency(summary.budget)}
                mobileValue={currencyShort(summary.budget)}
                icon={Wallet}
                colorClass="text-indigo-600"
                bgClass="bg-indigo-100"
                metric="budget"
                summary={summary}
            />

            {/* 2. Total Spend */}
            <SummaryCard
                title={t('summary.cards.totalSpend')}
                value={currency(summary.spend)}
                mobileValue={currencyShort(summary.spend)}
                icon={CreditCard}
                colorClass="text-blue-600"
                bgClass="bg-blue-100"
                metric="spend"
                summary={summary}
            />

            {/* 3. Total Revenue */}
            <SummaryCard
                title={t('summary.cards.totalRevenue')}
                value={currency(summary.revenue)}
                mobileValue={currencyShort(summary.revenue)}
                icon={DollarSign}
                colorClass="text-emerald-600"
                bgClass="bg-emerald-100"
                metric="revenue"
                summary={summary}
            />

            {/* 4. ROI */}
            <SummaryCard
                title={t('summary.cards.roi')}
                value={`${summary.roi}%`}
                icon={Percent}
                colorClass={
                    summary.roi >= 0 ? 'text-emerald-600' : 'text-red-600'
                }
                bgClass={summary.roi >= 0 ? 'bg-emerald-100' : 'bg-red-100'}
                metric="roi"
                summary={summary}
            />

            {/* 5. Total Impressions */}
            <SummaryCard
                title={t('summary.cards.totalImpressions')}
                value={number(summary.impressions)}
                icon={Eye}
                colorClass="text-purple-600"
                bgClass="bg-purple-100"
                metric="impressions"
                summary={summary}
            />

            {/* 6. Total Clicks */}
            <SummaryCard
                title={t('summary.cards.totalClicks')}
                value={number(summary.clicks)}
                icon={MousePointer}
                colorClass="text-orange-600"
                bgClass="bg-orange-100"
                metric="clicks"
                summary={summary}
            />

            {/* 7. CTR */}
            <SummaryCard
                title={t('summary.cards.ctr')}
                value={percent(summary.ctr)}
                icon={Activity}
                colorClass="text-cyan-600"
                bgClass="bg-cyan-100"
                metric="ctr"
                summary={summary}
            />

            {/* 8. ROAS */}
            <SummaryCard
                title={t('summary.cards.roas')}
                value={`${safe(summary.roas).toFixed(2)}`}
                icon={TrendingUp}
                colorClass="text-green-600"
                bgClass="bg-green-100"
                metric="roas"
                summary={summary}
            />

            {/* 9. CPC */}
            <SummaryCard
                title={t('summary.cards.cpc')}
                value={currency(summary.cpc)}
                icon={BarChart}
                colorClass="text-pink-600"
                bgClass="bg-pink-100"
                metric="cpc"
                summary={summary}
            />

            {/* 10. CPM */}
            <SummaryCard
                title={t('summary.cards.cpm')}
                value={currency(summary.cpm)}
                icon={BarChart}
                colorClass="text-yellow-600"
                bgClass="bg-yellow-100"
                metric="cpm"
                summary={summary}
            />
        </div>
    );
}
