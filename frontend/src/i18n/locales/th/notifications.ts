import type { notificationsEn } from "../en/notifications";

type TranslationShape<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : TranslationShape<T[K]>;
};

export const notificationsTh = {
  trigger: {
    ariaLabel: "การแจ้งเตือน",
    ariaLabelWithUnread: "การแจ้งเตือน ({count} รายการที่ยังไม่ได้อ่าน)",
  },
  header: {
    title: "การแจ้งเตือน",
    markAllRead: "ทำเครื่องหมายว่าอ่านแล้วทั้งหมด",
  },
  empty: {
    title: "ไม่มีการแจ้งเตือน",
    description: "คุณดูครบหมดแล้ว",
  },
  footer: {
    count: "{count} รายการ",
    countOne: "{count} รายการ",
    close: "ปิด",
  },
  time: {
    justNow: "เมื่อสักครู่",
    minutesAgo: "{count} นาทีที่แล้ว",
    hoursAgo: "{count} ชั่วโมงที่แล้ว",
    daysAgo: "{count} วันที่แล้ว",
  },
  templates: {
    alertMessage:
      'แคมเปญ "{campaignName}": {metric} = {value} (เงื่อนไข: {operator} {threshold})',
    syncCompleteTitle: "ซิงก์ {platform} เสร็จแล้ว",
    syncCompleteMessage:
      "ซิงก์ข้อมูล {recordsCount} รายการจาก {platform} สำเร็จแล้ว",
  },
  metrics: {
    ctr: "CTR",
    cpc: "CPC",
    roas: "ROAS",
    spend: "ค่าใช้จ่าย",
    impressions: "การแสดงผล",
    clicks: "คลิก",
    conversions: "คอนเวอร์ชัน",
    revenue: "รายได้",
  },
  operators: {
    gt: "มากกว่า",
    lt: "น้อยกว่า",
    gte: "มากกว่าหรือเท่ากับ",
    lte: "น้อยกว่าหรือเท่ากับ",
    eq: "เท่ากับ",
  },
} as const satisfies TranslationShape<typeof notificationsEn>;
