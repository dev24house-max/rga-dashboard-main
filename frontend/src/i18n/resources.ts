import { dashboardEn } from "./locales/en/dashboard";
import { campaignsEn } from "./locales/en/campaigns";
import { dataSourcesEn } from "./locales/en/data-sources";
import { seoEn } from "./locales/en/seo";
import { aiInsightsEn } from "./locales/en/ai-insights";
import { ecommerceEn } from "./locales/en/ecommerce";
import { dateRangeEn } from "./locales/en/date-range";
import { settingsEn } from "./locales/en/settings";
import { reportsEn } from "./locales/en/reports";
import { usersEn } from "./locales/en/users";
import { sidebarEn } from "./locales/en/sidebar";
import { exportControlsEn } from "./locales/en/export-controls";
import { chatEn } from "./locales/en/chat";
import { notificationsEn } from "./locales/en/notifications";
import { dashboardTh } from "./locales/th/dashboard";
import { campaignsTh } from "./locales/th/campaigns";
import { dataSourcesTh } from "./locales/th/data-sources";
import { seoTh } from "./locales/th/seo";
import { aiInsightsTh } from "./locales/th/ai-insights";
import { ecommerceTh } from "./locales/th/ecommerce";
import { dateRangeTh } from "./locales/th/date-range";
import { settingsTh } from "./locales/th/settings";
import { reportsTh } from "./locales/th/reports";
import { usersTh } from "./locales/th/users";
import { sidebarTh } from "./locales/th/sidebar";
import { exportControlsTh } from "./locales/th/export-controls";
import { chatTh } from "./locales/th/chat";
import { notificationsTh } from "./locales/th/notifications";

export const resources = {
  en: {
    dashboard: dashboardEn,
    campaigns: campaignsEn,
    dataSources: dataSourcesEn,
    seo: seoEn,
    aiInsights: aiInsightsEn,
    ecommerce: ecommerceEn,
    dateRange: dateRangeEn,
    settings: settingsEn,
    reports: reportsEn,
    users: usersEn,
    sidebar: sidebarEn,
    exportControls: exportControlsEn,
    chat: chatEn,
    notifications: notificationsEn,
  },
  th: {
    dashboard: dashboardTh,
    campaigns: campaignsTh,
    dataSources: dataSourcesTh,
    seo: seoTh,
    aiInsights: aiInsightsTh,
    ecommerce: ecommerceTh,
    dateRange: dateRangeTh,
    settings: settingsTh,
    reports: reportsTh,
    users: usersTh,
    sidebar: sidebarTh,
    exportControls: exportControlsTh,
    chat: chatTh,
    notifications: notificationsTh,
  },
} as const;

export type AppLanguage = keyof typeof resources;
export type TranslationNamespace = keyof typeof resources.en;
