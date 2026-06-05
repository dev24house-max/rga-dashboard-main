import { useState, useEffect, useMemo, useRef } from 'react';
import { Download } from 'lucide-react';
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useFormatter } from '@/hooks/use-formatter';
import { downloadCsv } from '@/lib/download-utils';
import { ExportDropdown } from '@/components/ui/export-dropdown';
import { useTranslation } from '@/i18n/use-translation';
import { useTheme } from '@/contexts/ThemeContext';

export interface FinancialBreakdownItem {
    name: string;
    value: number;
    color: string;
}

export interface FinancialSummaryItem {
    label: string;
    value: number;
    deltaLabel?: string;
    deltaClassName?: string;
}

export interface FinancialOverviewProps {
    className?: string;
    title?: string;
    subtitle?: string;
    roi?: number;
    roiDelta?: number;
    roiComparisonLabel?: string;
    total?: number;
    breakdown?: FinancialBreakdownItem[];
    summary?: FinancialSummaryItem[];
}

const DEFAULT_BREAKDOWN = [
    { nameKey: 'financialOverview.paid', value: 1_176_000, color: '#60a5fa' },
    { nameKey: 'financialOverview.organic', value: 784_000, color: '#22c55e' },
    { nameKey: 'financialOverview.referral', value: 490_000, color: '#f97316' },
];

const DEFAULT_SUMMARY = [
    {
        labelKey: 'financialOverview.revenue',
        value: 2_450_000,
        deltaLabel: '+15.3%',
        deltaClassName: 'text-emerald-500/70',
    },
    {
        labelKey: 'financialOverview.profit',
        value: 2_180_000,
        deltaLabel: '+12.1%',
        deltaClassName: 'text-blue-500/70',
    },
    {
        labelKey: 'financialOverview.cost',
        value: 720_000,
        deltaLabel: '+6.8%',
        deltaClassName: 'text-rose-400/70',
    },
];

// Currency formatters now imported from @/lib/formatters

const DARK_MODE_DONUT_COLOR = '#64748b';
const DARK_MODE_DONUT_LUMINANCE_THRESHOLD = 0.08;

