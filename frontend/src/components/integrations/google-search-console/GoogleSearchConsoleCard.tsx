import { Button } from '../../ui/button';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { toast } from 'sonner';
import { useIntegrationStatus } from '../../../hooks/useIntegrationStatus';
import { useGSCOAuthFlow } from '../../../hooks/useGSCOAuthFlow';
import { GSCSiteSelectionDialog } from './GSCSiteSelectionDialog';
import { useEffect, useMemo } from 'react';
import { useSearch } from 'wouter';
import { DataSourceCard } from '../DataSourceCard';

interface GoogleSearchConsoleCardProps {
    platform: {
        id: string;
        name: string;
        icon: any;
        color: string;
        description: string;
    };
}

export function GoogleSearchConsoleCard({ platform }: GoogleSearchConsoleCardProps) {
    const search = useSearch();
    const searchParams = useMemo(() => new URLSearchParams(search), [search]);

    const { 
        status, 
        gscAccounts, 
        disconnectGoogleSearchConsole, 
        syncGoogleSearchConsole, 
        isSyncing, 
        refetch 
    } = useIntegrationStatus();

    // Wire up OAuth flow with auto-refetch on success
    const {
        isConnecting,
        startGSCFlow,
        tempSites,
        fetchTempSites,
        completeConnection,
        cancelFlow
    } = useGSCOAuthFlow({
        onSuccess: () => {
            refetch();
        }
    });

    // Handle OAuth callback parameters
    useEffect(() => {
        const statusParam = searchParams.get('status');
        const tempTokenParam = searchParams.get('tempToken');
        const errorParam = searchParams.get('error');
        const platformParam = searchParams.get('platform');

        // Only handle if platform is google-search-console
        if (platformParam === 'google-search-console') {
            if (errorParam) {
                const errorMessage = decodeURIComponent(errorParam);
                console.error('OAuth Error:', errorMessage);
                toast.error(`Connection failed: ${errorMessage}`);

                // Clean URL
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);

            } else if (statusParam === 'select_account' && tempTokenParam) {
                fetchTempSites(tempTokenParam);
            }
        }
    }, [searchParams, fetchTempSites]);

    const isConnected = status.googleSearchConsole;
    const connectedAccount = gscAccounts && gscAccounts.length > 0 ? gscAccounts[0] : null;

    const handleDisconnect = async () => {
        if (confirm('Are you sure you want to disconnect Google Search Console?')) {
            try {
                toast.promise(disconnectGoogleSearchConsole(), {
                    loading: 'Disconnecting...',
                    success: 'Disconnected successfully',
                    error: 'Failed to disconnect'
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSync = async () => {
        try {
            await syncGoogleSearchConsole();
            toast.success('Sync completed successfully');
            await refetch();
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to sync Search Console data';
            
            if (errorMsg.includes('unauthorized_client')) {
                toast.error('Search Console authentication expired. Please disconnect and reconnect your account.');
            } else if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
                toast.error('Your Search Console connection needs to be refreshed. Please reconnect.');
            } else {
                toast.error(errorMsg);
            }
            
            console.error(error);
        }
    };

    return (
        <>
            <DataSourceCard
                name={platform.name}
                description={platform.description}
                icon={platform.icon}
                color={platform.color}
                isConnected={isConnected}
                isConnecting={isConnecting}
                isSyncing={isSyncing}
                onConnect={startGSCFlow}
                onDisconnect={handleDisconnect}
            >
                {isConnected && connectedAccount && (
                    <>
                        <div className="mt-4 space-y-3">
                            <div className="text-sm font-medium text-slate-700">Connected Property:</div>
                            <div className="p-2 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-slate-900 truncate">
                                                {connectedAccount.name}
                                            </span>
                                            <span className="text-xs text-slate-500 truncate">
                                                {connectedAccount.id}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${connectedAccount.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {connectedAccount.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.location.href = '/reports'}
                            >
                                Open Reports
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? (
                                    <LoadingSpinner size="sm" className="mr-2" />
                                ) : (
                                    'Sync Now'
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </DataSourceCard>

            <GSCSiteSelectionDialog
                isOpen={tempSites.length > 0 || (isConnecting && !isConnected)}
                isLoading={isConnecting && tempSites.length === 0}
                sites={tempSites}
                onSelect={completeConnection}
                onCancel={cancelFlow}
            />
        </>
    );
}
