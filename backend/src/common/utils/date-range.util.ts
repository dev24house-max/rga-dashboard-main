import { PeriodEnum, WeekStartsOnEnum } from '../../modules/dashboard/dto/dashboard-overview.dto';

export class DateRangeUtil {
    /**
     * Get date range based on PeriodEnum
     * Supports:
     * - 1d: today
     * - this_week: current week to today
     * - last_week: full previous week
     * - 7d / 14d / 30d / 90d: previous N days ending yesterday
     * - this_month: first day of current month to today
     * - last_month: full previous month
     * - last_3_months: full previous 3 months excluding current month
     */
    static getDateRangeByPeriod(
        period: PeriodEnum,
        weekStartsOn: WeekStartsOnEnum = WeekStartsOnEnum.MONDAY
    ): { startDate: Date; endDate: Date } {
        const now = new Date();

        switch (period) {
            case PeriodEnum.ONE_DAY:
                return this.getDateRange(1);

            case PeriodEnum.YESTERDAY:
                return this.getYesterdayRange();

            case PeriodEnum.THIS_WEEK:
                return this.getWeekRange(0, weekStartsOn);

            case PeriodEnum.LAST_WEEK:
                return this.getWeekRange(-1, weekStartsOn);

            case PeriodEnum.SEVEN_DAYS:
                return this.getTrailingDateRangeEndingYesterday(7);

            case PeriodEnum.FOURTEEN_DAYS:
                return this.getTrailingDateRangeEndingYesterday(14);

            case PeriodEnum.THIRTY_DAYS:
                return this.getTrailingDateRangeEndingYesterday(30);

            case PeriodEnum.NINETY_DAYS:
                return this.getTrailingDateRangeEndingYesterday(90);

            case PeriodEnum.THIS_MONTH: {
                const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
                const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
                return { startDate, endDate };
            }

            case PeriodEnum.LAST_MONTH:
                return this.getLastFullMonthsRange(1);

            case PeriodEnum.LAST_3_MONTHS:
                return this.getLastFullMonthsRange(3);

            default:
                return this.getDateRangeByPeriod(PeriodEnum.THIS_MONTH);
        }
    }

    /**
     * Get previous period date range for growth comparison.
     * Calendar presets compare against their matching calendar period, while
     * trailing/custom ranges compare against the immediately preceding duration.
     * Current partial calendar periods compare against the same partial window.
     */
    static getPreviousPeriodByPeriod(period: PeriodEnum, currentStartDate: Date, currentEndDate: Date): { startDate: Date; endDate: Date } {
        switch (period) {
            case PeriodEnum.ONE_DAY:
            case PeriodEnum.YESTERDAY:
                return this.getPreviousDaysRange(currentStartDate, 1);

            case PeriodEnum.LAST_WEEK:
                return this.getPreviousDaysRange(currentStartDate, 7);

            case PeriodEnum.THIS_WEEK:
                return this.getPreviousWeekToDateRange(currentStartDate, currentEndDate);

            case PeriodEnum.SEVEN_DAYS:
                return this.getPreviousDaysRange(currentStartDate, 7);

            case PeriodEnum.FOURTEEN_DAYS:
                return this.getPreviousDaysRange(currentStartDate, 14);

            case PeriodEnum.THIRTY_DAYS:
                return this.getPreviousDaysRange(currentStartDate, 30);

            case PeriodEnum.NINETY_DAYS:
                return this.getPreviousDaysRange(currentStartDate, 90);

            case PeriodEnum.LAST_MONTH:
                return this.getPreviousCalendarMonthsRange(currentStartDate, 1);

            case PeriodEnum.THIS_MONTH:
                return this.getPreviousCalendarMonthToDateRange(currentStartDate, currentEndDate);

            case PeriodEnum.LAST_3_MONTHS:
                return this.getPreviousCalendarMonthsRange(currentStartDate, 3);

            case PeriodEnum.CUSTOM:
            default: {
                const duration = this.getInclusiveUtcDayCount(currentStartDate, currentEndDate);
                return this.getPreviousDaysRange(currentStartDate, duration);
            }
        }
    }

    /**
     * Parse period string to number of days
     */
    static parsePeriodDays(period: string): number {
        const match = period.match(/^(\d+)d$/);
        if (match) {
            return parseInt(match[1], 10);
        }

        if (period === '1d') return 1;
        if (period === 'yesterday') return 1;
        if (period === 'this_week') {
            const now = new Date();
            const daysSinceMonday = (now.getDay() - 1 + 7) % 7;
            return daysSinceMonday + 1;
        }
        if (period === 'last_week') return 7;
        if (period === '7d') return 7;
        if (period === '14d') return 14;

        if (period === 'this_month') {
            return new Date().getDate();
        }

        if (period === '30d') return 30;
        if (period === '90d') return 90;
        
        return new Date().getDate();
    }

