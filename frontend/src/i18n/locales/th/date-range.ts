import type { dateRangeEn } from '../en/date-range';

type TranslationShape<T> = {
    readonly [K in keyof T]: T[K] extends string
        ? string
        : TranslationShape<T[K]>;
};

export const dateRangeTh = {
    fields: {
        period: 'ช่วงเวลา',
        selectPeriod: 'เลือกช่วงเวลา',
        weekStarts: 'เริ่มสัปดาห์',
        date: 'วันที่',
    },
    periods: {
        '1d': 'วันนี้',
        yesterday: 'เมื่อวาน',
        this_week: 'สัปดาห์นี้',
        last_week: 'สัปดาห์ที่แล้ว',
        '7d': '7 วันที่ผ่านมา',
        '14d': '14 วันที่ผ่านมา',
        '30d': '30 วันที่ผ่านมา',
        '90d': '90 วันที่ผ่านมา',
        '365d': '365 วันที่ผ่านมา',
        this_month: 'เดือนนี้',
        last_month: 'เดือนที่แล้ว',
        last_3_months: '3 เดือนที่ผ่านมา',
        custom: 'กำหนดช่วงเอง',
    },
    weekStartsOn: {
        sunday: 'วันอาทิตย์',
        monday: 'วันจันทร์',
    },
    actions: {
        cancel: 'ยกเลิก',
        apply: 'ใช้',
    },
} as const satisfies TranslationShape<typeof dateRangeEn>;
