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
    HelpCircle
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

interface CampaignSummaryProps {
    summary?: CampaignSummaryMetrics;
    isLoading?: boolean;
}

// Metric tooltip content with contextual logic
const getMetricTooltip = (metric: string, summary: CampaignSummaryMetrics) => {
    const safe = (val: number | undefined) => val === undefined || val === null || isNaN(val) ? 0 : val;

    const spend = safe(summary.spend);
    const budget = safe(summary.budget);
    const impressions = safe(summary.impressions);
    const clicks = safe(summary.clicks);
    const revenue = safe(summary.revenue);
    const conversions = safe(summary.conversions);
    const ctr = safe(summary.ctr);
    const cpc = safe(summary.cpc);
    const cpm = safe(summary.cpm);
    const roas = safe(summary.roas);
    const roi = safe(summary.roi);

    switch (metric) {
        case 'budget':
            return {
                explanation: 'The maximum amount allocated for ad spending across all campaigns.',
                formula: 'Sum of all campaign budgets',
                interpretation: 'This is your spending limit. Compare with actual spend to track budget utilization.',
                goodRange: 'Spend should not exceed this amount',
                watchOut: spend > budget ? '⚠️ Overspending detected - consider pausing campaigns' : '✅ Within budget limits',
                contextual: spend > budget ? 'Your campaigns have exceeded the allocated budget. Review and adjust spending limits.' : 'Budget utilization is within safe limits.'
            };

        case 'spend':
            return {
                explanation: 'The actual amount spent on ads across all campaigns and platforms.',
                interpretation: 'Total ad investment. Compare with revenue to calculate ROI.',
                goodRange: 'Typically 80-95% of budget for optimal performance',
                watchOut: spend === 0 ? '⚠️ No spend detected - campaigns may be paused' : '✅ Active spending',
                contextual: spend === 0
                    ? 'No ad spend recorded. Check if campaigns are active and properly connected.'
                    : budget > 0
                        ? `Spent ${((spend / budget) * 100).toFixed(0)}% of allocated budget.`
                        : 'Spend recorded but budget data is unavailable.'
            };

        case 'revenue':
            return {
                explanation: 'Total revenue generated from conversions attributed to your ad campaigns.',
                interpretation: 'Income from ad-driven sales or actions. Key metric for ROI calculation.',
                goodRange: 'Revenue > Spend = positive return',
                watchOut: revenue === 0 ? '⚠️ No revenue recorded - check conversion tracking' : '✅ Revenue generated',
                contextual: revenue === 0
                    ? 'No revenue from conversions yet. Verify conversion tracking is set up correctly.'
                    : spend > 0
                        ? `Generated ${((revenue / spend) * 100).toFixed(0)}% return on ad spend.`
                        : 'Revenue recorded but spend data is unavailable. Check campaign tracking.'
            };

        case 'roi':
            return {
                explanation: 'Return on Investment: the percentage profit or loss from your ad campaigns.',
                formula: '((Revenue - Spend) / Spend) × 100',
                interpretation: '100% = doubled your investment. 0% = breakeven. Negative = losses.',
                goodRange: '>100% indicates profitable campaigns',
                watchOut: roi < 0 ? '⚠️ Negative ROI - campaigns are losing money' : '✅ Positive ROI',
                contextual: roi < 0 ? `Campaigns are losing ${(Math.abs(roi)).toFixed(0)}% of investment. Consider optimizing targeting or creative.` : `Profitable campaigns with ${roi.toFixed(0)}% return.`
            };

        case 'impressions':
            return {
                explanation: 'The total number of times your ads were displayed to users.',
                interpretation: 'Measures ad visibility and reach. Higher impressions = broader audience exposure.',
                goodRange: 'Varies by campaign goals and budget',
                watchOut: impressions === 0 ? '⚠️ No impressions - ads may not be running' : '✅ Ads are being shown',
                contextual: impressions === 0 ? 'Ads are not being displayed. Check campaign status and targeting.' : `${impressions.toLocaleString()} people saw your ads.`
            };

        case 'clicks':
            return {
                explanation: 'The total number of times users clicked on your ads.',
                interpretation: 'Measures user engagement. More clicks = more traffic to your site.',
                goodRange: 'Depends on ad quality and targeting',
                watchOut: clicks === 0 ? '⚠️ No clicks - poor ad performance or targeting' : '✅ Users are clicking',
                contextual: clicks === 0 ? 'No clicks recorded. Review ad creative, targeting, or campaign status.' : `${clicks.toLocaleString()} users engaged with your ads.`
            };

        case 'ctr':
            if (impressions === 0) {
                return {
                    explanation: 'Click-Through Rate: percentage of users who clicked after seeing your ad.',
                    formula: '(Clicks / Impressions) × 100',
                    interpretation: 'Cannot calculate - no impressions recorded.',
                    goodRange: '2-5% is typical',
                    watchOut: '⚠️ No impressions to measure CTR',
                    contextual: 'Ads need impressions before CTR can be calculated. Check campaign delivery.'
                };
            }
            return {
                explanation: 'Click-Through Rate: percentage of users who clicked after seeing your ad.',
                formula: '(Clicks / Impressions) × 100',
                interpretation: 'Measures ad relevance and appeal. Higher CTR = better engagement.',
                goodRange: '2-5% is typical, >3% is excellent',
                watchOut: ctr < 1 ? '⚠️ Low CTR - review ad creative and targeting' : '✅ Good engagement',
                contextual: ctr < 1 ? `CTR of ${ctr.toFixed(2)}% is below average. Consider testing different ad copy or images.` : `Strong CTR of ${ctr.toFixed(2)}% indicates engaging ads.`
            };

        case 'roas':
            if (spend === 0) {
                return {
                    explanation: 'Return on Ad Spend: revenue earned per dollar spent on ads.',
                    formula: 'Revenue / Spend',
                    interpretation: 'Cannot calculate - no spend recorded.',
                    goodRange: '>2.0x is excellent',
                    watchOut: '⚠️ No spend to measure ROAS',
                    contextual: 'ROAS requires ad spend to calculate. Check campaign budget and status.'
                };
            }
            return {
                explanation: 'Return on Ad Spend: revenue earned per dollar spent on ads.',
                formula: 'Revenue / Spend',
                interpretation: '2.0x means $2 revenue per $1 spent. Measures campaign efficiency.',
                goodRange: '>2.0x is excellent, >1.5x is good',
                watchOut: roas < 1 ? '⚠️ ROAS < 1.0 - losing money on ads' : '✅ Profitable campaigns',
                contextual: roas < 1 ? `ROAS of ${roas.toFixed(2)}x means you're losing money. Optimize targeting or reduce spend.` : `Excellent ROAS of ${roas.toFixed(2)}x - great return on investment.`
            };

        case 'cpc':
            if (clicks === 0) {
                return {
                    explanation: 'Cost Per Click: average amount paid per ad click.',
                    formula: 'Spend / Clicks',
                    interpretation: 'Cannot calculate - no clicks recorded.',
                    goodRange: '<$1-5 depending on industry',
                    watchOut: '⚠️ No clicks to measure CPC',
                    contextual: 'CPC requires clicks to calculate. Focus on improving CTR first.'
                };
            }
            return {
                explanation: 'Cost Per Click: average amount paid per ad click.',
                formula: 'Spend / Clicks',
                interpretation: 'Lower CPC = more efficient spending. Compare across platforms.',
                goodRange: '<$1-5 depending on industry and competition',
                watchOut: cpc > 5 ? '⚠️ High CPC - expensive clicks' : '✅ Reasonable click costs',
                contextual: cpc > 5 ? `CPC of ${cpc.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })} is high. Consider refining targeting.` : `Efficient CPC of ${cpc.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}.`
            };

        case 'cpm':
            if (impressions === 0) {
                return {
                    explanation: 'Cost Per Mille: cost to show ads 1,000 times.',
                    formula: '(Spend / Impressions) × 1000',
                    interpretation: 'Cannot calculate - no impressions recorded.',
                    goodRange: '<$5-15 depending on platform',
                    watchOut: '⚠️ No impressions to measure CPM',
                    contextual: 'CPM requires impressions to calculate. Check ad delivery status.'
                };
            }
            return {
                explanation: 'Cost Per Mille: cost to show ads 1,000 times.',
                formula: '(Spend / Impressions) × 1000',
                interpretation: 'Measures cost efficiency for reach. Lower CPM = cheaper impressions.',
                goodRange: '<$5-15 depending on platform and targeting',
                watchOut: cpm > 20 ? '⚠️ High CPM - expensive reach' : '✅ Reasonable reach costs',
                contextual: cpm > 20 ? `CPM of ${cpm.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })} is high. Consider broader targeting.` : `Efficient CPM of ${cpm.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}.`
            };

        default:
            return {
                explanation: 'Metric explanation not available.',
                interpretation: 'Please check documentation for details.',
                contextual: 'Contact support if you need help understanding this metric.'
            };
    }
};

