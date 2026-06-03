// =============================================================================
// NotificationBell - Real-time Notification Center with Polling
// =============================================================================

import { useEffect } from "react";
import { Bell, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationStore } from "@/stores/notification-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/use-translation";
import type { Notification } from "@/types/api";

// =============================================================================
// Constants
// =============================================================================

const POLL_INTERVAL = 30 * 1000; // 30 seconds
const METRIC_PATTERN =
  /\b(ctr|cpc|roas|spend|impressions|clicks|conversions|revenue)\b/i;

type NotificationT = (
  path: string,
  params?: Record<string, string | number>
) => string;
type NotificationMetadata = NonNullable<Notification["metadata"]>;

// =============================================================================
// Time Formatting Utility
// =============================================================================

function formatTimeAgo(
  dateString: string,
  t: NotificationT,
  language: string
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (Number.isNaN(date.getTime())) return "";
  if (minutes < 1) return t("time.justNow");
  if (minutes < 60) return t("time.minutesAgo", { count: minutes });
  if (hours < 24) return t("time.hoursAgo", { count: hours });
  if (days < 7) return t("time.daysAgo", { count: days });

  return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-US").format(
    date
  );
}

function getAccentColor(notification: Notification): string {
  const severity = (notification.metadata as Record<string, unknown> | null)
    ?.severity as string | undefined;

  if (severity === "CRITICAL") return "text-red-500";
  if (severity === "WARNING") return "text-amber-500";
  if (notification.type === "SYNC_COMPLETE") return "text-green-500";
  if (notification.priority === "HIGH" || notification.priority === "URGENT") {
    return "text-red-500";
  }

  return "text-blue-500";
}

function translateKnownValue(
  t: NotificationT,
  group: "metrics" | "operators",
  value: string | undefined
) {
  if (!value) return "";

  const normalized = value.toLowerCase();
  const key = `${group}.${normalized}`;
  const translated = t(key);
  return translated === key ? value : translated;
}

function splitNotificationTitle(title: string) {
  const separatorIndex = title.indexOf(":");
  if (separatorIndex === -1) {
    return { ruleName: undefined, campaignName: undefined };
  }

  return {
    ruleName: title.slice(0, separatorIndex).trim(),
    campaignName: title.slice(separatorIndex + 1).trim(),
  };
}

function parseAlertMessage(message: string) {
  const metric = message.match(METRIC_PATTERN)?.[1]?.toLowerCase();
  const value = message.match(/=\s*([0-9.,]+)/)?.[1];
  const condition =
    message.match(
      /(?:condition|threshold|เกณฑ์|เงื่อนไข):\s*([a-z]+)\s*([0-9.,]+)/i
    ) ?? message.match(/\(([a-z]+)\s*([0-9.,]+)\)/i);
  const campaignName = message.match(/Campaign\s+"([^"]+)"/i)?.[1];

  return {
    campaignName,
    metric,
    value,
    operator: condition?.[1]?.toLowerCase(),
    threshold: condition?.[2],
  };
}

function getLocalizedNotificationContent(
  notification: Notification,
  t: NotificationT
) {
  const metadata = (notification.metadata ?? {}) as NotificationMetadata;

  if (notification.type === "ALERT") {
    const titleParts = splitNotificationTitle(notification.title);
    const parsed = parseAlertMessage(notification.message);
    const campaignName =
      metadata.campaignName ?? titleParts.campaignName ?? parsed.campaignName;
    const metric = metadata.metric ?? parsed.metric;
    const value = metadata.value ?? parsed.value;
    const operator = metadata.operator ?? parsed.operator;
    const threshold = metadata.threshold ?? parsed.threshold;

    if (
      campaignName &&
      metric &&
      value !== undefined &&
      operator &&
      threshold !== undefined
    ) {
      return {
        title: notification.title,
        message: t("templates.alertMessage", {
          campaignName,
          metric: translateKnownValue(t, "metrics", metric),
          value,
          operator: translateKnownValue(t, "operators", operator),
          threshold,
        }),
      };
    }
  }

  if (notification.type === "SYNC_COMPLETE") {
    const platform =
      metadata.platform ??
      notification.title.match(/^(.*?)\s+Sync Complete$/i)?.[1] ??
      notification.message.match(/from\s+(.+?)\.?$/i)?.[1];
    const recordsCount =
      metadata.recordsCount ??
      notification.message.match(/synced\s+([0-9,]+)\s+records/i)?.[1];

    if (platform && recordsCount !== undefined) {
      return {
        title: t("templates.syncCompleteTitle", { platform }),
        message: t("templates.syncCompleteMessage", {
          recordsCount,
          platform,
        }),
      };
    }
  }

  return {
    title: notification.title,
    message: notification.message,
  };
}

