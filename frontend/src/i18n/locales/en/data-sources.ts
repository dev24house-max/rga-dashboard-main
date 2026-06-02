export const dataSourcesEn = {
    page: {
        title: 'Data Sources',
        subtitle:
            'Connect your advertising platforms to sync campaigns and metrics.',
        connectedPlatforms: 'Connected Platforms',
        connectedPlatformsTooltip:
            'Connect ad platforms to automatically import your campaigns, spending data, and performance metrics. You can manage and disconnect platforms anytime.',
        disconnectDialog: {
            title: 'Disconnect Integration?',
            description:
                'This will remove the connection to {platformName}. Any synced data will remain, but new data will no longer be imported.',
            fallbackPlatform: 'this platform',
            cancel: 'Cancel',
            disconnect: 'Disconnect',
        },
    },
    platforms: {
        adPlatform: 'Ad Platform',
        google: {
            name: 'Google Ads',
            description:
                'Connect your Google Ads account to sync campaigns and metrics',
        },
        'google-analytics': {
            name: 'Google Analytics 4',
            description: 'Connect your GA4 property to sync web analytics data',
        },
        'search-console': {
            name: 'Google Search Console',
            description:
                'Connect Search Console to sync organic search performance',
        },
        facebook: {
            name: 'Facebook Ads',
            description: 'Connect your Facebook Ads account to sync campaigns',
        },
        tiktok: {
            name: 'TikTok Ads',
            description: 'Connect your TikTok Ads account to sync campaigns',
        },
        line: {
            name: 'LINE Ads',
            description: 'Connect your LINE Ads account to sync campaigns',
        },
    },
    card: {
        connected: 'Connected',
        notConnected: 'Not Connected',
        never: 'Never',
        lastSync: 'Last sync: {date}',
        moreAccounts: '+{count} more account(s)',
        connectDescription:
            'Connect your {platformName} account to sync campaigns and metrics.',
        disconnect: 'Disconnect',
        openDashboard: 'Open Dashboard',
        connectPlatform: 'Connect {platformName}',
    },
    accountDialog: {
        title: 'Select {platformName} Account',
        description:
            'Choose the account or property to connect. You can change this later in settings.',
        empty: 'No accounts found. Please check your permissions.',
        idLabel: 'ID:',
        statusSeparator: 'â€¢',
        cancel: 'Cancel',
        connecting: 'Connecting...',
        connect: 'Connect',
    },
    toasts: {
        integrationError: 'Integration error: {error}',
        platformConnected: '{platformName} connected successfully!',
        unknownPlatform: 'Unknown platform in callback',
        noAccountsFound: 'No accounts found. Please check your permissions.',
        fetchAccountsFailed: 'Failed to fetch accounts. Please try again.',
        connectionFailed: 'Failed to connect {platformName}: {message}',
        tiktokSandboxConnected: 'TikTok Sandbox connected successfully!',
        noAuthUrl: 'No auth URL received',
        facebookNotConfigured:
            'Facebook integration is not configured. Please contact administrator to set up Facebook App credentials.',
        unknownError: 'Unknown error',
        startConnectionFailed:
            'Failed to start {platformName} connection: {message}',
        platformDisconnected: '{platformName} disconnected',
        disconnectFailed: 'Failed to disconnect {platformName}',
    },
} as const;
