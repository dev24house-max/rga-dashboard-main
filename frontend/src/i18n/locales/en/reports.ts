export const reportsEn = {
    page: {
        title: 'Reports & Export',
        subtitle: 'Download campaign data and performance metrics',
    },
    filters: {
        title: 'Export Filters',
        description: 'Configure filters before exporting',
        period: 'Time Period',
        platform: 'Platform',
        status: 'Campaign Status',
        placeholders: {
            period: 'Select period',
            platform: 'Select platform',
            status: 'Select status',
        },
    },
    periods: {
        '1d': 'Today',
        '7d': 'Last 7 Days',
        '14d': 'Last 14 Days',
        '30d': 'Last 30 Days',
        '90d': 'Last 90 Days',
        '365d': 'Last 1 Year',
    },
    platforms: {
        all: 'All Platforms',
        allPlatformsLower: 'all platforms',
        googleAds: 'Google Ads',
        facebookAds: 'Facebook Ads',
        tiktokAds: 'TikTok Ads',
        lineAds: 'LINE Ads',
    },
    statuses: {
        all: 'All Statuses',
        active: 'Active',
        paused: 'Paused',
        ended: 'Ended',
        draft: 'Draft',
    },
    exportCards: {
        csv: {
            title: 'Campaign Data (CSV)',
            description: 'Export all campaigns with metrics',
            includes: 'Includes:',
            items: {
                campaignDetails: 'Campaign name, platform, status',
                performance: 'Impressions, clicks, spend',
                conversion: 'Conversions, revenue, ROAS',
                costMetrics: 'CTR, CPC metrics',
            },
            exporting: 'Exporting...',
            download: 'Download CSV',
        },
        pdf: {
            title: 'Performance Report (PDF)',
            description: 'Summary report with trends',
            includes: 'Includes:',
            items: {
                summaryTable: 'Performance summary table',
                comparison: 'Period comparison (vs previous)',
                dailyBreakdown: 'Daily metrics breakdown',
                trends: 'Trend percentages',
            },
            generating: 'Generating...',
            download: 'Download PDF',
            periodNote: 'PDF uses {period} period',
        },
    },
    info: {
        title: 'About Reports',
        description:
            'CSV exports contain raw campaign data filtered by your selected platform and status. PDF reports provide a formatted summary with period-over-period comparisons.',
    },
    toasts: {
        csvSuccess: 'CSV exported successfully',
        csvSuccessDescription:
            'Downloaded {period} campaigns report with {platform} filter.',
        csvFailed: 'Failed to export CSV',
        pdfSuccess: 'PDF report exported successfully',
        pdfSuccessDescriptionAll: 'Downloaded {period} metrics report.',
        pdfSuccessDescriptionPlatform:
            'Downloaded {period} metrics report for {platform}.',
        pdfFailed: 'Failed to export PDF',
        retryDescription: 'Please check your connection and try again.',
    },
} as const;
