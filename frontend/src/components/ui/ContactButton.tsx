import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const FACEBOOK_URL = 'https://www.facebook.com/risegroupasia';

export function ContactButton() {
    return (
        <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group inline-flex items-center justify-center h-10 w-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40",
                "bg-white/90 backdrop-blur-sm border border-slate-200/80",
                "hover:bg-white hover:shadow-xl",
                "dark:border-border dark:bg-card/90 dark:hover:bg-muted dark:hover:shadow-black/30"
            )}
            title="Contact Support"
        >
            <Mail className="h-4 w-4 text-slate-700 transition-colors dark:text-muted-foreground dark:group-hover:text-foreground" />
        </a>
    );
}
