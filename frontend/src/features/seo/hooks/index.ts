// SEO Hooks exports
import { useQuery } from '@tanstack/react-query';
import { SeoService } from '../api';
import { apiClient } from '@/services/api-client';

export const SEO_KEYS = {
    all: ['seo'] as const,
    summary: () => [...SEO_KEYS.all, 'summary'] as const,
    adsConnections: () => [...SEO_KEYS.all, 'ads-connections'] as const,
};

export function useSeoSummary(days?: number) {
    return useQuery({
        queryKey: [...SEO_KEYS.summary(), days],
        queryFn: () => SeoService.getSummary(days),
    });
}

export function useSeoOverview(period?: string) {
    return useQuery({
        queryKey: [...SEO_KEYS.all, 'overview', period],
        queryFn: async () => {
            const response = await apiClient.get(`/seo/overview${period ? `?period=${encodeURIComponent(period)}` : ''}`);
            return response.data;
        },
    });
}

export function useAdsConnections() {
    return useQuery({
        queryKey: SEO_KEYS.adsConnections(),
        queryFn: async () => {
            const response = await apiClient.get('/dashboard/ads-connections');
            return response.data;
        },
    });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSyncGsc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (days?: number) => SeoService.syncGsc(days),
        onSuccess: (data) => {
            if (data.success) {
                toast.success(`Successfully synced ${data.fetched} rows from Search Console`);
                queryClient.invalidateQueries({ queryKey: SEO_KEYS.all });
            } else {
                toast.error(data.message || 'Failed to sync GSC data');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error connecting to GSC API');
        }
    });
}

export function useConnectGsc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (siteUrl: string) => SeoService.connectGsc(siteUrl),
        onSuccess: (data) => {
            if (data.success) {
                toast.success(`Google Search Console connected for ${data.siteUrl}`);
                queryClient.invalidateQueries({ queryKey: SEO_KEYS.all });
            } else {
                toast.error('Failed to configure Search Console');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error connecting Search Console');
        }
    });
}
