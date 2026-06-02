export const seoEn = {
    page: {
        title: 'SEO & Web Analytics',
        subtitle:
            'Track your organic search performance and website engagement.',
        refreshData: 'Refresh Data',
        syncing: 'Syncing...',
        sections: {
            performanceSummary: 'Performance Summary',
            performanceSummaryTooltip:
                'Key metrics including organic sessions, engagement time, bounce rate, and goal completions from Google Analytics.',
            performanceTrends: 'Performance Trends',
            performanceTrendsTooltip:
                'Track your organic search performance metrics over time including sessions, clicks, and rankings.',
            keywordTrafficAnalysis: 'Keyword & Traffic Analysis',
            keywordTrafficAnalysisTooltip:
                'Comprehensive analysis of your organic keywords, traffic sources, search intent, and anchor text patterns.',
            topOrganicKeywords: 'Top Organic Keywords',
            topOrganicKeywordsTooltip:
                'Your highest-performing keywords ranked in organic search results, ranked by traffic and position.',
            trafficByLocation: 'Traffic by Location',
            trafficByLocationTooltip:
                'Geographic distribution of your organic search traffic showing which regions drive the most sessions.',
            keywordsByIntent: 'Keywords by Intent',
            keywordsByIntentTooltip:
                'Keywords grouped by search intent type including informational, navigational, and transactional queries.',
            anchorTextAnalysis: 'Anchor Text Analysis',
            anchorTextAnalysisTooltip:
                'Analysis of anchor text used in backlinks pointing to your site, helping identify linking patterns and opportunities.',
            offPageAuthority: 'Off-Page & Authority',
            offPageAuthorityTooltip:
                'External SEO factors including domain authority, backlink profile, referring domains, and link quality analysis from Ahrefs data.',
            authorityMetrics: 'Authority Metrics',
            backlinkProfile: 'Backlink Profile',
        },
        toasts: {
            syncGaSuccess: 'Successfully synced Google Analytics data',
            syncGaFailed: 'Failed to sync Google Analytics data',
            syncGscSuccess: 'Successfully synced Google Search Console data',
            syncGscFailed: 'Failed to sync Google Search Console data',
        },
    },
    connection: {
        checking: 'Checking Google Analytics connection...',
        unableToVerify: 'Unable to verify Google Analytics connection',
        connected: 'Google Analytics connected',
        notConnected: 'Google Analytics not connected',
        goToDataSources: 'Go to Data Sources to connect',
    },
    summaryCards: {
        duration: '{minutes}m {seconds}s',
        trendVsPrev: '{trend}% vs prev',
        titles: {
            organicSessions: 'Organic Sessions',
            goalCompletions: 'Goal Completions',
            avgPosition: 'Avg. Position',
            avgTimeOnPage: 'Avg. Time on Page',
            activeUsers: 'Active Users',
            screenPageViews: 'Page Views',
            engagementRate: 'Engagement Rate',
            bounceRate: 'Bounce Rate',
        },
        descriptions: {
            organicSessions: 'Total organic traffic sessions',
            goalCompletions: 'Completed conversion goals',
            avgPosition: 'Average search ranking position',
            avgTimeOnPage:
                'Average session duration compared to the previous period',
            activeUsers: 'Total active users',
            screenPageViews: 'Total screen page views',
            engagementRate: 'Percentage of engaged sessions',
            bounceRate: 'Percentage of single-page sessions',
        },
        tooltipHeaders: {
            organicSessions: 'ORGANIC SESSIONS',
            goalCompletions: 'GOAL COMPLETIONS',
            avgPosition: 'AVG POSITION',
            avgTimeOnPage: 'AVG TIME ON PAGE',
            activeUsers: 'ACTIVE USERS',
            screenPageViews: 'SCREEN PAGE VIEWS',
            engagementRate: 'ENGAGEMENT RATE',
            bounceRate: 'BOUNCE RATE',
        },
        tooltips: {
            organicSessions: {
                explanation:
                    'Organic Sessions: Total number of visits from organic search results.',
                contextualEmpty:
                    'No organic traffic detected. Check if Google Analytics is properly connected.',
                contextualValue:
                    '{count} visitors found your site through search engines.',
            },
            goalCompletions: {
                explanation:
                    'Goal Completions: Number of times visitors completed your defined conversion goals.',
                contextualEmpty:
                    'No goals completed yet. Set up conversion goals in Google Analytics to track user actions.',
                contextualValue:
                    '{count} visitors completed your goals. Good job on conversions!',
            },
            avgPosition: {
                explanation:
                    "Average Position: Your website's average ranking position in search results.",
                contextualEmpty:
                    'No ranking data available. Rankings typically appear after your site gets organic traffic.',
                contextualExcellent:
                    'Excellent! Ranking at position {position} puts you on the first page.',
                contextualGood:
                    'Good ranking at position {position}. Consider optimizing for top 3 positions.',
                contextualLow:
                    'Ranking at position {position}. Focus on improving SEO to reach top 10.',
            },
            avgTimeOnPage: {
                explanation:
                    'Average Time on Page: How long visitors spend on your website pages.',
                contextualLow:
                    'Visitors spend only {seconds} seconds. Improve content engagement.',
                contextualDecent:
                    'Decent engagement with {minutes}m {seconds}s average time.',
                contextualExcellent:
                    'Excellent engagement! Visitors spend {minutes}m {seconds}s on average.',
            },
            activeUsers: {
                explanation:
                    'Active Users: Number of users engaged with your site during the reporting period.',
                contextualEmpty:
                    'No active user data available for this period.',
                contextualValue: '{count} active users engaged with your site.',
            },
            screenPageViews: {
                explanation:
                    'Page Views: Total number of pages or screens viewed by visitors.',
                contextualEmpty: 'No page view data available for this period.',
                contextualValue:
                    '{count} pages were viewed during the reporting period.',
            },
            engagementRate: {
                explanation:
                    'Engagement Rate: Percentage of sessions that were considered engaged.',
                contextualEmpty: 'No engagement rate data available.',
                contextualValue:
                    'Your engagement rate is {rate}%. Higher values indicate stronger visitor interaction.',
            },
            bounceRate: {
                explanation:
                    'Bounce Rate: Percentage of single-page sessions without interaction.',
                contextualEmpty: 'No bounce rate data available.',
                contextualLow: 'Low bounce rate at {rate}%. Great engagement.',
                contextualModerate:
                    'Moderate bounce rate at {rate}%. Review page relevance and UX.',
                contextualHigh:
                    'High bounce rate at {rate}%. Improve landing pages and calls to action.',
            },
            default: {
                explanation: 'SEO metric explanation not available.',
                contextual:
                    'Contact support if you need help understanding this metric.',
            },
        },
    },
    premiumCards: {
        backlinks: 'Backlinks',
        totalBacklinks: 'Total Backlinks',
        referringDomains: 'Referring Domains',
        keywords: 'Keywords',
        trafficCost: 'Traffic Cost',
        organicSearch: 'Organic Search',
        totalTraffic: 'Total Traffic',
        tooltipHeaders: {
            ur: 'UR',
            dr: 'DR',
            backlinks: 'BACKLINKS',
            organicSearch: 'ORGANIC SEARCH',
        },
        tooltips: {
            ur: {
                explanation:
                    "URL Rating: Ahrefs' score measuring the strength of a target page's backlink profile.",
                contextualEmpty:
                    'No URL rating data available. UR scores typically range from 0-100.',
                contextualExcellent: 'Excellent UR score of {score}!',
                contextualGood: 'Good UR score of {score}.',
                contextualFair: 'Fair UR score of {score}.',
                contextualLow: 'Low UR score of {score}.',
            },
            dr: {
                explanation:
                    "Domain Rating: Ahrefs' score measuring the strength of your entire domain's backlink profile.",
                contextualEmpty:
                    'No domain rating data available. DR scores typically range from 0-100.',
                contextualOutstanding: 'Outstanding DR score of {score}!',
                contextualStrong: 'Strong DR score of {score}.',
                contextualModerate: 'Moderate DR score of {score}.',
                contextualLow: 'Low DR score of {score}.',
            },
            backlinks: {
                explanation:
                    'Backlinks: Total number of external links pointing to your website.',
                contextualEmpty: 'No backlinks detected.',
                contextualValue:
                    '{backlinks} backlinks from {domains} domains.',
            },
            organicSearch: {
                explanation:
                    'Organic Search: Website traffic from unpaid search engine results.',
                contextualEmpty: 'No organic search traffic.',
                contextualValue: '{count} organic visitors.',
            },
            default: {
                explanation: 'SEO metric explanation not available.',
                contextual: 'Contact support if you need help.',
            },
        },
    },
    performanceChart: {
        title: 'Performance Trends',
        empty: 'No data available for the selected period',
        metrics: {
            organicTraffic: 'Organic Traffic',
            paidTraffic: 'Paid Traffic',
            impressions: 'Impressions',
            paidTrafficCost: 'Paid Traffic Cost',
            avgPosition: 'Avg. Position',
            referringDomains: 'Referring Domains',
            dr: 'Domain Rating',
            ur: 'URL Rating',
            organicTrafficValue: 'Organic Traffic Value',
            organicPages: 'Organic Pages',
            crawledPages: 'Crawled Pages',
        },
    },
    topKeywords: {
        title: 'Top Organic Keywords',
        beta: 'Beta',
        loading: 'Loading...',
        columns: {
            keywords: 'Keywords',
            position: 'pos.',
            volume: 'Volume',
            cpc: 'CPC(USD)',
            trafficPercent: 'Traffic, %',
        },
    },
    trafficLocation: {
        title: 'Traffic by location',
        columns: {
            location: 'Location',
            traffic: 'Traffic',
            share: 'Share',
            keywords: 'Keywords',
        },
        empty: 'No location data available',
    },
    keywordIntent: {
        title: 'Organic keywords by intent',
        columns: {
            intent: 'Intent',
            keywords: 'Keywords',
            traffic: 'Traffic',
        },
        labels: {
            branded: 'Branded',
            nonBranded: 'Non-branded',
            informational: 'Informational',
            navigational: 'Navigational',
            commercial: 'Commercial',
            transactional: 'Transactional',
        },
    },
    anchorText: {
        title: 'Anchors',
        beta: 'Beta',
        referringDomains: 'Referring domains',
        loading: 'Loading...',
    },
    offpage: {
        beta: 'Beta',
        crawledPages: 'Crawled pages',
        totalTitle: 'Total {title}',
        pages: {
            backlinks: 'Backlinks',
            referringDomains: 'Referring Domains',
            networkRatings: 'Network & Ratings',
        },
        labels: {
            dofollow: 'Dofollow',
            nofollow: 'Nofollow',
            ugc: 'UGC',
            sponsored: 'Sponsored',
            text: 'Text',
            redirect: 'Redirect',
            image: 'Image',
            form: 'Form',
            governmental: 'Governmental',
            educational: 'Educational',
            gov: '.gov',
            edu: '.edu',
            com: '.com',
            net: '.net',
            org: '.org',
            referringPages: 'Referring pages',
            referringIps: 'Referring Ips',
            referringSubnets: 'Referring subnets',
            ur81100: 'UR 81-100',
            ur6180: 'UR 61-80',
            ur4160: 'UR 41-60',
            ur2140: 'UR 21-40',
            ur120: 'UR 1-20',
        },
    },
} as const;