const MetricTooltip = ({ metric, summary, children }: { metric: string; summary: CampaignSummaryMetrics; children: React.ReactNode }) => {
    const tip = getMetricTooltip(metric, summary);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
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
    trendLabel = "vs last period",
    colorClass = "text-muted-foreground",
    bgClass = "bg-muted/20",
    metric,
    summary
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
}) => (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title={title}>
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
                    <div className="text-xl sm:text-2xl font-bold hidden sm:block">{value}</div>
                    <div className="text-xl font-bold sm:hidden">{mobileValue}</div>
                </>
            ) : (
                <div className="text-xl sm:text-2xl font-bold">{value}</div>
            )}
            {trend && (
                <p className="text-xs text-muted-foreground mt-1">
                    <span className={trend.startsWith('+') ? "text-emerald-500" : "text-red-500"}>
                        {trend}
                    </span> {trendLabel}
                </p>
            )}
        </CardContent>
    </Card>
);

export function CampaignSummary({ summary, isLoading = false }: CampaignSummaryProps) {
    const { formatCurrency, formatNumber, formatCurrencyShort } = useFormatter();

    if (isLoading || !summary) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-md" />
            ))}
        </div>;
    }

    // Formatters
    const safeValue = (val?: number) => (val === undefined || val === null || Number.isNaN(val) ? 0 : val);
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
                title="Total Budget"
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
                title="Total Spend"
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
                title="Total Revenue"
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
                title="ROI (Return on Investment)"
                value={`${summary.roi}%`}
                icon={Percent}
                colorClass={summary.roi >= 0 ? "text-emerald-600" : "text-red-600"}
                bgClass={summary.roi >= 0 ? "bg-emerald-100" : "bg-red-100"}
                metric="roi"
                summary={summary}
            />

            {/* 5. Total Impressions */}
            <SummaryCard
                title="Total Impressions"
                value={number(summary.impressions)}
                icon={Eye}
                colorClass="text-purple-600"
                bgClass="bg-purple-100"
                metric="impressions"
                summary={summary}
            />

            {/* 6. Total Clicks */}
            <SummaryCard
                title="Total Clicks"
                value={number(summary.clicks)}
                icon={MousePointer}
                colorClass="text-orange-600"
                bgClass="bg-orange-100"
                metric="clicks"
                summary={summary}
            />

            {/* 7. CTR */}
            <SummaryCard
                title="CTR (Click-Through Rate)"
                value={percent(summary.ctr)}
                icon={Activity}
                colorClass="text-cyan-600"
                bgClass="bg-cyan-100"
                metric="ctr"
                summary={summary}
            />

            {/* 8. ROAS */}
            <SummaryCard
                title="ROAS (Return on Ad Spend)"
                value={`${safe(summary.roas).toFixed(2)}`}
                icon={TrendingUp}
                colorClass="text-green-600"
                bgClass="bg-green-100"
                metric="roas"
                summary={summary}
            />

            {/* 9. CPC */}
            <SummaryCard
                title="CPC (Cost Per Click)"
                value={currency(summary.cpc)}
                icon={BarChart}
                colorClass="text-pink-600"
                bgClass="bg-pink-100"
                metric="cpc"
                summary={summary}
            />

            {/* 10. CPM */}
            <SummaryCard
                title="CPM (Cost Per Mille)"
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
