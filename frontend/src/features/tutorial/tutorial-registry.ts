import { TutorialRouteStep } from './tutorial-config';

export interface TutorialConfig {
  storageKey: string;
  steps: TutorialRouteStep[];
}

export function resolveTutorialRoute(path: string) {
  const cleaned = path.split('?')[0].replace(/\/+$/, '');
  return cleaned === '' ? '/dashboard' : cleaned;
}

export const tutorialRegistry: Record<string, TutorialConfig> = {
  '/dashboard': {
    storageKey: 'overview_tutorial_completed',
    steps: [
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
          'Track how spend, impressions, clicks, and conversions change over the selected period so you can spot performance shifts early.',
        position: 'bottom',
      },
      {
        id: 'dashboard-funnel',
        path: '/dashboard',
        target: '#conversion-funnel',
        title: 'Conversion Funnel',
        description:
          'See how impressions flow into clicks and conversions so you can identify where users drop out in the funnel.',
        position: 'top',
      },
    ],
  },
  '/data-sources': {
    storageKey: 'data_tutorial_completed',
    steps: [
      {
        id: 'data-sources-overview',
        path: '/data-sources',
        target: '[data-tutorial="data-sources-header"]',
        title: 'Data Sources Overview',
        description:
          'Connect your advertising platforms so campaign data and ad spend sync into your dashboard automatically.',
        position: 'bottom',
      },
      {
        id: 'data-sources-grid',
        path: '/data-sources',
        target: '[data-tutorial="data-sources-grid"]',
        title: 'Platform Connections',
        description:
          'Each card shows connection status and lets you connect or disconnect ad accounts for your integrated platforms.',
        position: 'top',
      },
    ],
  },
  '/campaigns': {
    storageKey: 'campaigns_tutorial_completed',
    steps: [
      {
        id: 'campaigns-overview',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-header"]',
        title: 'Campaigns Overview',
        description:
          'This page helps you review campaign performance, status, and control actions from one place.',
        position: 'bottom',
      },
      {
        id: 'campaigns-toolbar',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-toolbar"]',
        title: 'Search & Filters',
        description:
          'Use the toolbar to search by name, filter by platform or status, and adjust the campaign time window.',
        position: 'bottom',
      },
      {
        id: 'campaigns-search',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-search"]',
        title: 'Search Campaigns',
        description:
          'Search by campaign name or keyword to quickly locate the campaign you want to review or edit.',
        position: 'bottom',
      },
      {
        id: 'campaigns-filters',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-filters"]',
        title: 'Status & Platform Filters',
        description:
          'Filter campaigns by status or platform so you can narrow the list to active, paused, ended, or draft campaigns.',
        position: 'bottom',
      },
      {
        id: 'campaigns-selection-toggle',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-selection-toggle"]',
        title: 'Selected Only',
        description:
          'Toggle this to view only campaigns you have selected, which makes bulk review and actions easier.',
        position: 'bottom',
      },
      {
        id: 'campaigns-table',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-table"]',
        title: 'Campaign Table',
        description:
          'This table shows campaign details, lets you sort columns, select items, and use edit or delete actions.',
        position: 'top',
      },
      {
        id: 'campaigns-summary',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-summary"]',
        title: 'Performance Summary',
        description:
          'Review aggregated spend, impressions, clicks, and conversion-rate metrics for the displayed campaigns.',
        position: 'top',
      },
      {
        id: 'campaigns-visualization',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-visualization"]',
        title: 'Campaign Visualization',
        description:
          'These charts show campaign performance and platform distribution so you can compare status and spend trends.',
        position: 'top',
      },
      {
        id: 'campaigns-analytics',
        path: '/campaigns',
        target: '[data-tutorial="campaigns-analytics"]',
        title: 'Campaign Analytics',
        description:
          'Analyze ROI, cost-per-click, and conversion performance to identify campaigns worth optimizing.',
        position: 'top',
      },
    ],
  },
  '/ai-insights': {
    storageKey: 'ai_insights_tutorial_completed',
    steps: [
      {
        id: 'ai-insights-overview',
        path: '/ai-insights',
        target: '[data-tutorial="ai-insights-page"]',
        title: 'AI Insights Overview',
        description:
          'Ask the AI assistant questions about campaign strategy, SEO, or traffic performance in one place.',
        position: 'bottom',
      },
    ],
  },
  '/reports': {
    storageKey: 'reports_tutorial_completed',
    steps: [
      {
        id: 'reports-overview',
        path: '/reports',
        target: '[data-tutorial="reports-header"]',
        title: 'Reports Overview',
        description:
          'Download campaign metrics and export-ready performance summaries from this page.',
        position: 'bottom',
      },
      {
        id: 'reports-filters',
        path: '/reports',
        target: '[data-tutorial="reports-filters"]',
        title: 'Export Filters',
        description:
          'Choose a period, platform, and campaign status before exporting to CSV or PDF.',
        position: 'top',
      },
      {
        id: 'reports-export-csv',
        path: '/reports',
        target: '[data-tutorial="reports-export-csv"]',
        title: 'CSV Export',
        description:
          'Export raw campaign data including spend, clicks, conversions, and ROAS for offline analysis.',
        position: 'top',
      },
      {
        id: 'reports-export-pdf',
        path: '/reports',
        target: '[data-tutorial="reports-export-pdf"]',
        title: 'PDF Export',
        description:
          'Download a formatted PDF report with performance summaries and period-over-period comparisons.',
        position: 'top',
      },
      {
        id: 'reports-info',
        path: '/reports',
        target: '[data-tutorial="reports-info"]',
        title: 'Report Details',
        description:
          'This section explains which export is raw data versus which one is a formatted summary report.',
        position: 'top',
      },
    ],
  },
  '/users': {
    storageKey: 'users_tutorial_completed',
    steps: [
      {
        id: 'users-overview',
        path: '/users',
        target: '[data-tutorial="users-header"]',
        title: 'Users Overview',
        description:
          'Manage user accounts, roles, and workspace access from the Users page.',
        position: 'bottom',
      },
      {
        id: 'users-metrics',
        path: '/users',
        target: '[data-tutorial="users-metrics"]',
        title: 'Role Metrics',
        description:
          'See counts for Admins, Managers, and Clients to understand your current team composition.',
        position: 'top',
      },
      {
        id: 'users-table',
        path: '/users',
        target: '[data-tutorial="users-table"]',
        title: 'User Directory',
        description:
          'View users, roles, and creation dates in the table, and access account controls from the action column.',
        position: 'top',
      },
      {
        id: 'users-search-filter',
        path: '/users',
        target: '[data-tutorial="users-search-filter"]',
        title: 'Search & Filter',
        description:
          'Search by name or email, or filter by role to quickly find the user account you need.',
        position: 'bottom',
      },
      {
        id: 'users-add-button',
        path: '/users',
        target: '[data-tutorial="users-add-button"]',
        title: 'Add User',
        description:
          'Create a new user account and assign the correct role for their access level.',
        position: 'left',
      },
      {
        id: 'users-actions',
        path: '/users',
        target: '[data-tutorial="users-actions"]',
        title: 'Edit & Remove Users',
        description:
          'Use the edit or delete buttons to update user details or remove accounts that are no longer needed.',
        position: 'top',
      },
    ],
  },
  '/settings': {
    storageKey: 'settings_tutorial_completed',
    steps: [
      {
        id: 'settings-overview',
        path: '/settings',
        target: '[data-tutorial="settings-header"]',
        title: 'Settings Overview',
        description:
          'Manage account preferences, regional formatting, notification behavior, and alert configuration from this page.',
        position: 'bottom',
      },
      {
        id: 'settings-tabs',
        path: '/settings',
        target: '[data-tutorial="settings-tabs"]',
        title: 'Settings Sections',
        description:
          'Switch between general preferences and alert rules using these tabs.',
        position: 'bottom',
      },
      {
        id: 'settings-appearance',
        path: '/settings',
        target: '[data-tutorial="settings-appearance"]',
        title: 'Appearance',
        description:
          'Control display preferences such as dark mode and compact view.',
        position: 'top',
      },
      {
        id: 'settings-regional',
        path: '/settings',
        target: '[data-tutorial="settings-regional"]',
        title: 'Regional Preferences',
        description:
          'Set language, timezone, currency, and date format so reports match your working context.',
        position: 'top',
      },
      {
        id: 'settings-notifications',
        path: '/settings',
        target: '[data-tutorial="settings-notifications"]',
        title: 'Notification Preferences',
        description:
          'Choose which channels should receive dashboard alerts and system notifications.',
        position: 'top',
      },
      {
        id: 'settings-alert-rules-tab',
        path: '/settings',
        target: '[data-tutorial="settings-alerts-tab"]',
        title: 'Alert Rules',
        description:
          'Open this tab to create watchdog rules that monitor metrics and trigger alerts.',
        position: 'bottom',
      },
    ],
  },
  '/seo-web-analytics': {
    storageKey: 'seo_tutorial_completed',
    steps: [
      {
        id: 'seo-overview',
        path: '/seo-web-analytics',
        target: '[data-tutorial="seo-header"]',
        title: 'SEO & Web Analytics Overview',
        description:
          'Monitor organic traffic and website engagement metrics from your SEO dashboard.',
        position: 'bottom',
      },
      {
        id: 'seo-performance',
        path: '/seo-web-analytics',
        target: '[data-tutorial="seo-performance"]',
        title: 'Performance Summary',
        description:
          'Review sessions, bounce rate, engagement, and goal completions to understand audience behavior.',
        position: 'top',
      },
      {
        id: 'seo-performance-trends',
        path: '/seo-web-analytics',
        target: '[data-tutorial="seo-performance-trends"]',
        title: 'Trend Analysis',
        description:
          'Track organic search performance over time to see whether traffic and engagement are rising or falling.',
        position: 'top',
      },
      {
        id: 'seo-keyword-analysis',
        path: '/seo-web-analytics',
        target: '[data-tutorial="seo-keyword-analysis"]',
        title: 'Keyword & Traffic Analysis',
        description:
          'Explore which keywords drive the most traffic and how search intent impacts your organic reach.',
        position: 'top',
      },
      {
        id: 'seo-offpage-metrics',
        path: '/seo-web-analytics',
        target: '[data-tutorial="seo-offpage-metrics"]',
        title: 'Off-Page Metrics',
        description:
          'Review backlink and referring-domain metrics that help determine your site authority.',
        position: 'top',
      },
    ],
  },
};
