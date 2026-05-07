/**
 * Data Sources Page
 *
 * Displays all available ad platform integrations with connect/disconnect functionality.
 * Handles OAuth callback and account selection flow.
 * Uses standardized DashboardLayout with Shadcn Sidebar.
 */

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataSourceCard } from '../components/data-source-card';
import { AccountSelectionDialog } from '../components/account-selection-dialog';
import { useIntegrationAuth } from '../hooks/use-integration-auth';
import { PLATFORM_CONFIGS, type PlatformId } from '../types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useState } from 'react';

// =============================================================================
// Info Tooltip Component
// =============================================================================

function InfoTooltip({ content }: { content: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Platforms to display (in order)
const DISPLAY_PLATFORMS: PlatformId[] = ['google', 'google-analytics', 'facebook', 'line', 'tiktok'];

export default function DataSourcesPage() {
    const {
        statuses,
        isLoadingStatuses,
        getStatus,
        handleConnect,
        handleDisconnect,
        isPending,
        accountSelectionDialog,
    } = useIntegrationAuth();

    // Disconnect confirmation state
    const [disconnectConfirm, setDisconnectConfirm] = useState<{
        isOpen: boolean;
        platform: PlatformId | null;
    }>({
        isOpen: false,
        platform: null,
    });

    const openDisconnectConfirm = (platform: PlatformId) => {
        setDisconnectConfirm({ isOpen: true, platform });
    };

    const closeDisconnectConfirm = () => {
        setDisconnectConfirm({ isOpen: false, platform: null });
    };

    const confirmDisconnect = async () => {
        if (disconnectConfirm.platform) {
            await handleDisconnect(disconnectConfirm.platform);
            closeDisconnectConfirm();
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                {/* Page Header */}
                <div data-tutorial="data-sources-header" className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Data Sources</h2>
                        <p className="text-muted-foreground">
                            Connect your advertising platforms to sync campaigns and metrics.
                        </p>
                    </div>
                </div>

                {/* Platform Cards Grid */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold sm:text-lg">Connected Platforms</h3>
                        <InfoTooltip content="Connect ad platforms to automatically import your campaigns, spending data, and performance metrics. You can manage and disconnect platforms anytime." />
                    </div>
                    <div data-tutorial="data-sources-grid" className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {DISPLAY_PLATFORMS.map((platform) => (
                        <DataSourceCard
                            key={platform}
                            platform={platform}
                            status={getStatus(platform)}
                            isLoading={isLoadingStatuses}
                            onConnect={() => handleConnect(platform)}
                            onDisconnect={() => openDisconnectConfirm(platform)}
                            isPending={isPending(platform)}
                        />
                    ))}
                </div>
                </div>
            </div>

            {/* Account Selection Dialog */}
            <AccountSelectionDialog
                isOpen={accountSelectionDialog.isOpen}
                onOpenChange={accountSelectionDialog.onOpenChange}
                accounts={accountSelectionDialog.accounts}
                onConfirm={accountSelectionDialog.onConfirm}
                isPending={accountSelectionDialog.isPending}
                platformName={
                    accountSelectionDialog.platform
                        ? PLATFORM_CONFIGS[accountSelectionDialog.platform].name
                        : 'Ad Platform'
                }
            />

            {/* Disconnect Confirmation Dialog */}
            <AlertDialog
                open={disconnectConfirm.isOpen}
                onOpenChange={(open) => {
                    if (!open) closeDisconnectConfirm();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Integration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the connection to{' '}
                            {disconnectConfirm.platform
                                ? PLATFORM_CONFIGS[disconnectConfirm.platform].name
                                : 'this platform'}
                            . Any synced data will remain, but new data will no longer be imported.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDisconnectConfirm}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDisconnect}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Disconnect
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