    /**
     * Get start and end dates for a given number of days
     * Uses UTC dates for consistent Prisma/PostgreSQL matching
     */
    static getDateRange(days: number): { startDate: Date; endDate: Date } {
        const now = new Date();
        const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

        const startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

        return { startDate, endDate };
    }

    /**
     * Get previous period date range for comparison
     */
    static getPreviousPeriodDateRange(currentStartDate: Date, days: number): { startDate: Date; endDate: Date } {
        const endDate = new Date(currentStartDate);
        endDate.setUTCDate(endDate.getUTCDate() - 1);
        endDate.setUTCHours(23, 59, 59, 999);

        const startDate = new Date(endDate);
        startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
        startDate.setUTCHours(0, 0, 0, 0);

        return { startDate, endDate };
    }

    static getLastFullMonthsRange(months: number): { startDate: Date; endDate: Date } {
        const now = new Date();

        const startDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth() - months,
            1,
            0,
            0,
            0,
            0
        ));

        const endDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }

    static getPreviousCalendarMonthToDateRange(currentStartDate: Date, currentEndDate: Date): { startDate: Date; endDate: Date } {
        const previousMonthLastDay = new Date(Date.UTC(
            currentStartDate.getUTCFullYear(),
            currentStartDate.getUTCMonth(),
            0
        )).getUTCDate();
        const endDay = Math.min(currentEndDate.getUTCDate(), previousMonthLastDay);

        const startDate = new Date(Date.UTC(
            currentStartDate.getUTCFullYear(),
            currentStartDate.getUTCMonth() - 1,
            1,
            0,
            0,
            0,
            0
        ));

        const endDate = new Date(Date.UTC(
            currentStartDate.getUTCFullYear(),
            currentStartDate.getUTCMonth() - 1,
            endDay,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }

    static getPreviousWeekToDateRange(currentStartDate: Date, currentEndDate: Date): { startDate: Date; endDate: Date } {
        const startDate = new Date(currentStartDate);
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(currentEndDate);
        endDate.setUTCDate(endDate.getUTCDate() - 7);
        endDate.setUTCHours(23, 59, 59, 999);

        return { startDate, endDate };
    }

    static getPreviousCalendarMonthsRange(currentStartDate: Date, months: number): { startDate: Date; endDate: Date } {
        const startDate = new Date(Date.UTC(
            currentStartDate.getUTCFullYear(),
            currentStartDate.getUTCMonth() - months,
            1,
            0,
            0,
            0,
            0
        ));

        const endDate = new Date(Date.UTC(
            currentStartDate.getUTCFullYear(),
            currentStartDate.getUTCMonth(),
            0,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }

    static getPreviousDaysRange(currentStartDate: Date, days: number): { startDate: Date; endDate: Date } {
        const endDate = new Date(currentStartDate);
        endDate.setUTCDate(endDate.getUTCDate() - 1);
        endDate.setUTCHours(23, 59, 59, 999);

        const startDate = new Date(endDate);
        startDate.setUTCDate(startDate.getUTCDate() - days + 1);
        startDate.setUTCHours(0, 0, 0, 0);

        return { startDate, endDate };
    }

    private static getInclusiveUtcDayCount(startDate: Date, endDate: Date): number {
        const msPerDay = 1000 * 60 * 60 * 24;
        const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

        return Math.max(1, Math.floor((endUtc - startUtc) / msPerDay) + 1);
    }

    static getWeekRange(
        offsetWeeks: 0 | -1,
        weekStartsOn: WeekStartsOnEnum = WeekStartsOnEnum.MONDAY
    ): { startDate: Date; endDate: Date } {
        const now = new Date();
        const weekStartDay = weekStartsOn === WeekStartsOnEnum.SUNDAY ? 0 : 1;
        const daysSinceWeekStart = (now.getDay() - weekStartDay + 7) % 7;

        const startDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - daysSinceWeekStart + offsetWeeks * 7,
            0,
            0,
            0,
            0
        ));

        const endDayOffset = offsetWeeks === 0
            ? 0
            : -daysSinceWeekStart - 1;

        const endDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + endDayOffset,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }

    static getTrailingDateRangeEndingYesterday(days: number): { startDate: Date; endDate: Date } {
        const now = new Date();

        const startDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - days,
            0,
            0,
            0,
            0
        ));

        const endDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }

    static getYesterdayRange(): { startDate: Date; endDate: Date } {
        const now = new Date();

        const startDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1,
            0,
            0,
            0,
            0
        ));

        const endDate = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1,
            23,
            59,
            59,
            999
        ));

        return { startDate, endDate };
    }
}
