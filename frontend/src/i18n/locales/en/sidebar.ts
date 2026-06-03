export const sidebarEn = {
    logoAlt: 'RGA Data Logo',
    groups: {
        analytics: 'Analytics',
        intelligence: 'Intelligence',
        system: 'System',
    },
    items: {
        overview: 'Overview',
        campaigns: 'Campaigns',
        dataSources: 'Data Sources',
        seoWeb: 'SEO & Web',
        aiInsightsTools: 'AI Insights & Tools',
        ecommerceInsights: 'E-commerce Insights',
        settings: 'Settings',
        reports: 'Reports',
        users: 'Users',
    },
    badges: {
        soon: 'Soon',
    },
    profile: {
        fallbackName: 'User',
        fallbackRole: 'Viewer',
        roles: {
            admin: 'ADMIN',
            manager: 'MANAGER',
            client: 'CLIENT',
            viewer: 'VIEWER',
        },
    },
    actions: {
        signOut: 'Sign out',
    },
    logoutDialog: {
        title: 'Confirm sign out',
        description:
            'Are you sure you want to sign out? You can sign back in later.',
        cancel: 'Cancel',
        confirm: 'Sign out',
    },
} as const;
