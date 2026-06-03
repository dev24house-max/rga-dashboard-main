// src/features/dashboard/components/dashboard-date-filter.tsx
// =============================================================================
// Dashboard Date Filter - Period Selection Dropdown
// =============================================================================

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { enUS, th } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { DEFAULT_WEEK_STARTS_ON, isWeekPeriod } from '@/lib/date-range-utils';
import type { PeriodEnum, WeekStartsOn } from '../schemas';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// Types
// =============================================================================

export interface DashboardDateFilterProps {
    /** Currently selected period */
    value: PeriodEnum;
    /** Callback when period changes */
    onValueChange: (value: PeriodEnum) => void;
    /** Custom date range (for 'custom' period) */
    customRange?: { from: Date; to: Date };
    /** Callback when custom range changes */
    onCustomRangeChange?: (range: { from: Date; to: Date }) => void;
    /** Which weekday starts this/last week presets */
    weekStartsOn?: WeekStartsOn;
    /** Callback when week start changes */
    onWeekStartsOnChange?: (value: WeekStartsOn) => void;
    /** Optional className */
    className?: string;
}

// =============================================================================
// Period Options
// =============================================================================

const PERIOD_OPTIONS: { value: PeriodEnum; labelKey: string }[] = [
    { value: '1d', labelKey: 'periods.1d' },
    { value: 'yesterday', labelKey: 'periods.yesterday' },
    { value: 'this_week', labelKey: 'periods.this_week' },
    { value: 'last_week', labelKey: 'periods.last_week' },
    { value: '7d', labelKey: 'periods.7d' },
    { value: '14d', labelKey: 'periods.14d' },
    { value: '30d', labelKey: 'periods.30d' },
    { value: '90d', labelKey: 'periods.90d' },
    { value: 'this_month', labelKey: 'periods.this_month' },
    { value: 'last_month', labelKey: 'periods.last_month' },
    { value: 'last_3_months', labelKey: 'periods.last_3_months' },
    // { value: 'custom', labelKey: 'periods.custom' },
];

const WEEK_START_OPTIONS: { value: WeekStartsOn; labelKey: string }[] = [
    { value: 'sunday', labelKey: 'weekStartsOn.sunday' },
    { value: 'monday', labelKey: 'weekStartsOn.monday' },
];

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(from: Date, to: Date) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(
        (startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay
    );
}

function getPeriodFromPickedDate(
    pickedDate: Date,
    currentPeriod: PeriodEnum
): PeriodEnum {
    const now = new Date();
    const today = startOfDay(now);
    const picked = startOfDay(pickedDate);

    const daysAgo = diffDays(picked, today);

    if (daysAgo === 0) return '1d';
    if (daysAgo >= 1 && daysAgo <= 6) return '7d';
    if (daysAgo >= 7 && daysAgo <= 89) return 'last_3_months';

    const firstDayOfPrevMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
    );
    const isPrevMonth =
        picked.getFullYear() === firstDayOfPrevMonth.getFullYear() &&
        picked.getMonth() === firstDayOfPrevMonth.getMonth();

    if (isPrevMonth) return 'last_month';

    return currentPeriod;
}

// =============================================================================
// Component
// =============================================================================

