import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';
import { useQuery } from '@tanstack/react-query';
import { SeoService } from '../api';
import { DashboardDateFilter } from '@/features/dashboard/components/dashboard-date-filter';
import {
    DEFAULT_WEEK_STARTS_ON,
    formatLocalDate,
    getDateRangeFromPeriod,
} from '@/lib/date-range-utils';
import type { PeriodEnum, WeekStartsOn } from '@/features/dashboard/schemas';
import { useTranslation } from '@/i18n/use-translation';

type MetricKey =
    | 'organicTraffic'
    | 'paidTraffic'
    | 'impressions'
    | 'paidTrafficCost'
    | 'avgPosition'
    | 'referringDomains'
    | 'dr'
    | 'ur'
    | 'organicTrafficValue'
    | 'organicPages'
    | 'crawledPages';

interface MetricConfig {
    labelKey: string;
    color: string;
    gradientId: string;
    formatValue: (value: number) => string;
    isCurrency?: boolean;
    isComingSoon?: boolean;
}

const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
    organicTraffic: {
        labelKey: 'performanceChart.metrics.organicTraffic',
        color: '#f97316',
        gradientId: 'gradientTraffic',
        formatValue: formatCompactNumber,
    },
    paidTraffic: {
        labelKey: 'performanceChart.metrics.paidTraffic',
        color: '#10b981',
        gradientId: 'gradientPaidTraffic',
        formatValue: formatCompactNumber,
    },
    impressions: {
        labelKey: 'performanceChart.metrics.impressions',
        color: '#8b5cf6',
        gradientId: 'gradientImpressions',
        formatValue: formatCompactNumber,
    },
    paidTrafficCost: {
        labelKey: 'performanceChart.metrics.paidTrafficCost',
        color: '#ef4444',
        gradientId: 'gradientCost',
        formatValue: (v) => `à¸¿${formatCompactNumber(v)}`,
        isCurrency: true,
    },
    avgPosition: {
        labelKey: 'performanceChart.metrics.avgPosition',
        color: '#f59e0b',
        gradientId: 'gradientAvgPosition',
        formatValue: (v) => v.toFixed(1),
    },
    referringDomains: {
        labelKey: 'performanceChart.metrics.referringDomains',
        color: '#3b82f6',
        gradientId: 'gradientRefDomains',
        formatValue: formatCompactNumber,
    },
    dr: {
        labelKey: 'performanceChart.metrics.dr',
        color: '#64748b',
        gradientId: 'gDr',
        formatValue: (v) => v.toString(),
    },
    ur: {
        labelKey: 'performanceChart.metrics.ur',
        color: '#64748b',
        gradientId: 'gUr',
        formatValue: (v) => v.toString(),
    },
    organicTrafficValue: {
        labelKey: 'performanceChart.metrics.organicTrafficValue',
        color: '#f97316',
        gradientId: 'gOtv',
        formatValue: (v) => `à¸¿${formatCompactNumber(v)}`,
    },
    organicPages: {
        labelKey: 'performanceChart.metrics.organicPages',
        color: '#10b981',
        gradientId: 'gOp',
        formatValue: formatCompactNumber,
    },
    crawledPages: {
        labelKey: 'performanceChart.metrics.crawledPages',
        color: '#8b5cf6',
        gradientId: 'gCp',
        formatValue: formatCompactNumber,
    },
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    activeMetrics: MetricKey[];
    t: (path: string) => string;
}

