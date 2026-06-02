export const campaignsEn = {
    page: {
        title: 'Campaigns',
        subtitle: 'Manage your advertising campaigns across all platforms.',
        timeWindow: {
            metricsFrom: 'Metrics from',
            to: 'to',
            updating: 'Updating data...',
        },
        errors: {
            loadCampaigns: 'Failed to load campaigns:',
            unknownError: 'Unknown error',
            retry: 'Retry',
        },
        toasts: {
            selectionLimitTitle: 'Selection limit reached',
            selectionLimitDescription:
                'You can only select up to {limit} campaigns.',
            selectionAlreadyDescription:
                'You have already selected {limit} campaigns.',
            selectionCappedTitle: 'Selection capped',
            selectionCappedDescription:
                'Only some items were selected to stay within the 10-item limit.',
            bulkPauseTitle: 'Bulk Pause',
            bulkEnableTitle: 'Bulk Enable',
            bulkDeleteTitle: 'Bulk Delete',
            featureComingSoon: 'This feature is coming soon.',
            exportSuccessTitle: 'Export successful',
            exportSuccessDescription: 'Downloaded {filename}',
            exportFailedTitle: 'Export failed',
            exportFailedDescription: 'Unable to download CSV report',
        },
        deleteDialog: {
            title: 'Delete Campaign',
            description:
                'Are you sure you want to delete "{name}"? This action cannot be undone.',
            cancel: 'Cancel',
            delete: 'Delete',
            deleting: 'Deleting...',
        },
    },
    table: {
        empty: {
            title: 'No campaigns found',
            description: 'Try adjusting your filters or create a new campaign.',
        },
        pagination: {
            showing: 'Showing',
            to: 'to',
            of: 'of',
            entries: 'entries',
            prev: '< Prev',
            prevShort: '<',
            next: 'Next >',
            nextShort: '>',
        },
        columnsToggle: 'Columns',
        dragToReorder: 'Drag to reorder',
        selectAll: 'Select all',
        columns: {
            campaign: 'Campaign',
            status: 'Status',
            platform: 'Platform',
            objective: 'Type',
            budget: 'Budget',
            spend: 'Spent',
            revenue: 'Revenue',
            impressions: 'Impressions',
            clicks: 'Clicks',
            ctr: 'CTR',
            cpc: 'CPC',
            cpm: 'CPM',
            roas: 'ROAS',
            roi: 'ROI',
            date: 'Date',
        },
        status: {
            active: 'Active',
            paused: 'Paused',
            completed: 'Completed',
            pending: 'Pending',
            ended: 'Ended',
            deleted: 'Deleted',
        },
    },
    toolbar: {
        status: 'Status',
        platform: 'Platform',
        filterByStatus: 'Filter by Status',
        allStatuses: 'All Statuses',
        filterByPlatform: 'Filter by Platform',
        allPlatforms: 'All Platforms',
        filters: 'Filters',
        all: 'All',
        clearAll: 'Clear All',
        searchPlaceholder: 'Search campaigns...',
        search: 'Search',
        selected: 'Selected',
        statusOptions: {
            active: 'Active',
            paused: 'Paused',
            completed: 'Completed',
        },
    },
    sheet: {
        titleEdit: 'Edit Campaign',
        titleCreate: 'Create Campaign',
        descriptionEdit:
            'Update the campaign details below to optimize performance.',
        descriptionCreate:
            'Launch a new high-performing ad campaign in seconds.',
        close: 'Close',
        fields: {
            campaignName: 'Campaign Name',
            campaignNamePlaceholder: 'e.g., Summer Sale 2026',
            platform: 'Platform',
            selectPlatform: 'Select platform',
            status: 'Status',
            completed: 'Completed',
            active: 'Active',
            paused: 'Paused',
            budgetLimit: 'Budget Limit ({currencyCode})',
            budgetPlaceholder: '50,000',
            budgetDescription: 'Monthly spending limit for this campaign.',
            startDate: 'Start Date',
            endDate: 'End Date',
            optional: '(Optional)',
            pickDate: 'Pick date',
        },
        actions: {
            cancel: 'Cancel',
            reset: 'Reset',
            saving: 'Saving...',
            creating: 'Creating...',
            saveChanges: 'Save Changes',
            createCampaign: 'Create Campaign',
        },
        resetDebug: {
            refName: 'ref.name',
            beforeReset: 'before reset',
            afterReset: 'after reset',
            hasInit: 'hasInit',
        },
    },
    bulkActionBar: {
        clearSelection: 'Clear selection',
        selectedSingular: '{count} campaign selected',
        selectedPlural: '{count} campaigns selected',
    },
    summary: {
        trendLabel: 'vs last period',
        cards: {
            totalBudget: 'Total Budget',
            totalSpend: 'Total Spend',
            totalRevenue: 'Total Revenue',
            roi: 'ROI (Return on Investment)',
            totalImpressions: 'Total Impressions',
            totalClicks: 'Total Clicks',
            ctr: 'CTR (Click-Through Rate)',
            roas: 'ROAS (Return on Ad Spend)',
            cpc: 'CPC (Cost Per Click)',
            cpm: 'CPM (Cost Per Mille)',
        },
        tooltips: {
            budget: {
                explanation:
                    'The maximum amount allocated for ad spending across all campaigns.',
                formula: 'Sum of all campaign budgets',
                interpretation:
                    'This is your spending limit. Compare with actual spend to track budget utilization.',
                goodRange: 'Spend should not exceed this amount',
                watchOutOverspending:
                    'âš ï¸ Overspending detected - consider pausing campaigns',
                watchOutWithin: 'âœ… Within budget limits',
                contextualOverspending:
                    'Your campaigns have exceeded the allocated budget. Review and adjust spending limits.',
                contextualWithin: 'Budget utilization is within safe limits.',
            },
            spend: {
                explanation:
                    'The actual amount spent on ads across all campaigns and platforms.',
                interpretation:
                    'Total ad investment. Compare with revenue to calculate ROI.',
                goodRange: 'Typically 80-95% of budget for optimal performance',
                watchOutNoSpend:
                    'âš ï¸ No spend detected - campaigns may be paused',
                watchOutActive: 'âœ… Active spending',
                contextualNoSpend:
                    'No ad spend recorded. Check if campaigns are active and properly connected.',
                contextualPercent: 'Spent {percent}% of allocated budget.',
                contextualUnavailable:
                    'Spend recorded but budget data is unavailable.',
            },
            revenue: {
                explanation:
                    'Total revenue generated from conversions attributed to your ad campaigns.',
                interpretation:
                    'Income from ad-driven sales or actions. Key metric for ROI calculation.',
                goodRange: 'Revenue > Spend = positive return',
                watchOutNoRevenue:
                    'âš ï¸ No revenue recorded - check conversion tracking',
                watchOutGenerated: 'âœ… Revenue generated',
                contextualNoRevenue:
                    'No revenue from conversions yet. Verify conversion tracking is set up correctly.',
                contextualReturn: 'Generated {percent}% return on ad spend.',
                contextualUnavailable:
                    'Revenue recorded but spend data is unavailable. Check campaign tracking.',
            },
            roi: {
                explanation:
                    'Return on Investment: the percentage profit or loss from your ad campaigns.',
                formula: '((Revenue - Spend) / Spend) Ã— 100',
                interpretation:
                    '100% = doubled your investment. 0% = breakeven. Negative = losses.',
                goodRange: '>100% indicates profitable campaigns',
                watchOutNegative:
                    'âš ï¸ Negative ROI - campaigns are losing money',
                watchOutPositive: 'âœ… Positive ROI',
                contextualNegative:
                    'Campaigns are losing {percent}% of investment. Consider optimizing targeting or creative.',
                contextualPositive:
                    'Profitable campaigns with {percent}% return.',
            },
            impressions: {
                explanation:
                    'The total number of times your ads were displayed to users.',
                interpretation:
                    'Measures ad visibility and reach. Higher impressions = broader audience exposure.',
                goodRange: 'Varies by campaign goals and budget',
                watchOutNone: 'âš ï¸ No impressions - ads may not be running',
                watchOutShown: 'âœ… Ads are being shown',
                contextualNone:
                    'Ads are not being displayed. Check campaign status and targeting.',
                contextualShown: '{count} people saw your ads.',
            },
            clicks: {
                explanation:
                    'The total number of times users clicked on your ads.',
                interpretation:
                    'Measures user engagement. More clicks = more traffic to your site.',
                goodRange: 'Depends on ad quality and targeting',
                watchOutNone:
                    'âš ï¸ No clicks - poor ad performance or targeting',
                watchOutClicking: 'âœ… Users are clicking',
                contextualNone:
                    'No clicks recorded. Review ad creative, targeting, or campaign status.',
                contextualClicking: '{count} users engaged with your ads.',
            },
            ctr: {
                explanation:
                    'Click-Through Rate: percentage of users who clicked after seeing your ad.',
                formula: '(Clicks / Impressions) Ã— 100',
                interpretationNoImpressions:
                    'Cannot calculate - no impressions recorded.',
                interpretation:
                    'Measures ad relevance and appeal. Higher CTR = better engagement.',
                goodRangeTypical: '2-5% is typical',
                goodRangeExcellent: '2-5% is typical, >3% is excellent',
                watchOutNoImpressions: 'âš ï¸ No impressions to measure CTR',
                watchOutLow: 'âš ï¸ Low CTR - review ad creative and targeting',
                watchOutGood: 'âœ… Good engagement',
                contextualNoImpressions:
                    'Ads need impressions before CTR can be calculated. Check campaign delivery.',
                contextualLow:
                    'CTR of {value}% is below average. Consider testing different ad copy or images.',
                contextualGood:
                    'Strong CTR of {value}% indicates engaging ads.',
            },
            roas: {
                explanation:
                    'Return on Ad Spend: revenue earned per dollar spent on ads.',
                formula: 'Revenue / Spend',
                interpretationNoSpend: 'Cannot calculate - no spend recorded.',
                interpretation:
                    '2.0x means $2 revenue per $1 spent. Measures campaign efficiency.',
                goodRangeExcellent: '>2.0x is excellent',
                goodRangeGood: '>2.0x is excellent, >1.5x is good',
                watchOutNoSpend: 'âš ï¸ No spend to measure ROAS',
                watchOutLow: 'âš ï¸ ROAS < 1.0 - losing money on ads',
                watchOutProfitable: 'âœ… Profitable campaigns',
                contextualNoSpend:
                    'ROAS requires ad spend to calculate. Check campaign budget and status.',
                contextualLow:
                    "ROAS of {value}x means you're losing money. Optimize targeting or reduce spend.",
                contextualExcellent:
                    'Excellent ROAS of {value}x - great return on investment.',
            },
            cpc: {
                explanation:
                    'Cost Per Click: average amount paid per ad click.',
                formula: 'Spend / Clicks',
                interpretationNoClicks:
                    'Cannot calculate - no clicks recorded.',
                interpretation:
                    'Lower CPC = more efficient spending. Compare across platforms.',
                goodRangeShort: '<$1-5 depending on industry',
                goodRange: '<$1-5 depending on industry and competition',
                watchOutNoClicks: 'âš ï¸ No clicks to measure CPC',
                watchOutHigh: 'âš ï¸ High CPC - expensive clicks',
                watchOutReasonable: 'âœ… Reasonable click costs',
                contextualNoClicks:
                    'CPC requires clicks to calculate. Focus on improving CTR first.',
                contextualHigh:
                    'CPC of {amount} is high. Consider refining targeting.',
                contextualEfficient: 'Efficient CPC of {amount}.',
            },
            cpm: {
                explanation: 'Cost Per Mille: cost to show ads 1,000 times.',
                formula: '(Spend / Impressions) Ã— 1000',
                interpretationNoImpressions:
                    'Cannot calculate - no impressions recorded.',
                interpretation:
                    'Measures cost efficiency for reach. Lower CPM = cheaper impressions.',
                goodRangeShort: '<$5-15 depending on platform',
                goodRange: '<$5-15 depending on platform and targeting',
                watchOutNoImpressions: 'âš ï¸ No impressions to measure CPM',
                watchOutHigh: 'âš ï¸ High CPM - expensive reach',
                watchOutReasonable: 'âœ… Reasonable reach costs',
                contextualNoImpressions:
                    'CPM requires impressions to calculate. Check ad delivery status.',
                contextualHigh:
                    'CPM of {amount} is high. Consider broader targeting.',
                contextualEfficient: 'Efficient CPM of {amount}.',
            },
            default: {
                explanation: 'Metric explanation not available.',
                interpretation: 'Please check documentation for details.',
                contextual:
                    'Contact support if you need help understanding this metric.',
            },
        },
    },
    visualization: {
        title: 'Performance Summary',
        subtitle: 'Track budget distribution and ROI performance at a glance',
        chartTitle: 'Performance (Budget vs Spend vs Revenue)',
        chartSubtitle: 'Top 5 campaigns by spend',
        liveData: 'Live Data',
        labels: {
            budget: 'Budget',
            spend: 'Spend',
            revenue: 'Revenue',
        },
        highlightsTitle: 'Performance Highlights',
        highlightsSubtitle: 'Quick view of spend and best-performing campaign',
        totalSpend: 'Total Spend',
        exactAmount: 'Exact amount',
        topRoi: 'Top ROI',
        bestCampaign: 'Best Campaign',
        roiLabel: 'ROI {value}%',
        activeCampaigns: 'Active Campaigns',
        runningNow: 'Running now',
    },
    analytics: {
        conversionRate: 'Conversion Rate',
        subtitle: 'Channel-by-channel AI insights',
        activeChannel: 'Active Channel',
        analyzing: 'Analyzing...',
        insight: 'Insight',
        benchmark: 'Benchmark',
        top: 'Top:',
        lowest: 'Lowest:',
        keepAbove: 'Keep {campaignName} above {rate}% to stay competitive.',
        action: 'Action',
        platformBreakdown: 'Platform Breakdown',
        platformSubtitle: 'Key metrics and budget utilization',
        bestValue: 'Best Value',
        share: 'Share',
        cpa: 'CPA',
        tooltip: {
            conversionRate: {
                description:
                    'Percentage of users who completed a desired action (purchase, signup, etc.) after clicking your ad.',
                formulaLabel: 'Formula:',
                formula: '(Conversions / Clicks) × 100',
                goodRangeLabel: 'Good Range:',
                goodRange: '2-5% for most industries',
                insightLabel: 'Insight:',
                insight:
                    'Higher conversion rates mean better ad relevance and landing page optimization.',
            },
            platformBreakdown: {
                description:
                    'Compare ad spend, conversions, and cost-per-acquisition across Facebook, Google, TikTok, and Line platforms.',
                shareLabel: 'Share:',
                share: 'Percentage of total budget spent on each platform',
                cpaLabel: 'CPA:',
                cpa: 'Cost Per Acquisition - lower is better',
                tipLabel: 'Tip:',
                tip: 'Focus budget on platforms with the best CPA while testing underperforming channels.',
            },
        },
        performance: {
            prefix: 'is performing',
            steadily: 'steadily',
            diff: '{diff}% {direction}',
            higher: 'higher',
            lower: 'lower',
            aroundAverage: ' around the average.',
            thanAverage: ' than average.',
            high: ' This campaign is performing exceptionally well driven by optimized targeting.',
            medium: ' Performance is stable. Look for opportunities to optimize incrementally.',
            low: ' Consider reviewing ad creatives or landing page relevance to improve performance.',
        },
        actions: {
            high: 'Double down on creatives performing in {campaignName}. Scale budget by 10-15% to maximize ROI while maintaining efficiency.',
            medium: 'Maintain current settings for {campaignName} while testing small variations in ad copy to boost conversion rate slightly.',
            low: 'Test new offer variants to close the gap with {campaignName}. Analyze audience segmentation for potential mismatches.',
        },
        tips: {
            zeroConversions:
                ' is spending without results. Is tracking working? Consider pausing to review ad setup or audience targeting immediately.',
            highEfficiency:
                ' is highly efficient (CPA {amount}). Increase daily budget by 15-20% to scale up these cheap conversions.',
            highCpa:
                ' is expensive (CPA {amount}). Refine targeting or refresh creatives to bring costs down closer to the average.',
            lowSpend:
                " has potential. It's contributing conversions with low spend. Consider giving it more budget to test volume.",
            stable: ' is performing steadily. Maintain current strategy but monitor frequency to avoid ad fatigue.',
            fallback:
                'Launch campaigns across multiple platforms to see AI-driven comparative insights here.',
        },
        tipLabels: {
            warning: 'Efficiency Warning',
            opportunity: 'Optimization Opportunity',
            info: 'Growth Tip',
        },
        navigation: {
            previous: 'Previous',
            next: 'Next',
        },
    },
} as const;
