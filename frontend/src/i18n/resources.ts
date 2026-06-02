import { dashboardEn } from './locales/en/dashboard';
import { campaignsEn } from './locales/en/campaigns';
import { dataSourcesEn } from './locales/en/data-sources';
import { dashboardTh } from './locales/th/dashboard';
import { campaignsTh } from './locales/th/campaigns';
import { dataSourcesTh } from './locales/th/data-sources';

export const resources = {
    en: {
        dashboard: dashboardEn,
        campaigns: campaignsEn,
        dataSources: dataSourcesEn,
    },
    th: {
        dashboard: dashboardTh,
        campaigns: campaignsTh,
        dataSources: dataSourcesTh,
    },
} as const;

export type AppLanguage = keyof typeof resources;
export type TranslationNamespace = keyof typeof resources.en;