function CustomTooltip({
    active,
    payload,
    activeMetrics,
    t,
}: CustomTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0];
    const formattedDate = format(new Date(data.payload.date), 'dd MMM yyyy');

    return (
        <div className="rounded-xl border bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl">
            <p className="text-xs font-semibold text-muted-foreground mb-2 pb-2 border-b">
                {formattedDate}
            </p>
            <div className="flex flex-col gap-1.5">
                {activeMetrics.map((metricKey) => {
                    const config = METRIC_CONFIG[metricKey];
                    if (data.payload[metricKey] === undefined) return null;

                    const item = payload.find(
                        (p: any) => p.dataKey === metricKey
                    );
                    const value = item ? item.value : 0;

                    return (
                        <div
                            key={metricKey}
                            className="flex items-center justify-between gap-6 min-w-[140px]"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full ring-2 ring-transparent"
                                    style={{ backgroundColor: config.color }}
                                />
                                <span className="text-sm text-foreground/80">
                                    {t(config.labelKey)}
                                </span>
                            </div>
                            <span className="text-sm font-bold font-mono">
                                {config.formatValue(value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm">{text}</p>
        </div>
    );
}

export function SeoPerformanceChart() {
    const { t } = useTranslation('seo');
    const [period, setPeriod] = useState<PeriodEnum>('this_month');
    const [customRange, setCustomRange] = useState<
        { from: Date; to: Date } | undefined
    >();
    const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
        DEFAULT_WEEK_STARTS_ON
    );
    const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>([
        'organicTraffic',
        'avgPosition',
    ]);

    const dateRange = useMemo(() => {
        if (period === 'custom' && customRange) {
            return {
                startDate: formatLocalDate(customRange.from),
                endDate: formatLocalDate(customRange.to),
            };
        }

        return getDateRangeFromPeriod(period, weekStartsOn);
    }, [period, customRange, weekStartsOn]);

    const { data, isLoading } = useQuery({
        queryKey: ['seo-history', dateRange.startDate, dateRange.endDate],
        queryFn: () => SeoService.getHistory(dateRange),
    });

    const toggleMetric = (metric: MetricKey) => {
        setActiveMetrics((prev) => {
            if (prev.includes(metric)) {
                if (prev.length === 1) return prev;
                return prev.filter((m) => m !== metric);
            }
            return [...prev, metric];
        });
    };

    const formatXAxis = (dateStr: string) => {
        try {
            return format(new Date(dateStr), 'dd MMM');
        } catch {
            return dateStr;
        }
    };

    const gradientDefs = useMemo(
        () => (
            <defs>
                {Object.entries(METRIC_CONFIG).map(([key, cfg]) => (
                    <linearGradient
                        key={key}
                        id={cfg.gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor={cfg.color}
                            stopOpacity={0.2}
                        />
                        <stop
                            offset="95%"
                            stopColor={cfg.color}
                            stopOpacity={0}
                        />
                    </linearGradient>
                ))}
            </defs>
        ),
        []
    );

    const hasData = data && data.length > 0;

    if (isLoading) {
        return <Card className="h-[400px] animate-pulse bg-white/50" />;
    }

    return (
        <Card className="flex flex-col shadow-sm h-auto sm:h-[400px]">
            <CardHeader className="flex flex-col gap-4 space-y-0 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                    <CardTitle className="text-base font-semibold">
                        {t('performanceChart.title')}
                    </CardTitle>
                </div>
                <DashboardDateFilter
                    value={period}
                    onValueChange={(val) => setPeriod(val)}
                    customRange={customRange}
                    onCustomRangeChange={(range) => setCustomRange(range)}
                    weekStartsOn={weekStartsOn}
                    onWeekStartsOnChange={setWeekStartsOn}
                />
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-2 min-h-[250px] sm:min-h-0">
                {!hasData ? (
                    <EmptyState text={t('performanceChart.empty')} />
                ) : (
                    <div className="h-[250px] sm:h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                {gradientDefs}
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-muted/30"
                                    vertical={false}
                                    stroke="#ccc"
                                />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatXAxis}
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="text-muted-foreground"
                                    dy={10}
                                />
                                <YAxis
                                    tickFormatter={(v) =>
                                        formatCompactNumber(v)
                                    }
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={45}
                                    orientation="right"
                                    className="text-muted-foreground"
                                />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            activeMetrics={activeMetrics}
                                            t={t}
                                        />
                                    }
                                    cursor={{
                                        stroke: 'var(--muted-foreground)',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4',
                                    }}
                                />

                                {activeMetrics.map((metric) => {
                                    const config = METRIC_CONFIG[metric];
                                    return (
                                        <Area
                                            key={metric}
                                            type="monotone"
                                            dataKey={metric}
                                            stroke={config.color}
                                            strokeWidth={2}
                                            fill={`url(#${config.gradientId})`}
                                            animationDuration={500}
                                            activeDot={{ r: 4, strokeWidth: 0 }}
                                        />
                                    );
                                })}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
            <div className="px-6 pb-6 pt-2">
                <div className="flex flex-wrap gap-2 max-w-full">
                    {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
                        const config = METRIC_CONFIG[key];
                        const isActive = activeMetrics.includes(key);

                        return (
                            <button
                                key={key}
                                onClick={() => toggleMetric(key)}
                                className={`
                                    flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border whitespace-nowrap
                                    ${
                                        isActive
                                            ? 'bg-primary/10 border-primary/20 text-foreground shadow-sm'
                                            : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                                `}
                                style={
                                    isActive
                                        ? {
                                              borderColor: config.color,
                                              backgroundColor: `${config.color}15`,
                                              color: config.color,
                                          }
                                        : undefined
                                }
                            >
                                <div
                                    className={`h-2 w-2 rounded-full transition-all ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}
                                    style={{ backgroundColor: config.color }}
                                />
                                {t(config.labelKey)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
