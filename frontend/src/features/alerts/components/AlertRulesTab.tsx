// =============================================================================
// AlertRulesTab - Watchdog Rules Management Interface
// =============================================================================

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { alertService } from '@/services/alert-service';
import { useAuthStore, selectUser } from '@/stores/auth-store';
import type { AlertRule } from '@/services/alert-service';
import {
    Plus,
    Pencil,
    Trash2,
    ShieldAlert,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RuleFormDialog } from './RuleFormDialog';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// Constants
// =============================================================================

const OPERATOR_LABELS: Record<string, string> = {
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
    eq: '=',
};

const METRIC_LABEL_KEYS: Record<string, string> = {
    ctr: 'alertRules.metrics.ctr',
    cpc: 'alertRules.metrics.cpc',
    roas: 'alertRules.metrics.roas',
    spend: 'alertRules.metrics.spend',
    impressions: 'alertRules.metrics.impressions',
    clicks: 'alertRules.metrics.clicks',
    conversions: 'alertRules.metrics.conversions',
};

const SEVERITY_CONFIG: Record<string, { labelKey: string; className: string }> =
    {
        CRITICAL: {
            labelKey: 'alertRules.severity.critical',
            className: 'bg-red-100 text-red-700 border-red-200',
        },
        WARNING: {
            labelKey: 'alertRules.severity.warning',
            className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        },
        INFO: {
            labelKey: 'alertRules.severity.info',
            className: 'bg-blue-100 text-blue-700 border-blue-200',
        },
    };

// =============================================================================
// Helper Functions
// =============================================================================

