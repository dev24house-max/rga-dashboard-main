export type TutorialRouteStep = {
  id: string;
  path: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

export const tutorialSteps: TutorialRouteStep[] = [
  {
    id: 'dashboard-overview',
    path: '/dashboard',
    target: '.dashboard-header',
    title: 'Dashboard Overview',
    description:
      'This page gives you a high-level view of your ad performance, campaign health, and integration status in one place.',
    position: 'bottom',
  },
  {
    id: 'dashboard-connect',
    path: '/dashboard',
    target: '#integration-checklist',
    title: 'Connect Your Channels',
    description:
      'Use this checklist to verify integrations and keep your dashboard filled with live campaign data.',
    position: 'bottom',
  },
  {
    id: 'dashboard-metrics',
    path: '/dashboard',
    target: '.dashboard-metrics',
    title: 'Performance Metrics',
    description:
      'These cards summarize your spend, impressions, clicks, conversions, and ROAS so you can spot issues quickly.',
    position: 'bottom',
  },
  {
    id: 'dashboard-date-filter',
    path: '/dashboard',
    target: '.date-filter',
    title: 'Date Filter',
    description:
      'Change the reporting period to compare performance and focus on the right time window.',
    position: 'bottom',
  },
  {
    id: 'dashboard-trend-chart',
    path: '/dashboard',
    target: '.trend-chart',
    title: 'Trend Chart',
    description:
      'This chart visualizes campaign performance over time so you can spot whether metrics are improving.',
    position: 'top',
  },
  {
    id: 'dashboard-funnel',
    path: '/dashboard',
    target: '#conversion-funnel',
    title: 'Conversion Funnel',
    description:
      'See how impressions turn into clicks and conversions to understand the health of your funnel.',
    position: 'top',
  },
  {
    id: 'campaigns-page',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-header"]',
    title: 'Campaigns Page',
    description:
      'Manage every campaign from one place and quickly check their status, budget, and performance.',
    position: 'bottom',
  },
  {
    id: 'campaigns-toolbar',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-toolbar"]',
    title: 'Search & Filters',
    description:
      'Use these filters to find campaigns by status, platform, or keywords and narrow your focus.',
    position: 'bottom',
  },
  {
    id: 'campaigns-search',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-search"]',
    title: 'Search campaigns',
    description:
      'Search by campaign name or keyword to quickly locate the campaign you want to review.',
    position: 'bottom',
  },
  {
    id: 'campaigns-filters',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-filters"]',
    title: 'Status and Platform filters',
    description:
      'Filter campaigns by status or platform to focus on the ones that matter most.',
    position: 'bottom',
  },
  {
    id: 'campaigns-selection-toggle',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-selection-toggle"]',
    title: 'Selected Only toggle',
    description:
      'Toggle this to only show campaigns you have selected, which is useful when reviewing a subset.',
    position: 'bottom',
  },
  {
    id: 'campaigns-table',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-table"]',
    title: 'Campaign Table',
    description:
      'This table helps you sort, select, and act on campaigns across your account.',
    position: 'top',
  },
  {
    id: 'campaigns-summary',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-summary"]',
    title: 'Campaign Summary',
    description:
      'Get a condensed view of campaign performance and health indicators in one summary panel.',
    position: 'top',
  },
  {
    id: 'campaigns-visualization',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-visualization"]',
    title: 'Performance Visualization',
    description:
      'View performance trends and platform distribution to understand where your spend is going.',
    position: 'top',
  },
  {
    id: 'campaigns-analytics',
    path: '/campaigns',
    target: '[data-tutorial="campaigns-analytics"]',
    title: 'Analytics Insights',
    description:
      'Review conversion rates, ROI, and key campaign analytics to make faster decisions.',
    position: 'top',
  },
  {
    id: 'data-sources-page',
    path: '/data-sources',
    target: '[data-tutorial="data-sources-header"]',
    title: 'Data Sources',
    description:
      'Connect advertising platforms here so your campaigns and metrics sync automatically.',
    position: 'bottom',
  },
  {
    id: 'data-sources-grid',
    path: '/data-sources',
    target: '[data-tutorial="data-sources-grid"]',
    title: 'Connected Platforms',
    description:
      'See the integration status for each platform and reconnect accounts when needed.',
    position: 'top',
  },
  {
    id: 'seo-page',
    path: '/seo-web-analytics',
    target: '[data-tutorial="seo-header"]',
    title: 'SEO & Web Analytics',
    description:
      'Track your organic search performance and website engagement in one combined view.',
    position: 'bottom',
  },
  {
    id: 'seo-performance',
    path: '/seo-web-analytics',
    target: '[data-tutorial="seo-performance"]',
    title: 'Performance Summary',
    description:
      'Analyze your key SEO metrics and see how sessions, bounce rate, and goal completions are trending.',
    position: 'top',
  },
  {
    id: 'seo-advanced-metrics',
    path: '/seo-web-analytics',
    target: '[data-tutorial="seo-advanced-metrics"]',
    title: 'Advanced SEO Metrics',
    description:
      'Review domain authority, backlinks, referring domains, and search traffic value to understand SEO health.',
    position: 'top',
  },
  {
    id: 'seo-keyword-analysis',
    path: '/seo-web-analytics',
    target: '[data-tutorial="seo-keyword-analysis"]',
    title: 'Keyword Analysis',
    description:
      'Explore your top organic keywords and identify which search terms are driving the most traffic.',
    position: 'top',
  },
  {
    id: 'seo-offpage-metrics',
    path: '/seo-web-analytics',
    target: '[data-tutorial="seo-offpage-metrics"]',
    title: 'Off-Page Metrics',
    description:
      'Monitor backlink profile and referring domains to improve the authority and reach of your site.',
    position: 'top',
  },
  {
    id: 'ai-insights-page',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-page"]',
    title: 'AI Insights',
    description:
      'Use the AI assistant to generate insights, recommendations, and quick campaign summaries.',
    position: 'bottom',
  },
  {
    id: 'ai-insights-header',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-header"]',
    title: 'AI Assistant Header',
    description:
      'This area introduces the AI Assistant experience and gives you quick context for the page.',
    position: 'bottom',
  },
  {
    id: 'ai-insights-roles',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-roles"]',
    title: 'Mode Selection',
    description:
      'Choose between General, Ads, and SEO modes to tailor AI responses for the right use case.',
    position: 'bottom',
  },
  {
    id: 'ai-insights-new-chat',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-new-chat"]',
    title: 'Start a New Chat',
    description:
      'Start a fresh AI conversation whenever you want to ask about a new topic or reset the context.',
    position: 'right',
  },
  {
    id: 'ai-insights-input',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-input"]',
    title: 'Ask the AI',
    description:
      'Type your question here and hit send to get an instant response from the assistant.',
    position: 'top',
  },
  {
    id: 'ai-insights-summary',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-summary"]',
    title: 'AI Detail Summary',
    description:
      'Generate a strategic summary that highlights your campaign performance and recommendations.',
    position: 'top',
  },
  {
    id: 'ai-insights-tools',
    path: '/ai-insights',
    target: '[data-tutorial="ai-insights-tools"]',
    title: 'Marketing Tools',
    description:
      'Open quick tools for ad and SEO planning to support your AI workflow.',
    position: 'top',
  },
  {
    id: 'users-page',
    path: '/users',
    target: '[data-tutorial="users-header"]',
    title: 'Users',
    description:
      'Manage team members, user roles, and permissions from this central user administration page.',
    position: 'bottom',
  },
  {
    id: 'users-table',
    path: '/users',
    target: '[data-tutorial="users-table"]',
    title: 'User Directory',
    description:
      'Search, filter, and edit users quickly using the user list and built-in controls.',
    position: 'top',
  },
  {
    id: 'settings-page',
    path: '/settings',
    target: '[data-tutorial="settings-header"]',
    title: 'Settings Overview',
    description:
      'Manage all workspace preferences, notifications, and alert configurations from this page.',
    position: 'bottom',
  },
  {
    id: 'settings-tabs',
    path: '/settings',
    target: '[data-tutorial="settings-tabs"]',
    title: 'Settings Tabs',
    description:
      'Choose between General settings for your preferences, or Alert Rules to configure automated alerts.',
    position: 'bottom',
  },
  {
    id: 'settings-appearance',
    path: '/settings',
    target: '[data-tutorial="settings-appearance"]',
    title: 'Appearance Settings',
    description:
      'Customize the dashboard appearance. Toggle dark mode for low-light environments or compact view for more density.',
    position: 'top',
  },
  {
    id: 'settings-regional',
    path: '/settings',
    target: '[data-tutorial="settings-regional"]',
    title: 'Regional Configuration',
    description:
      'Configure your language, timezone, currency, and date format preferences to match your location.',
    position: 'top',
  },
  {
    id: 'settings-language',
    path: '/settings',
    target: '[data-tutorial="settings-language"]',
    title: 'Language Selection',
    description:
      'Choose your preferred interface language. Currently supports Thai and English.',
    position: 'bottom',
  },
  {
    id: 'settings-timezone',
    path: '/settings',
    target: '[data-tutorial="settings-timezone"]',
    title: 'Timezone Setting',
    description:
      'Set your timezone to ensure all dates and times are displayed correctly for your location.',
    position: 'bottom',
  },
  {
    id: 'settings-currency',
    path: '/settings',
    target: '[data-tutorial="settings-currency"]',
    title: 'Currency Preference',
    description:
      'Select your preferred currency for financial metrics and cost calculations throughout the dashboard.',
    position: 'bottom',
  },
  {
    id: 'settings-dateformat',
    path: '/settings',
    target: '[data-tutorial="settings-dateformat"]',
    title: 'Date Format',
    description:
      'Choose how dates are displayed. Options include DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD formats.',
    position: 'bottom',
  },
  {
    id: 'settings-notifications',
    path: '/settings',
    target: '[data-tutorial="settings-notifications"]',
    title: 'Notification Preferences',
    description:
      'Control how you receive alerts. Enable or disable in-app notifications, email alerts, and LINE integrations.',
    position: 'top',
  },
  {
    id: 'settings-inapp-notify',
    path: '/settings',
    target: '[data-tutorial="settings-inapp-notify"]',
    title: 'In-App Notifications',
    description:
      'When enabled, important alerts and updates will appear directly in your dashboard notification panel.',
    position: 'top',
  },
  {
    id: 'settings-email-notify',
    path: '/settings',
    target: '[data-tutorial="settings-email-notify"]',
    title: 'Email Notifications',
    description:
      'Email alerts are currently unavailable but will be coming soon. You\'ll be able to receive critical updates via email.',
    position: 'top',
  },
  {
    id: 'settings-line-notify',
    path: '/settings',
    target: '[data-tutorial="settings-line-notify"]',
    title: 'LINE Notifications',
    description:
      'LINE integration for alerts is coming soon. You\'ll be able to receive notifications directly on LINE.',
    position: 'top',
  },
  {
    id: 'reports-page',
    path: '/reports',
    target: '[data-tutorial="reports-header"]',
    title: 'Reports & Export',
    description:
      'Download campaign data and performance metrics in CSV or PDF reports.',
    position: 'bottom',
  },
  {
    id: 'reports-filters',
    path: '/reports',
    target: '[data-tutorial="reports-filters"]',
    title: 'Export Filters',
    description:
      'Set the period, platform, and campaign status for exports before you download reports.',
    position: 'top',
  },
];