// =============================================================================
// Notification Item Component
// =============================================================================

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  t: NotificationT;
  language: string;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  t,
  language,
}: NotificationItemProps) {
  const display = getLocalizedNotificationContent(notification, t);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group relative cursor-pointer p-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-muted/60",
        !notification.isRead &&
          "bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.12]"
      )}
      onClick={() => onMarkAsRead(notification.id)}
      onKeyDown={e => e.key === "Enter" && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1 shrink-0">
          <span
            className={cn(
              "block h-2 w-2 rounded-full",
              !notification.isRead
                ? "bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:bg-blue-400 dark:shadow-[0_0_0_3px_rgba(96,165,250,0.16)]"
                : "bg-transparent"
            )}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <p
              className={cn(
                "min-w-0 whitespace-normal break-words text-xs leading-snug",
                !notification.isRead
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground"
              )}
            >
              {display.title}
            </p>
            <span
              className={cn(
                "shrink-0 text-[10px] leading-4",
                getAccentColor(notification)
              )}
            >
              {formatTimeAgo(notification.createdAt, t, language)}
            </span>
          </div>

          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-600 dark:text-muted-foreground">
            {display.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatNotificationCount(count: number, t: NotificationT) {
  return t(count === 1 ? "footer.countOne" : "footer.count", { count });
}

function NotificationList({
  isLoading,
  notifications,
  onMarkAsRead,
  t,
  language,
}: {
  isLoading: boolean;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  t: NotificationT;
  language: string;
}) {
  if (isLoading && notifications.length === 0) {
    return <NotificationSkeleton />;
  }

  if (notifications.length === 0) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="divide-y divide-border text-left">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          t={t}
          language={language}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function NotificationSkeleton() {
  return (
    <div className="px-4 py-4 space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Empty State
// =============================================================================

function EmptyState({ t }: { t: NotificationT }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
      <Bell className="mb-2 h-10 w-10 opacity-20" />
      <p className="text-sm">{t("empty.title")}</p>
      <p className="mt-1 text-xs">{t("empty.description")}</p>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

interface NotificationBellProps {
  triggerStyle?: "default" | "floating";
  showUnreadCount?: boolean;
}

export function NotificationBell({
  triggerStyle = "default",
  showUnreadCount = true,
}: NotificationBellProps = {}) {
  const { language, t } = useTranslation("notifications");
  const {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    setOpen,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
  } = useNotificationStore();

  // Start polling on mount, stop on unmount
  useEffect(() => {
    startPolling(POLL_INTERVAL);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const isFloating = triggerStyle === "floating";
  const triggerClassName = isFloating
    ? cn(
        "relative h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 bg-white/90 backdrop-blur-sm border border-slate-200/80 hover:bg-white hover:shadow-xl dark:border-border dark:bg-card/90 dark:hover:bg-muted dark:hover:shadow-black/30 dark:ring-offset-background",
        isOpen && "ring-2 ring-primary ring-offset-2 bg-white dark:bg-muted"
      )
    : "relative";
  const iconClassName = isFloating
    ? cn(
        "h-4 w-4 text-slate-700 transition-colors dark:text-muted-foreground",
        isOpen && "text-primary dark:text-primary"
      )
    : "h-5 w-5";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label={
            unreadCount > 0
              ? t("trigger.ariaLabelWithUnread", { count: unreadCount })
              : t("trigger.ariaLabel")
          }
        >
          <Bell className={iconClassName} />
          {unreadCount > 0 && showUnreadCount && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs animate-in zoom-in-50"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {unreadCount > 0 && !showUnreadCount && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-white animate-pulse dark:border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-2rem)] max-w-[460px] overflow-hidden rounded-xl border-border/60 bg-card/95 p-0 shadow-xl backdrop-blur sm:w-[440px] md:w-[460px] dark:border-border dark:bg-card/95 dark:shadow-black/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-slate-50/50 p-4 dark:border-border dark:bg-popover/70">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{t("header.title")}</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/15 dark:text-red-300 dark:ring-1 dark:ring-red-500/25">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markAllAsRead()}
              className="h-6 w-6 text-muted-foreground hover:bg-blue-50 hover:text-primary dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
              title={t("header.markAllRead")}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="h-[420px] max-h-[calc(100vh-10rem)]">
          <NotificationList
            isLoading={isLoading}
            notifications={notifications}
            onMarkAsRead={markAsRead}
            t={t}
            language={language}
          />
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t bg-slate-50/50 p-2 dark:border-border dark:bg-popover/70">
          <span className="pl-2 text-[10px] text-muted-foreground">
            {formatNotificationCount(notifications.length, t)}
          </span>
          <Button
            variant="ghost"
            className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground dark:hover:bg-muted/80"
            onClick={() => setOpen(false)}
          >
            {t("footer.close")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
