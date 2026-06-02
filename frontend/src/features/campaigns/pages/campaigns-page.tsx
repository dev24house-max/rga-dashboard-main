import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
    DEFAULT_WEEK_STARTS_ON,
    formatLocalDate,
    getDateRangeFromPeriod,
} from '@/lib/date-range-utils';
import type { PeriodEnum, WeekStartsOn } from '@/features/dashboard/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
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

import { CampaignsTable, SortableColumn } from '../components/campaigns-table';
import { CampaignSummary } from '../components/campaign-summary';
import { CampaignSheet } from '../components/campaign-sheet';
import { CampaignToolbar } from '../components/campaign-toolbar';
import { CampaignAnalytics } from '../components/campaign-analytics';
import { CampaignVisualization } from '../components/campaign-visualization';

import { BulkActionBar } from '../components/bulk-action-bar';
import { useDebounce } from '@/hooks/use-debounce';
import { useFileDownload } from '@/hooks/use-file-download';
import { useCampaigns } from '../hooks/use-campaigns';
import {
    useDeleteCampaign,
    useToggleCampaignStatus,
} from '../hooks/use-campaign-mutations';
import { exportService } from '@/features/dashboard/services/export-service';
import { useTranslation } from '@/i18n/use-translation';
import type { Campaign } from '../types';

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_SELECTION_LIMIT = 20;
const GLOBAL_QUERY_LIMIT = 1000;

function formatDateDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

// =============================================================================
// Helper Components
// =============================================================================

function IndeterminateProgress({ className }: { className?: string }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return <Progress value={progress} className={className} />;
}

// =============================================================================
// Main Component
// =============================================================================

