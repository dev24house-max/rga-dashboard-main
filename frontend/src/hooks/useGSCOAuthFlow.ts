import { useState, useCallback } from 'react';
import { apiClient as api } from '@/services/api-client';
import { showApiError } from '../lib/errorHandler';
import { toast } from 'sonner';

interface UseGSCOAuthFlowProps {
    onSuccess?: () => void;
}

export function useGSCOAuthFlow({ onSuccess }: UseGSCOAuthFlowProps = {}) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [tempSites, setTempSites] = useState<any[]>([]);
    const [tempToken, setTempToken] = useState<string | null>(null);

    const startGSCFlow = useCallback(async () => {
        try {
            setIsConnecting(true);
            const response = await api.get('/auth/google/search-console/url');
            if (response.data && response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                toast.error('Failed to get authorization URL');
            }
        } catch (error) {
            showApiError(error, 'Failed to start Google Search Console connection');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const cancelFlow = useCallback(() => {
        setTempSites([]);
        setTempToken(null);
        setIsConnecting(false);
        // Clean URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, []);

    const fetchTempSites = useCallback(async (token: string) => {
        try {
            setIsConnecting(true);
            const response = await api.get(`/auth/google/search-console/temp-sites?tempToken=${token}`);
            setTempSites(response.data);
            setTempToken(token);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch Search Console properties';
            if (message.includes('expired') || message.includes('invalid token')) {
                toast.error('Session expired. Please try connecting again.');
                cancelFlow();
            } else {
                showApiError(error, 'Failed to fetch Search Console properties');
            }
        } finally {
            setIsConnecting(false);
        }
    }, [cancelFlow]);

    const completeConnection = useCallback(async (siteUrl: string) => {
        if (!tempToken) return;
        if (!siteUrl) {
            toast.error('Please select a valid Search Console property before continuing.');
            return;
        }

        try {
            setIsConnecting(true);
            await api.post('/auth/google/search-console/complete', {
                tempToken,
                siteUrl,
            });

            toast.info('Connection successful! Starting background sync...', {
                duration: 5000,
                description: 'Your search console data is being imported. This may take a few minutes.'
            });

            setTempSites([]);
            setTempToken(null);

            // Clean URL parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            showApiError(error, 'Failed to complete Google Search Console connection');
        } finally {
            setIsConnecting(false);
        }
    }, [tempToken, onSuccess]);

    return {
        isConnecting,
        startGSCFlow,
        tempSites,
        fetchTempSites,
        completeConnection,
        cancelFlow,
    };
}
