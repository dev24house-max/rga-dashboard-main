// src/features/dashboard/components/dashboard-metrics.tsx
// =============================================================================
// Dashboard Metrics Grid - 4 Summary Cards in Responsive Grid
// =============================================================================

import { CreditCard, Eye, MousePointerClick, Target } from 'lucide-react';
import { SummaryCard } from './ui/summary-card';
import { formatCurrencyTHB, formatNumber } from '@/lib/formatters';
import type { SummaryMetrics, GrowthMetrics } from '../schemas';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// Types
// =============================================================================

export interface DashboardMetricsProps {
    /** Summary metrics data */
    summary?: SummaryMetrics;
    /** Growth metrics data */
    growth?: GrowthMetrics;
    /** Label for comparison period */
    comparisonLabel?: string;
    /** Show loading state */
    loading?: boolean;
}

// =============================================================================
// Metric Configuration
// =============================================================================

interface MetricConfig {
    titleKey: string;
    icon: typeof CreditCard;
    getValue: (summary: SummaryMetrics) => string;
    getTrend: (growth: GrowthMetrics) => number | null;
    accentColor: 'indigo' | 'violet' | 'cyan' | 'amber';
    lowerIsBetter?: boolean;
}

// Helper: ensure numeric values are finite, fallback to 0
const safeNumber = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

const metricsConfig: MetricConfig[] = [
    {
        titleKey: 'metrics.totalSpend',
        icon: CreditCard,
        getValue: (s) => formatCurrencyTHB(safeNumber(s.totalCost)),
        getTrend: (g) => g.costGrowth,
        accentColor: 'indigo',
        lowerIsBetter: true,
    },
    {
        titleKey: 'metrics.impressions',
        icon: Eye,
        getValue: (s) => formatNumber(safeNumber(s.totalImpressions)),
        getTrend: (g) => g.impressionsGrowth,
        accentColor: 'violet',
    },
    {
        titleKey: 'metrics.clicks',
        icon: MousePointerClick,
        getValue: (s) => formatNumber(safeNumber(s.totalClicks)),
        getTrend: (g) => g.clicksGrowth,
        accentColor: 'cyan',
    },
    {
        titleKey: 'metrics.conversions',
        icon: Target,
        getValue: (s) => formatNumber(safeNumber(s.totalConversions)),
        getTrend: (g) => g.conversionsGrowth,
        accentColor: 'amber',
    },
];

// =============================================================================
// Main Component
// =============================================================================

export function DashboardMetrics({
    summary,
    growth,
    comparisonLabel,
    loading = false,
}: DashboardMetricsProps) {
    const { t } = useTranslation('dashboard');
    const resolvedComparisonLabel =
        comparisonLabel ?? t('comparison.lastPeriod');

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {metricsConfig.map((metric) => (
                <SummaryCard
                    key={metric.titleKey}
                    title={t(metric.titleKey)}
                    icon={metric.icon}
                    accentColor={metric.accentColor as any}
                    value={
                        summary
                            ? metric.getValue(summary)
                            : metric.getValue({
                                  totalImpressions: 0,
                                  totalClicks: 0,
                                  totalCost: 0,
                                  totalConversions: 0,
                                  averageCtr: 0,
                                  averageRoas: 0,
                                  averageCpm: 0,
                                  averageRoi: 0,
                              })
                    }
                    trend={growth ? metric.getTrend(growth) : null}
                    trendLabel={resolvedComparisonLabel}
                    lowerIsBetter={metric.lowerIsBetter}
                    loading={loading}
                />
            ))}
        </div>
    );
}

export default DashboardMetrics;