export function CampaignsPage() {
    const { t } = useTranslation('campaigns');

    // ==========================================================================
    // State Management
    // ==========================================================================

    // Sheet state
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(
        null
    );
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Delete confirmation dialog state
    const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
        null
    );

    // Period filter state for time-window metrics
    const [period, setPeriod] = useState<PeriodEnum>('7d');
    const [customRange, setCustomRange] = useState<{
        from: Date;
        to: Date;
    } | null>(null);

    // Search and filter state
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<Set<string>>(new Set(['ALL']));
    const [platform, setPlatform] = useState<Set<string>>(new Set(['ALL']));
    const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>(
        DEFAULT_WEEK_STARTS_ON
    );

    // Pagination state
    const [page, setPage] = useState(1);

    // Sorting state
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    // Export loading state
    const [isExporting, setIsExporting] = useState(false);

    // Debounce search input
    const debouncedSearch = useDebounce(search, 500);

    // File download hook
    const { downloadBlob } = useFileDownload();

    // ==========================================================================
    // Reset Page on Filter Change
    // ==========================================================================
    useEffect(() => {
        setPage(1);
        // Removed: setSelectedIds(new Set()); // Allow keeping selection across filter changes
        // Removed: setShowSelectedOnly(false); // Allow keeping "Selected Only" mode
    }, [
        debouncedSearch,
        status,
        platform,
        period,
        weekStartsOn,
        sortBy,
        sortOrder,
    ]);

    // ==========================================================================
    // Auto-exit "Selected Only" Mode when selection is empty
    // ==========================================================================
    useEffect(() => {
        if (showSelectedOnly && selectedIds.size === 0) {
            setShowSelectedOnly(false);
        }
    }, [selectedIds, showSelectedOnly]);

    // ==========================================================================
    // Compute Date Range from Period or Custom Range
    // ==========================================================================
    const dateRange = useMemo(() => {
        if (period === 'custom' && customRange) {
            return {
                startDate: formatLocalDate(customRange.from),
                endDate: formatLocalDate(customRange.to),
            };
        }
        return getDateRangeFromPeriod(period, weekStartsOn);
    }, [period, customRange, weekStartsOn]);

    // Reset custom range if user switches off custom mode
    useEffect(() => {
        if (period !== 'custom') {
            setCustomRange(null);
        }
    }, [period]);

    // ==========================================================================
    // Data Fetching with All Filters
    // ==========================================================================
    // ==========================================================================
    // Data Fetching with All Filters (Paginated for Table)
    // ==========================================================================
    const {
        data: campaignsResponse,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useCampaigns({
        page: showSelectedOnly ? 1 : page,
        limit: showSelectedOnly ? 100 : DEFAULT_PAGE_SIZE, // Show all selected items (up to 100)
        // Only filter by IDs if we have selections
        ids:
            showSelectedOnly && selectedIds.size > 0
                ? Array.from(selectedIds)
                : undefined,
        search: debouncedSearch || undefined,
        status: status.has('ALL') ? undefined : Array.from(status).join(','),
        platform: platform.has('ALL')
            ? undefined
            : Array.from(platform).join(','),
        sortBy: sortBy as any,
        sortOrder,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    });

    const campaigns = campaignsResponse?.data || [];
    const summary = campaignsResponse?.summary;
    const meta = campaignsResponse?.meta;

    // ==========================================================================
    // Global Data Fetching (Unpaginated for Charts/Analytics)
    // ==========================================================================
    // Fetch all items (up to limit) that match the filters, ignoring pagination
    const { data: globalCampaignsResponse, isLoading: isGlobalLoading } =
        useCampaigns({
            page: 1,
            limit: GLOBAL_QUERY_LIMIT,
            ids: showSelectedOnly
                ? selectedIds.size > 0
                    ? Array.from(selectedIds)
                    : ['00000000-0000-0000-0000-000000000000']
                : undefined,
            search: debouncedSearch || undefined,
            status: status.has('ALL')
                ? undefined
                : Array.from(status).join(','),
            platform: platform.has('ALL')
                ? undefined
                : Array.from(platform).join(','),
            sortBy: sortBy as any,
            sortOrder,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        });

    const globalCampaigns = globalCampaignsResponse?.data || [];
    // Use global summary if available (it aggregates everything), otherwise fall back to paginated summary
    // Actually, backend usually returns summary for "matching filters" not "matching page",
    // but just to be safe and consistent with charts, we can use global summary if we wanted.
    // However, the existing 'summary' usually reflects total metrics for the QUERY, not the PAGE.
    // Let's stick with the 'summary' from the main query for the top cards as that's standard,
    // but use 'globalCampaigns' for the charts.

    // Pagination info
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.totalPages ?? 1;

    // ==========================================================================
    // Mutations
    // ==========================================================================
    const deleteMutation = useDeleteCampaign({
        onSuccess: () => {
            setDeletingCampaign(null);
            setSelectedIds(new Set()); // Clear selection after delete
        },
    });

    const toggleStatusMutation = useToggleCampaignStatus();

    // ==========================================================================
    // Filtered Campaigns for Display
    // ==========================================================================
    // Paginated list for Table
    const displayedCampaigns = campaigns;

    // Full list for Charts
    const displayedGlobalCampaigns = globalCampaigns;

    // ==========================================================================
    // Sort Handler
    // ==========================================================================
    const handleSort = useCallback(
        (column: SortableColumn) => {
            if (sortBy === column) {
                // Toggle order if clicking same column
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
                // Set new column with default desc order
                setSortBy(column);
                setSortOrder('desc');
            }
        },
        [sortBy]
    );

    // ==========================================================================
    // Selection Handlers
    // ==========================================================================
    const handleToggleSelect = useCallback(
        (id: string) => {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                    next.delete(id);
                } else {
                    if (next.size >= MAX_SELECTION_LIMIT) {
                        toast.error(t('page.toasts.selectionLimitTitle'), {
                            description: t(
                                'page.toasts.selectionLimitDescription',
                                {
                                    limit: MAX_SELECTION_LIMIT,
                                }
                            ),
                        });
                        return next;
                    }
                    next.add(id);
                }
                return next;
            });
        },
        [t]
    );

    const handleToggleAll = useCallback(
        (isChecked: boolean) => {
            if (!campaigns) return;

            setSelectedIds((prev) => {
                const next = new Set(prev);
                const currentPageIds = campaigns.map((c) => c.id);

                if (isChecked) {
                    // Limit selection to max
                    const remainingSlots = MAX_SELECTION_LIMIT - next.size;
                    if (remainingSlots <= 0) {
                        toast.error(t('page.toasts.selectionLimitTitle'), {
                            description: t(
                                'page.toasts.selectionAlreadyDescription',
                                {
                                    limit: MAX_SELECTION_LIMIT,
                                }
                            ),
                        });
                        return next;
                    }

                    const itemsToAdd = currentPageIds.slice(0, remainingSlots);
                    itemsToAdd.forEach((id) => next.add(id));

                    if (itemsToAdd.length < currentPageIds.length) {
                        toast.info(t('page.toasts.selectionCappedTitle'), {
                            description: t(
                                'page.toasts.selectionCappedDescription'
                            ),
                        });
                    }
                } else {
                    // Remove all current page items (keep others)
                    currentPageIds.forEach((id) => next.delete(id));
                }
                return next;
            });
        },
        [campaigns, t]
    );

    const handleClearSelection = useCallback(() => {
        setSelectedIds(new Set());
        setShowSelectedOnly(false);
    }, []);

    // ==========================================================================
    // Bulk Action Handlers (TODO: Implement API)
    // ==========================================================================
    const handleBulkPause = useCallback(() => {
        toast.info(t('page.toasts.bulkPauseTitle'), {
            description: t('page.toasts.featureComingSoon'),
        });
        // TODO: Implement bulk pause API call
    }, [t]);

    const handleBulkEnable = useCallback(() => {
        toast.info(t('page.toasts.bulkEnableTitle'), {
            description: t('page.toasts.featureComingSoon'),
        });
        // TODO: Implement bulk enable API call
    }, [t]);

    const handleBulkDelete = useCallback(() => {
        toast.info(t('page.toasts.bulkDeleteTitle'), {
            description: t('page.toasts.featureComingSoon'),
        });
        // TODO: Implement bulk delete API call
    }, [t]);

    // ==========================================================================
    // Export Handler
    // ==========================================================================
    const handleExport = useCallback(async () => {
        setIsExporting(true);

        try {
            // Call API with current filters
            const blob = await exportService.downloadCampaignsCsv({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                status: status.has('ALL')
                    ? undefined
                    : Array.from(status).join(','),
            });

            // Generate filename with date
            const today = new Date().toISOString().split('T')[0];
            const filename = `campaigns-report-${today}.csv`;

            // Trigger download
            downloadBlob(blob, filename);

            toast.success(t('page.toasts.exportSuccessTitle'), {
                description: t('page.toasts.exportSuccessDescription', {
                    filename,
                }),
            });
        } catch (err) {
            console.error('Export failed:', err);
            toast.error(t('page.toasts.exportFailedTitle'), {
                description:
                    err instanceof Error
                        ? err.message
                        : t('page.toasts.exportFailedDescription'),
            });
        } finally {
            setIsExporting(false);
        }
    }, [dateRange, status, downloadBlob, t]);

    // ==========================================================================
    // Campaign Action Handlers
    // ==========================================================================
    const handleCreate = () => {
        setEditingCampaign(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setIsSheetOpen(true);
    };

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open);
        if (!open) {
            setTimeout(() => setEditingCampaign(null), 300);
        }
    };

    const handleView = (campaign: Campaign) => {
        // Navigate to campaign detail page
        window.location.href = `/campaigns/${campaign.id}`;
    };

    const handleDeleteClick = (campaign: Campaign) => {
        setDeletingCampaign(campaign);
    };

    const handleDeleteConfirm = () => {
        if (deletingCampaign) {
            deleteMutation.mutate(deletingCampaign.id);
        }
    };

    const handleToggleStatus = (campaign: Campaign) => {
        toggleStatusMutation.mutate({
            id: campaign.id,
            currentStatus: campaign.status,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        // Persist selection on page change (do not clear)
    };

    const handlePeriodChange = (newPeriod: PeriodEnum) => {
        setPeriod(newPeriod);
    };

    // ==========================================================================
    // Loading State
    // ==========================================================================
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col gap-6 p-4 md:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-8 w-40 mb-2" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-40" />
                            <Skeleton className="h-10 w-36" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 flex-1 max-w-sm" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    {/* Summary Skeleton */}
                    <Skeleton className="h-[200px] w-full rounded-3xl" />
                </div>
            </DashboardLayout>
        );
    }

    // ==========================================================================
    // Error State
    // ==========================================================================
    if (isError) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                    <p className="text-destructive">
                        {t('page.errors.loadCampaigns')}{' '}
                        {error?.message || t('page.errors.unknownError')}
                    </p>
                    <Button variant="outline" onClick={() => refetch()}>
                        <Loader2 className="mr-2 h-4 w-4" />
                        {t('page.errors.retry')}
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // ==========================================================================
    // Render
    // ==========================================================================
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-4 md:gap-6 relative z-10">
                {/* Page Header */}
                <div
                    data-tutorial="campaigns-header"
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('page.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('page.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Time Window Indicator */}
                <div className="flex flex-col gap-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {t('page.timeWindow.metricsFrom')}{' '}
                        <span className="font-medium">
                            {formatDateDisplay(dateRange.startDate)}
                        </span>{' '}
                        {t('page.timeWindow.to')}{' '}
                        <span className="font-medium">
                            {formatDateDisplay(dateRange.endDate)}
                        </span>
                    </div>
                    {/* Loading Bar for Refetching - Explicit Indeterminate Animation */}
                    {isFetching && !isLoading && (
                        <div className="w-full max-w-[200px] animate-in fade-in zoom-in duration-300">
                            {/* We manually override the internal style of Progress to create an infinite loading effect 
                         by using a value of null (which renders 0%) but adding a custom animation class if we could.
                         Since we can't easily modify Progress internals, we will use a self-updating value. */}
                            <IndeterminateProgress className="h-2.5 w-full bg-orange-500/20 *:data-[slot=progress-indicator]:bg-linear-to-r *:data-[slot=progress-indicator]:from-orange-500 *:data-[slot=progress-indicator]:to-amber-500" />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-muted-foreground">
                                    {t('page.timeWindow.updating')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search and Filter Toolbar */}
                <div data-tutorial="campaigns-toolbar">
                    <CampaignToolbar
                        search={search}
                        onSearchChange={setSearch}
                        status={status}
                        onStatusChange={setStatus}
                        platform={platform}
                        onPlatformChange={setPlatform}
                        isLoading={isFetching}
                        period={period}
                        onPeriodChange={setPeriod}
                        customRange={customRange ?? undefined}
                        onCustomRangeChange={setCustomRange}
                        weekStartsOn={weekStartsOn}
                        onWeekStartsOnChange={setWeekStartsOn}
                        showSelectedOnly={showSelectedOnly}
                        onShowSelectedOnlyChange={setShowSelectedOnly}
                        selectedCount={selectedIds.size}
                    />
                </div>

                {/* Bulk Action Bar (shown when items selected) */}
                <BulkActionBar
                    selectedCount={selectedIds.size}
                    onClearSelection={handleClearSelection}
                    onPause={handleBulkPause}
                    onEnable={handleBulkEnable}
                    onDelete={handleBulkDelete}
                />

                {/* Pagination Header (Removed - Moved to Table) */}

                {/* Campaigns Table with Sorting and Selection */}
                <div data-tutorial="campaigns-table">
                    <CampaignsTable
                        campaigns={displayedCampaigns}
                        isLoading={isFetching}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleAll={handleToggleAll}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        page={showSelectedOnly ? 1 : page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={DEFAULT_PAGE_SIZE}
                        onPageChange={handlePageChange}
                    />
                </div>

                {/* Campaign Summary Dashboard (Middle Section) */}
                <div data-tutorial="campaigns-summary">
                    <CampaignSummary
                        summary={campaignsResponse?.summary}
                        isLoading={isLoading}
                    />
                </div>

                {/* Visualization Panel (Bottom) */}
                {!isLoading && campaignsResponse?.summary && (
                    <>
                        <div data-tutorial="campaigns-visualization">
                            <CampaignVisualization
                                campaigns={displayedGlobalCampaigns}
                                summary={campaignsResponse.summary}
                                onDownload={handleExport}
                            />
                        </div>

                        {/* Campaign Analytics (Conversion Rate) */}
                        <div data-tutorial="campaigns-analytics">
                            <CampaignAnalytics
                                campaigns={displayedGlobalCampaigns}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Campaign Sheet */}
            <CampaignSheet
                open={isSheetOpen}
                onOpenChange={handleSheetOpenChange}
                campaign={editingCampaign}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingCampaign}
                onOpenChange={(open) => !open && setDeletingCampaign(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('page.deleteDialog.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('page.deleteDialog.description', {
                                name: deletingCampaign?.name ?? '',
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('page.deleteDialog.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? t('page.deleteDialog.deleting')
                                : t('page.deleteDialog.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
