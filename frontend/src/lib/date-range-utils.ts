import type { PeriodEnum, WeekStartsOn } from '@/features/dashboard/schemas';

export interface DateRangeStrings {
    startDate: string;
    endDate: string;
}

export const DEFAULT_WEEK_STARTS_ON: WeekStartsOn = 'monday';

export function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function startOfLocalWeek(date: Date, weekStartsOn: WeekStartsOn): Date {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const weekStartDay = weekStartsOn === 'sunday' ? 0 : 1;
    const daysSinceWeekStart = (start.getDay() - weekStartDay + 7) % 7;
    start.setDate(start.getDate() - daysSinceWeekStart);

    return start;
}

export function isWeekPeriod(period: PeriodEnum): boolean {
    return period === 'this_week' || period === 'last_week';
}

export function getDateRangeFromPeriod(
    period: PeriodEnum,
    weekStartsOn: WeekStartsOn = DEFAULT_WEEK_STARTS_ON
): DateRangeStrings {
    const today = new Date();
    const endDate = formatLocalDate(today);

    switch (period) {
        case '1d':
            return { startDate: endDate, endDate };

        case 'yesterday': {
            const yesterday = addDays(today, -1);
            const date = formatLocalDate(yesterday);
            return { startDate: date, endDate: date };
        }

        case 'this_week': {
            const start = startOfLocalWeek(today, weekStartsOn);
            return { startDate: formatLocalDate(start), endDate };
        }

        case 'last_week': {
            const thisWeekStart = startOfLocalWeek(today, weekStartsOn);
            const start = addDays(thisWeekStart, -7);
            const end = addDays(thisWeekStart, -1);

            return {
                startDate: formatLocalDate(start),
                endDate: formatLocalDate(end),
            };
        }

        case '7d': {
            const start = addDays(today, -6);
            return { startDate: formatLocalDate(start), endDate };
        }

        case '14d': {
            const start = addDays(today, -13);
            return { startDate: formatLocalDate(start), endDate };
        }

        case '30d': {
            const start = addDays(today, -29);
            return { startDate: formatLocalDate(start), endDate };
        }

        case '90d': {
            const start = addDays(today, -89);
            return { startDate: formatLocalDate(start), endDate };
        }

        case 'this_month': {
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            return { startDate: formatLocalDate(start), endDate };
        }

        case 'last_month': {
            const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);

            return {
                startDate: formatLocalDate(start),
                endDate: formatLocalDate(end),
            };
        }

        case 'last_3_months': {
            const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);

            return {
                startDate: formatLocalDate(start),
                endDate: formatLocalDate(end),
            };
        }

        case 'custom':
        default:
            return { startDate: endDate, endDate };
    }
}
