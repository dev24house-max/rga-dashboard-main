export const notificationsEn = {
  trigger: {
    ariaLabel: "Notifications",
    ariaLabelWithUnread: "Notifications ({count} unread)",
  },
  header: {
    title: "Notifications",
    markAllRead: "Mark all as read",
  },
  empty: {
    title: "No notifications",
    description: "You're all caught up!",
  },
  footer: {
    count: "{count} notifications",
    countOne: "{count} notification",
    close: "Close",
  },
  time: {
    justNow: "Just now",
    minutesAgo: "{count}m ago",
    hoursAgo: "{count}h ago",
    daysAgo: "{count}d ago",
  },
  templates: {
    alertMessage:
      'Campaign "{campaignName}" has {metric} = {value} (condition: {operator} {threshold})',
    syncCompleteTitle: "{platform} Sync Complete",
    syncCompleteMessage:
      "Successfully synced {recordsCount} records from {platform}.",
  },
  metrics: {
    ctr: "CTR",
    cpc: "CPC",
    roas: "ROAS",
    spend: "Spend",
    impressions: "Impressions",
    clicks: "Clicks",
    conversions: "Conversions",
    revenue: "Revenue",
  },
  operators: {
    gt: "greater than",
    lt: "less than",
    gte: "greater than or equal to",
    lte: "less than or equal to",
    eq: "equal to",
  },
} as const;
