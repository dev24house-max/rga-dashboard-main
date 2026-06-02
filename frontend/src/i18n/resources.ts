import { dashboardEn } from './locales/en/dashboard';
import { campaignsEn } from './locales/en/campaigns';
import { dataSourcesEn } from './locales/en/data-sources';
import { seoEn } from './locales/en/seo';
import { aiInsightsEn } from './locales/en/ai-insights';
import { ecommerceEn } from './locales/en/ecommerce';
import { dashboardTh } from './locales/th/dashboard';
import { campaignsTh } from './locales/th/campaigns';
import { dataSourcesTh } from './locales/th/data-sources';
import { seoTh } from './locales/th/seo';
import { aiInsightsTh } from './locales/th/ai-insights';
import { ecommerceTh } from './locales/th/ecommerce';

export const resources = {
    en: {
        dashboard: dashboardEn,
        campaigns: campaignsEn,
        dataSources: dataSourcesEn,
        seo: seoEn,
        aiInsights: aiInsightsEn,
        ecommerce: ecommerceEn,
    },
    th: {
        dashboard: dashboardTh,
        campaigns: campaignsTh,
        dataSources: dataSourcesTh,
        seo: seoTh,
        aiInsights: aiInsightsTh,
        ecommerce: ecommerceTh,
    },
} as const;

export type AppLanguage = keyof typeof resources;
export type TranslationNamespace = keyof typeof resources.en;
