// src/features/campaigns/components/campaign-visualization.tsx
// =============================================================================
// Campaign Visualization - Charts and Key Metrics Snapshot
// =============================================================================

import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Download, Wallet, TrendingUp, Trophy, Activity } from 'lucide-react';
import type { Campaign } from '../types';
import type { CampaignSummaryMetrics } from '../api/campaign-service';
import { useFormatter } from '@/hooks/use-formatter';
import { useTranslation } from '@/i18n/use-translation';

interface CampaignVisualizationProps {
    campaigns: Campaign[];
    summary?: CampaignSummaryMetrics;
    onDownload?: () => void;
}

export function CampaignVisualization({
    campaigns,
    summary,
    onDownload,
}: CampaignVisualizationProps) {
    const { formatCurrency, formatCurrencyShort } = useFormatter();
    const { t } = useTranslation('campaigns');

    if (!summary || campaigns.length === 0) return null;

    const chartLabels = {
        budget: t('visualization.labels.budget'),
        spend: t('visualization.labels.spend'),
        revenue: t('visualization.labels.revenue'),
    };

    // 1. Prepare Chart Data (Top 5 Campaigns by Spend)
    const chartData = [...campaigns]
        .sort((a, b) => (b.spent ?? 0) - (a.spent ?? 0))
        .slice(0, 5) // Top 5
        .map((c) => ({
            name: c.name,
            [chartLabels.budget]: c.budget,
            [chartLabels.spend]: c.spent ?? 0,
            [chartLabels.revenue]: c.revenue ?? 0,
        }));

    // Format for chart axis and tooltip
    const formatMoney = (val?: number) => {
        if (val == null || Number.isNaN(val)) return '-';
        return formatCurrency(val);
    };

    // 2. Calculate Snapshot Metrics
    const activeCount = campaigns.filter((c) => c.status === 'active').length;

    // Find BestROI Campaign
    const bestRoiCampaign = [...campaigns].sort(
        (a, b) => (b.roi ?? 0) - (a.roi ?? 0)
    )[0];
    const bestRoiValue = bestRoiCampaign?.roi ?? 0;
    const bestRoiName = bestRoiCampaign?.name ?? '-';

    return (
        <div className="space-y-4 pt-6 mt-6 border-t border-border/60">
            {/* Header */}
            <div>
                <p className="font-semibold text-foreground text-xl">
                    {t('visualization.title')}
                </p>
                <p className="text-muted-foreground text-sm">
                    {t('visualization.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* 1. Budget vs Spend vs Revenue Chart */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-inner space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                {t('visualization.chartTitle')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t('visualization.chartSubtitle')}
                            </p>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase font-medium">
                            {t('visualization.liveData')}
                        </span>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                                barSize={16}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="var(--border)"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 11,
                                        fill: 'var(--muted-foreground)',
                                    }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickFormatter={(val) =>
                                        val.length > 15
                                            ? `${val.substring(0, 15)}...`
                                            : val
                                    }
                                />
                                <YAxis
                                    tickFormatter={formatMoney}
                                    tick={{
                                        fontSize: 11,
                                        fill: 'var(--muted-foreground)',
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    formatter={(value: number) =>
                                        formatMoney(value)
                                    }
                                    contentStyle={{
                                        backgroundColor: 'var(--popover)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        color: 'var(--popover-foreground)',
                                        boxShadow:
                                            '0 12px 28px rgba(0, 0, 0, 0.28)',
                                    }}
                                    itemStyle={{
                                        color: 'var(--popover-foreground)',
                                    }}
                                    labelStyle={{
                                        color: 'var(--muted-foreground)',
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                                <Bar
                                    dataKey={chartLabels.budget}
                                    fill="#F97316"
                                    radius={[4, 4, 0, 0]}
                                    name={chartLabels.budget}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                                <Bar
                                    dataKey={chartLabels.spend}
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                    name={chartLabels.spend}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                                <Bar
                                    dataKey={chartLabels.revenue}
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                    name={chartLabels.revenue}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Campaign Snapshot */}
                <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                            {t('visualization.highlightsTitle')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('visualization.highlightsSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Spend */}
                        <div className="group relative bg-card rounded-2xl p-4 border border-border hover:border-violet-300/60 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-4 right-4 p-2 bg-violet-50 rounded-full group-hover:bg-violet-100 transition-colors dark:bg-violet-500/15 dark:group-hover:bg-violet-500/25">
                                <Wallet className="w-4 h-4 text-violet-500" />
                            </div>
                            <p className="text-xs uppercase text-muted-foreground font-medium">
                                {t('visualization.totalSpend')}
                            </p>
                            <p className="mt-2 text-lg font-bold text-foreground group-hover:text-violet-500 transition-colors">
                                {formatMoney(summary.spend)}
                            </p>
                            <p
                                className="text-[10px] text-muted-foreground mt-1 cursor-help"
                                title={t('visualization.exactAmount')}
                            >
                                {formatCurrency(summary.spend, {
                                    maximumFractionDigits: 0,
                                })}
                            </p>
                        </div>

                        {/* Top ROI */}
                        <div className="group relative bg-card rounded-2xl p-4 border border-border hover:border-emerald-300/60 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-4 right-4 p-2 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors dark:bg-emerald-500/15 dark:group-hover:bg-emerald-500/25">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-xs uppercase text-muted-foreground font-medium">
                                {t('visualization.topRoi')}
                            </p>
                            <p className="mt-2 text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                                {bestRoiValue.toFixed(0)}%
                            </p>
                            <p
                                className="text-[10px] text-muted-foreground mt-1 truncate w-[85%]"
                                title={bestRoiName}
                            >
                                {bestRoiName}
                            </p>
                        </div>

                        {/* Best Campaign */}
                        <div className="group relative bg-card rounded-2xl p-4 border border-border hover:border-amber-300/60 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-4 right-4 p-2 bg-amber-50 rounded-full group-hover:bg-amber-100 transition-colors dark:bg-amber-500/15 dark:group-hover:bg-amber-500/25">
                                <Trophy className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-xs uppercase text-muted-foreground font-medium">
                                {t('visualization.bestCampaign')}
                            </p>
                            <p
                                className="mt-2 text-sm font-semibold text-foreground truncate w-[85%] group-hover:text-amber-500 transition-colors"
                                title={bestRoiName}
                            >
                                {bestRoiName}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">
                                {t('visualization.roiLabel', {
                                    value: bestRoiValue.toFixed(0),
                                })}
                            </p>
                        </div>

                        {/* Active Campaigns */}
                        <div className="group relative bg-card rounded-2xl p-4 border border-border hover:border-blue-300/60 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-4 right-4 p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors dark:bg-blue-500/15 dark:group-hover:bg-blue-500/25">
                                <Activity className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs uppercase text-muted-foreground font-medium">
                                {t('visualization.activeCampaigns')}
                            </p>
                            <p className="mt-2 text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                                {activeCount}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {t('visualization.runningNow')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