function formatCondition(
    metric: string,
    operator: string,
    threshold: number | string,
    t: (path: string) => string
): string {
    const metricLabel = METRIC_LABEL_KEYS[metric]
        ? t(METRIC_LABEL_KEYS[metric])
        : metric.toUpperCase();
    const opLabel = OPERATOR_LABELS[operator] || operator;
    const value = Number(threshold);

    let formattedThreshold: string;
    if (metric === 'ctr' || metric === 'roas') {
        formattedThreshold = value.toFixed(2);
        if (metric === 'ctr') formattedThreshold += '%';
    } else if (metric === 'spend' || metric === 'cpc') {
        formattedThreshold = `$${value.toFixed(2)}`;
    } else {
        formattedThreshold = value.toLocaleString();
    }

    return `${metricLabel} ${opLabel} ${formattedThreshold}`;
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                    <Skeleton className="h-5 w-10" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20 ml-auto" />
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// Empty State
// =============================================================================

function EmptyState({ onAddRule }: { onAddRule: () => void }) {
    const { t } = useTranslation('settings');

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
                {t('alertRules.empty.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {t('alertRules.empty.description')}
            </p>
            <Button onClick={onAddRule}>
                <Plus className="h-4 w-4 mr-2" />
                {t('alertRules.empty.createRule')}
            </Button>
        </div>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export function AlertRulesTab() {
    const { t } = useTranslation('settings');
    const queryClient = useQueryClient();
    const user = useAuthStore(selectUser);
    const tenantId = user?.tenantId;

    // Dialog states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
    const [deletingRule, setDeletingRule] = useState<AlertRule | null>(null);

    // =========================================================================
    // Queries
    // =========================================================================

    const {
        data: rules = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['alert-rules', tenantId],
        queryFn: async () => {
            const response = await alertService.getRules();
            return response.data as AlertRule[];
        },
    });

    // =========================================================================
    // Mutations
    // =========================================================================

    const createMutation = useMutation({
        mutationFn: (data: Parameters<typeof alertService.createRule>[0]) =>
            alertService.createRule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['alert-rules', tenantId],
            });
            setIsFormOpen(false);
            toast.success(t('alertRules.toasts.created'), {
                description: t('alertRules.toasts.createdDescription'),
            });
        },
        onError: (error) => {
            toast.error(t('alertRules.toasts.createFailed'), {
                description:
                    error instanceof Error
                        ? error.message
                        : t('alertRules.toasts.unknownError'),
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AlertRule> }) =>
            alertService.updateRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['alert-rules', tenantId],
            });
            setIsFormOpen(false);
            setEditingRule(null);
            toast.success(t('alertRules.toasts.updated'), {
                description: t('alertRules.toasts.updatedDescription'),
            });
        },
        onError: (error) => {
            toast.error(t('alertRules.toasts.updateFailed'), {
                description:
                    error instanceof Error
                        ? error.message
                        : t('alertRules.toasts.unknownError'),
            });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (id: string) => alertService.toggleRule(id),
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ['alert-rules', tenantId],
            });

            // Snapshot previous value
            const previousRules = queryClient.getQueryData<AlertRule[]>([
                'alert-rules',
                tenantId,
            ]);

            // Optimistically update
            queryClient.setQueryData<AlertRule[]>(
                ['alert-rules', tenantId],
                (old) =>
                    old?.map((rule) =>
                        rule.id === id
                            ? { ...rule, isActive: !rule.isActive }
                            : rule
                    )
            );

            return { previousRules };
        },
        onError: (err, id, context) => {
            // Rollback on error
            queryClient.setQueryData(
                ['alert-rules', tenantId],
                context?.previousRules
            );
            toast.error(t('alertRules.toasts.toggleFailed'));
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['alert-rules', tenantId],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => alertService.deleteRule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['alert-rules', tenantId],
            });
            setDeletingRule(null);
            toast.success(t('alertRules.toasts.deleted'), {
                description: t('alertRules.toasts.deletedDescription'),
            });
        },
        onError: (error) => {
            toast.error(t('alertRules.toasts.deleteFailed'), {
                description:
                    error instanceof Error
                        ? error.message
                        : t('alertRules.toasts.unknownError'),
            });
        },
    });

    // =========================================================================
    // Handlers
    // =========================================================================

    const handleAddRule = () => {
        setEditingRule(null);
        setIsFormOpen(true);
    };

    const handleEditRule = (rule: AlertRule) => {
        setEditingRule(rule);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: {
        name: string;
        metric: string;
        operator: string;
        threshold: number;
        severity: 'INFO' | 'WARNING' | 'CRITICAL';
        description?: string;
    }) => {
        if (editingRule) {
            await updateMutation.mutateAsync({ id: editingRule.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleDeleteConfirm = () => {
        if (deletingRule) {
            deleteMutation.mutate(deletingRule.id);
        }
    };

    // =========================================================================
    // Render
    // =========================================================================

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        {t('alertRules.header.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('alertRules.header.description')}
                    </CardDescription>
                </div>
                <Button onClick={handleAddRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('alertRules.header.addRule')}
                </Button>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <TableSkeleton />
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-8 text-destructive">
                        <AlertTriangle className="h-8 w-8 mb-2" />
                        <p>{t('alertRules.status.loadFailed')}</p>
                    </div>
                ) : rules.length === 0 ? (
                    <EmptyState onAddRule={handleAddRule} />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">
                                    {t('alertRules.table.active')}
                                </TableHead>
                                <TableHead>
                                    {t('alertRules.table.name')}
                                </TableHead>
                                <TableHead>
                                    {t('alertRules.table.condition')}
                                </TableHead>
                                <TableHead>
                                    {t('alertRules.table.severity')}
                                </TableHead>
                                <TableHead>
                                    {t('alertRules.table.type')}
                                </TableHead>
                                <TableHead className="text-right">
                                    {t('alertRules.table.actions')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => {
                                const severityConfig =
                                    SEVERITY_CONFIG[rule.severity];
                                const isPreset = rule.type === 'PRESET';

                                return (
                                    <TableRow key={rule.id}>
                                        <TableCell>
                                            <Switch
                                                checked={rule.isActive}
                                                onCheckedChange={() =>
                                                    toggleMutation.mutate(
                                                        rule.id
                                                    )
                                                }
                                                disabled={
                                                    toggleMutation.isPending
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {rule.name}
                                            {rule.description && (
                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {rule.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-2 py-1 rounded">
                                                {formatCondition(
                                                    rule.metric,
                                                    rule.operator,
                                                    rule.threshold,
                                                    t
                                                )}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'font-medium',
                                                    severityConfig?.className
                                                )}
                                            >
                                                {severityConfig
                                                    ? t(severityConfig.labelKey)
                                                    : rule.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    isPreset
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                            >
                                                {isPreset
                                                    ? t(
                                                          'alertRules.types.preset'
                                                      )
                                                    : t(
                                                          'alertRules.types.custom'
                                                      )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEditRule(rule)
                                                    }
                                                    disabled={isPreset}
                                                    title={
                                                        isPreset
                                                            ? t(
                                                                  'alertRules.tooltips.presetEdit'
                                                              )
                                                            : t(
                                                                  'alertRules.tooltips.edit'
                                                              )
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeletingRule(rule)
                                                    }
                                                    disabled={isPreset}
                                                    title={
                                                        isPreset
                                                            ? t(
                                                                  'alertRules.tooltips.presetDelete'
                                                              )
                                                            : t(
                                                                  'alertRules.tooltips.delete'
                                                              )
                                                    }
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Form Dialog */}
            <RuleFormDialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingRule(null);
                }}
                rule={editingRule}
                onSubmit={handleFormSubmit}
                isSubmitting={
                    createMutation.isPending || updateMutation.isPending
                }
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingRule}
                onOpenChange={(open) => !open && setDeletingRule(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('alertRules.deleteDialog.title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('alertRules.deleteDialog.description', {
                                name: deletingRule?.name ?? '',
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('alertRules.deleteDialog.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t('alertRules.deleteDialog.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
