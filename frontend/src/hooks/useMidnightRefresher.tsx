import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { campaignKeys } from '@/features/campaigns/hooks/use-campaigns';

/**
 * Invalidates campaign queries at the next local midnight, then every 24 hours.
 * This keeps campaign data fresh daily without manual disconnects.
 */
export default function MidnightRefresher() {
    const queryClient = useQueryClient();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        function msUntilNextMidnight() {
            const now = new Date();
            const next = new Date(now);
            next.setDate(now.getDate() + 1);
            next.setHours(0, 0, 0, 0);
            return Math.max(0, next.getTime() - now.getTime());
        }

        // schedule first invalidation at next midnight
        const timeoutId = window.setTimeout(() => {
            // Invalidate all campaign-related queries
            try {
                queryClient.invalidateQueries({ queryKey: campaignKeys.all as unknown as string[] });
            } catch (e) {
                // Fallback: invalidate by prefix
                queryClient.invalidateQueries({ predicate: (query) => String(query.queryKey[0]) === 'campaigns' });
            }

            // then repeat every 24h
            intervalRef.current = window.setInterval(() => {
                try {
                    queryClient.invalidateQueries({ queryKey: campaignKeys.all as unknown as string[] });
                } catch (e) {
                    queryClient.invalidateQueries({ predicate: (query) => String(query.queryKey[0]) === 'campaigns' });
                }
            }, 24 * 60 * 60 * 1000);
        }, msUntilNextMidnight());

        return () => {
            window.clearTimeout(timeoutId);
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [queryClient]);

    return null;
}