export function DashboardDateFilter({
    value,
    onValueChange,
    customRange,
    onCustomRangeChange,
    weekStartsOn = DEFAULT_WEEK_STARTS_ON,
    onWeekStartsOnChange,
    className,
}: DashboardDateFilterProps) {
    const { language, t } = useTranslation('dateRange');
    const [open, setOpen] = useState(false);
    const [draftValue, setDraftValue] = useState<PeriodEnum>(value);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: value === 'custom' ? customRange?.from : undefined,
        to: value === 'custom' ? customRange?.to : undefined,
    });
    const dateLocale = language === 'th' ? th : enUS;

    const selectedLabel = useMemo(() => {
        if (value === 'custom' && customRange) {
            return `${format(customRange.from, 'dd MMM', {
                locale: dateLocale,
            })} - ${format(customRange.to, 'dd MMM', { locale: dateLocale })}`;
        }
        const match = PERIOD_OPTIONS.find((opt) => opt.value === value);
        return match ? t(match.labelKey) : value;
    }, [value, customRange, dateLocale, t]);

    const draftRangeLabel = useMemo(() => {
        if (!dateRange.from) return undefined;

        if (
            !dateRange.to ||
            dateRange.from.getTime() === dateRange.to.getTime()
        ) {
            return format(dateRange.from, 'MMM d, yyyy', {
                locale: dateLocale,
            });
        }

        return `${format(dateRange.from, 'MMM d, yyyy', {
            locale: dateLocale,
        })} - ${format(dateRange.to, 'MMM d, yyyy', { locale: dateLocale })}`;
    }, [dateRange.from, dateRange.to, dateLocale]);

    const resetDraftState = () => {
        setDraftValue(value);
        setDateRange({
            from: value === 'custom' ? customRange?.from : undefined,
            to: value === 'custom' ? customRange?.to : undefined,
        });
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            resetDraftState();
        }

        setOpen(nextOpen);
    };

    const handleRangeSelect = (range?: { from?: Date; to?: Date }) => {
        setDraftValue('custom');
        setDateRange(range || {});
    };

    const handleApplyCustomRange = () => {
        if (!dateRange.from) return;

        onValueChange('custom');
        onCustomRangeChange?.({
            from: dateRange.from,
            to: dateRange.to ?? dateRange.from,
        });
        setOpen(false);
    };

    const handleCancelCustomRange = () => {
        resetDraftState();
        setOpen(false);
    };

    const handlePeriodChange = (nextValue: string) => {
        const nextPeriod = nextValue as PeriodEnum;
        setDraftValue(nextPeriod);

        if (nextPeriod === 'custom') {
            return;
        }

        onValueChange(nextPeriod);

        if (!isWeekPeriod(nextPeriod)) {
            setOpen(false);
        }
    };

    const handleWeekStartsOnChange = (nextValue: WeekStartsOn) => {
        onWeekStartsOnChange?.(nextValue);
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`h-8 w-[140px] px-2.5 text-xs justify-between ${className ?? ''}`}
                >
                    <span className="flex items-center min-w-0">
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{selectedLabel}</span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="max-h-[calc(100dvh-1rem)] w-full max-w-[90vw] sm:w-[340px] overflow-auto rounded-xl border border-border/60 p-0 shadow-lg"
                align="start"
            >
                <div className="p-3">
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <div className="text-[11px] font-medium text-muted-foreground">
                                {t('fields.period')}
                            </div>
                            <Select
                                value={draftValue}
                                onValueChange={handlePeriodChange}
                            >
                                <SelectTrigger className="h-8 w-full rounded-lg bg-background shadow-sm text-xs">
                                    <SelectValue
                                        placeholder={t('fields.selectPeriod')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {PERIOD_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {t(option.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isWeekPeriod(draftValue) && (
                            <div className="space-y-2">
                                <div className="text-[11px] font-medium text-muted-foreground">
                                    {t('fields.weekStarts')}
                                </div>
                                <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                                    {WEEK_START_OPTIONS.map((option) => {
                                        const isSelected =
                                            weekStartsOn === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    handleWeekStartsOnChange(
                                                        option.value
                                                    )
                                                }
                                                className={`h-8 rounded-md px-2 text-xs font-medium transition-colors ${
                                                    isSelected
                                                        ? 'bg-background text-foreground shadow-sm'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {t(option.labelKey)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-border" />

                        <div className="space-y-2">
                            <div className="text-[11px] font-medium text-muted-foreground">
                                {t('fields.date')}
                            </div>
                            <div className="rounded-xl bg-background">
                                <Calendar
                                    mode="range"
                                    selected={
                                        dateRange as
                                            | { from: Date; to?: Date }
                                            | undefined
                                    }
                                    onSelect={handleRangeSelect}
                                    captionLayout="dropdown"
                                    locale={dateLocale}
                                    formatters={{
                                        formatMonthDropdown: (date) =>
                                            format(date, 'MMM', {
                                                locale: dateLocale,
                                            }),
                                    }}
                                    fromYear={new Date().getFullYear() - 1}
                                    toYear={new Date().getFullYear()}
                                    className="[--cell-size:1.95rem]"
                                    initialFocus
                                />
                            </div>

                            {(draftValue === 'custom' || dateRange.from) && (
                                <div className="flex items-center gap-2 pt-1">
                                    <div className="min-w-0 flex-1 truncate text-[clamp(0.6875rem,2.4vw,0.75rem)] leading-snug text-muted-foreground">
                                        {draftRangeLabel}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 shrink-0 px-3 text-xs"
                                        onClick={handleCancelCustomRange}
                                    >
                                        {t('actions.cancel')}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="h-8 shrink-0 px-3 text-xs"
                                        disabled={!dateRange.from}
                                        onClick={handleApplyCustomRange}
                                    >
                                        {t('actions.apply')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DashboardDateFilter;