function getHexLuminance(color: string) {
    const match = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    const hex = match?.[1];
    if (!hex) return null;

    const normalized =
        hex.length === 3
            ? hex
                  .split('')
                  .map((char) => `${char}${char}`)
                  .join('')
            : hex;

    const channels = [0, 2, 4].map((start) => {
        const value = parseInt(normalized.slice(start, start + 2), 16) / 255;
        return value <= 0.03928
            ? value / 12.92
            : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function resolveDonutDisplayColor(color: string, isDarkMode: boolean) {
    if (!isDarkMode) return color;

    const luminance = getHexLuminance(color);
    return luminance !== null &&
        luminance < DARK_MODE_DONUT_LUMINANCE_THRESHOLD
        ? DARK_MODE_DONUT_COLOR
        : color;
}

function buildFinancialCsv(
    breakdown: FinancialBreakdownItem[],
    summary: FinancialSummaryItem[],
    roi: number,
    roiDelta: number,
    total: number
) {
    const lines: string[] = [];

    lines.push('roi,roi_delta,total');
    lines.push([roi.toFixed(2), roiDelta.toFixed(2), String(total)].join(','));
    lines.push('');

    lines.push('breakdown_name,breakdown_value');
    for (const item of breakdown) {
        lines.push([item.name, String(item.value)].join(','));
    }
    lines.push('');

    lines.push('summary_label,summary_value,summary_delta');
    for (const item of summary) {
        lines.push(
            [item.label, String(item.value), item.deltaLabel ?? ''].join(',')
        );
    }

    return lines.join('\n');
}

// downloadCsv now imported from @/lib/download-utils

export function FinancialOverview({
    className,
    title,
    subtitle,
    roi = 3.4,
    roiDelta = 0.2,
    roiComparisonLabel,
    total,
    breakdown,
    summary,
}: FinancialOverviewProps) {
    const { t } = useTranslation('dashboard');
    const { theme } = useTheme();
    const { formatCurrency } = useFormatter();
    const cardRef = useRef<HTMLDivElement>(null);
    const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(
        null
    );
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const resolvedTitle = title ?? t('financialOverview.title');
    const resolvedSubtitle = subtitle ?? t('financialOverview.subtitle');
    const resolvedRoiComparisonLabel =
        roiComparisonLabel ?? t('comparison.lastPeriod');
    const noDataLabel = t('financialOverview.noData');
    const defaultBreakdown = useMemo(
        () =>
            DEFAULT_BREAKDOWN.map((item) => ({
                ...item,
                name: t(item.nameKey),
            })),
        [t]
    );
    const defaultSummary = useMemo(
        () =>
            DEFAULT_SUMMARY.map((item) => ({
                ...item,
                label: t(item.labelKey),
            })),
        [t]
    );
    const resolvedBreakdown = breakdown ?? defaultBreakdown;
    const resolvedSummary = summary ?? defaultSummary;
    const computedTotal =
        total ?? resolvedBreakdown.reduce((acc, cur) => acc + cur.value, 0);
    const formattedRoiDelta = `${roiDelta >= 0 ? '+' : ''}${roiDelta.toFixed(1)}%`;
    const formatWholeCurrency = (value: number) =>
        formatCurrency(value, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        });

    useEffect(() => {
        if (cardRef.current) {
            setTargetElement(cardRef.current);
        }
    }, []);
    const hasData = resolvedBreakdown.some((item) => item.value > 0);

    const chartData = useMemo(() => {
        const source = hasData
            ? resolvedBreakdown
            : [
                  {
                      name: noDataLabel,
                      value: 1,
                      color: 'var(--chart-empty, #cbd5e1)',
                  },
              ];

        return source.map((item) => ({
            ...item,
            displayColor: resolveDonutDisplayColor(
                item.color,
                theme === 'dark'
            ),
        }));
    }, [hasData, noDataLabel, resolvedBreakdown, theme]);

    const handleExportCsv = () => {
        downloadCsv(
            'financial-overview.csv',
            buildFinancialCsv(
                resolvedBreakdown,
                resolvedSummary,
                roi,
                roiDelta,
                computedTotal
            )
        );
    };

    return (
        <Card
            ref={cardRef}
            className={cn(
                'relative h-auto min-h-[360px] md:min-h-[400px] overflow-hidden rounded-3xl border border-border shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
                className
            )}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-transparent blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-transparent blur-3xl"
            />
            <CardHeader className="space-y-1 pb-3 px-4 pt-4 md:px-6 md:pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
                            {resolvedTitle}
                        </CardTitle>
                        <CardDescription className="text-xs font-medium pl-3.5">
                            {resolvedSubtitle}{' '}
                            <span className="text-indigo-500">
                                {roi.toFixed(1)}x
                            </span>{' '}
                            <span className="text-xs text-muted-foreground">
                                ({formattedRoiDelta}{' '}
                                {resolvedRoiComparisonLabel})
                            </span>
                        </CardDescription>
                    </div>

                    <ExportDropdown
                        filename="financial-overview"
                        targetElement={targetElement}
                        onExportCsv={handleExportCsv}
                        pdfSummaryData={{
                            title: resolvedTitle,
                            subtitle: `${resolvedSubtitle} ROAS ${roi.toFixed(1)}x (${formattedRoiDelta} ${resolvedRoiComparisonLabel})`,
                            roi,
                            roiDelta,
                            total: computedTotal,
                            totalLabel: formatWholeCurrency(computedTotal),
                            breakdown: resolvedBreakdown.map((item) => ({
                                name: item.name,
                                value: item.value,
                                formattedValue: formatWholeCurrency(
                                    item.value
                                ),
                            })),
                            summary: resolvedSummary.map((item) => ({
                                label: item.label,
                                value: item.value,
                                formattedValue: formatWholeCurrency(
                                    item.value
                                ),
                                deltaLabel: item.deltaLabel,
                            })),
                        }}
                    />
                </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 flex flex-col px-4 pb-4 md:px-6 md:pb-6">
                <div className="flex items-center justify-center w-full flex-1">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-5 w-full">
                        <div className="relative w-full max-w-[320px]">
                            <div
                                style={{
                                    width: '100%',
                                    height: 280,
                                    minWidth: 0,
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={103}
                                            paddingAngle={2}
                                            stroke="var(--background)"
                                            strokeWidth={3}
                                            activeIndex={
                                                activeIndex ?? undefined
                                            }
                                            activeShape={(props: any) => (
                                                <Sector
                                                    {...props}
                                                    outerRadius={
                                                        (props.outerRadius ??
                                                            0) + 6
                                                    }
                                                />
                                            )}
                                            onMouseLeave={() =>
                                                setActiveIndex(null)
                                            }
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={entry.displayColor}
                                                    data-export-light-fill={
                                                        entry.color
                                                    }
                                                    onMouseEnter={() =>
                                                        setActiveIndex(index)
                                                    }
                                                    className="transition-opacity duration-200"
                                                    opacity={
                                                        activeIndex === null ||
                                                        activeIndex === index
                                                            ? 1
                                                            : 0.35
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            position={{ x: 8, y: 8 }}
                                            formatter={(
                                                value: number | string,
                                                name: string | number
                                            ) => {
                                                const label =
                                                    typeof name === 'string'
                                                        ? name
                                                        : String(name ?? '');
                                                if (label === noDataLabel)
                                                    return ['0', label];
                                                return [
                                                    formatCurrency(
                                                        Number(value),
                                                        {
                                                            maximumFractionDigits: 0,
                                                            minimumFractionDigits: 0,
                                                        }
                                                    ),
                                                    label,
                                                ];
                                            }}
                                            contentStyle={{
                                                backgroundColor:
                                                    'var(--popover)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '0.75rem',
                                                color: 'var(--popover-foreground)',
                                                boxShadow:
                                                    '0 12px 28px rgba(0, 0, 0, 0.28)',
                                            }}
                                            itemStyle={{
                                                color: 'var(--popover-foreground)',
                                                fontWeight: 600,
                                            }}
                                            labelStyle={{
                                                color: 'var(--muted-foreground)',
                                            }}
                                            separator=" : "
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                                <p className="text-[10px] uppercase text-gray-400 tracking-wide">
                                    {t('financialOverview.total')}
                                </p>
                                <div className="max-w-[200px]">
                                    <p className="text-lg md:text-xl font-semibold text-gray-900 leading-none whitespace-nowrap">
                                        {formatCurrency(computedTotal, {
                                            notation: 'compact',
                                            maximumFractionDigits: 1,
                                            minimumFractionDigits: 0,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:flex-1 space-y-2 text-xs">
                            {chartData.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={cn(
                                        'rounded-2xl px-3 py-2.5 flex items-center justify-between border',
                                        activeIndex === index && 'shadow-sm'
                                    )}
                                    style={{
                                        backgroundColor:
                                            'var(--theme-surface, var(--background))',
                                        borderColor:
                                            'var(--theme-border, var(--border))',
                                        boxShadow:
                                            'var(--theme-card-shadow, none)',
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span
                                            className="h-4 w-4 rounded-full flex-shrink-0"
                                            data-export-light-bg={item.color}
                                            style={{
                                                backgroundColor:
                                                    item.displayColor,
                                            }}
                                        />
                                        <span
                                            className="font-semibold theme-text truncate text-xs"
                                            style={{
                                                color: 'var(--theme-text, var(--foreground))',
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                    <span
                                        className="font-semibold theme-text whitespace-nowrap text-xs"
                                        style={{
                                            color: 'var(--theme-text, var(--foreground))',
                                        }}
                                    >
                                        <span className="md:hidden">
                                            {item.name === noDataLabel
                                                ? '0'
                                                : formatCurrency(item.value, {
                                                      notation: 'compact',
                                                      maximumFractionDigits: 1,
                                                      minimumFractionDigits: 0,
                                                  })}
                                        </span>
                                        <span className="hidden md:inline">
                                            {item.name === noDataLabel
                                                ? '0'
                                                : formatCurrency(item.value, {
                                                      maximumFractionDigits: 0,
                                                      minimumFractionDigits: 0,
                                                  })}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4 text-center sm:grid-cols-3">
                    {resolvedSummary.map((item) => (
                        <div key={item.label} className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="text-base font-bold text-foreground tracking-tight">
                                <span className="md:hidden">
                                    {formatCurrency(item.value, {
                                        notation: 'compact',
                                        maximumFractionDigits: 1,
                                        minimumFractionDigits: 0,
                                    })}
                                </span>
                                <span className="hidden md:inline">
                                    {formatCurrency(item.value, {
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0,
                                    })}
                                </span>
                            </p>
                            {item.deltaLabel ? (
                                <p
                                    className={cn(
                                        'text-xs font-medium',
                                        item.deltaClassName
                                    )}
                                >
                                    {item.deltaLabel}
                                </p>
                            ) : (
                                <p className="text-xs font-medium text-muted-foreground">
                                    —
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default FinancialOverview;
