import { useMemo } from "react";
import { useLocation } from "wouter";
import { BookOpen } from "lucide-react";
import { NotificationWidget } from "@/features/notifications";
import { ContactButton } from "@/components/ui/ContactButton";
import { tutorialRegistry, resolveTutorialRoute } from "@/features/tutorial/tutorial-registry";

function normalizePath(path: string) {
  const cleaned = path.split("?")[0].replace(/\/+$/, "");
  return cleaned === "" ? "/" : cleaned;
}

/**
 * TopRightPanel - Container for top-right floating action widgets
 *
 * This component serves as a wrapper for all widgets that should appear
 * in the top-right corner of the application. Add new widgets here
 * to keep them organized in a consistent layout.
 */
export function TopRightPanel() {
  const [location] = useLocation();
  const currentPath = normalizePath(location);

  const pagePath = useMemo(() => {
    const resolved = resolveTutorialRoute(currentPath);
    return Object.keys(tutorialRegistry).find((route) => route === resolved) ?? null;
  }, [currentPath]);

  const handleStartPageTutorial = () => {
    if (!pagePath) return;
    window.dispatchEvent(
      new CustomEvent('start-tutorial', { detail: { pagePath } })
    );
  };

  return (
<div className="fixed top-4 right-4 z-50 flex items-center gap-3 sm:gap-3">
      {pagePath && (  
        <div className="group relative">
          <button
            type="button"
            aria-label="Start page tutorial"
            onClick={handleStartPageTutorial}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-border dark:bg-card/90 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
          >
            <BookOpen className="h-5 w-5" />
          </button>

          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 top-12 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:border dark:border-border dark:bg-popover dark:text-popover-foreground">
            Tutorial
          </div>
        </div>
      )}

      <ContactButton />
      <NotificationWidget />
    </div>
  );
}
