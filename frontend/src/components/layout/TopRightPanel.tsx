import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { BookOpen } from 'lucide-react';
import { NotificationWidget } from '@/features/notifications';
import { ContactButton } from '@/components/ui/ContactButton';
import { tutorialSteps } from '@/features/tutorial/tutorial-config';

function normalizePath(path: string) {
    const cleaned = path.split('?')[0].replace(/\/+$/u, '');
    return cleaned === '' ? '/' : cleaned;
}

function routeMatches(currentPath: string, stepPath: string) {
    const normalizedCurrent = normalizePath(currentPath);
    const normalizedStep = normalizePath(stepPath);

    if (normalizedStep === '/dashboard') {
        return normalizedCurrent === '/dashboard' || normalizedCurrent === '/';
    }

    return normalizedCurrent === normalizedStep;
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
        const step = tutorialSteps.find((item) => routeMatches(currentPath, item.path));
        return step?.path ?? null;
    }, [currentPath]);

    const handleStartPageTutorial = () => {
        if (!pagePath) return;
        window.dispatchEvent(new CustomEvent('rga-tutorial-start', { detail: { pagePath } }));
    };

    return (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
            {pagePath && (
                <button
                    type="button"
                    onClick={handleStartPageTutorial}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <BookOpen className="h-4 w-4" />
                    Page tutorial
                </button>
            )}
            <ContactButton />
            <NotificationWidget />
        </div>
    );
}
