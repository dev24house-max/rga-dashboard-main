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
