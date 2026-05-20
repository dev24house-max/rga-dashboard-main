import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationButtonProps {
    isOpen: boolean;
    hasUnread: boolean;
    onClick: () => void;
}

export function NotificationButton({ isOpen, hasUnread, onClick }: NotificationButtonProps) {
    return (
        <Button
            onClick={onClick}
            size="icon"
            className={cn(
                "h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 bg-white/90 backdrop-blur-sm border border-slate-200/80 hover:bg-white hover:shadow-xl dark:border-border dark:bg-card/90 dark:hover:bg-muted dark:hover:shadow-black/30 dark:ring-offset-background",
                isOpen ? "ring-2 ring-primary ring-offset-2 bg-white dark:bg-muted" : ""
            )}
        >
            <div className="relative">
                <Bell className={cn("h-4 w-4 text-slate-700 transition-colors dark:text-muted-foreground", isOpen ? "text-primary dark:text-primary" : "")} />

                {/* Unread Badge */}
                {hasUnread && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-white animate-pulse dark:border-background" />
                )}
            </div>
        </Button>
    );
}
