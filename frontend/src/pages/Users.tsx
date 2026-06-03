import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { userService } from '@/services/user-service';
import {
    Plus,
    Trash2,
    Edit2,
    Users as UsersIcon,
    ShieldCheck,
    UserCog,
    User as UserIcon,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge, type StatusVariant } from '@/components/ui/StatusBadge';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MetricGrid } from '@/features/dashboard/components/MetricGrid';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/use-translation';

import type { User } from '@/types/api';

// =============================================================================
// Types
// =============================================================================

type Role = 'ADMIN' | 'MANAGER' | 'CLIENT';

const ROLE_ORDER: Role[] = ['CLIENT', 'MANAGER', 'ADMIN'];

const ROLE_CONFIG: Record<
    Role,
    {
        labelKey: string;
        descriptionKey: string;
        icon: React.ReactNode;
        /** Classes applied to the icon wrapper */
        iconClass: string;
        /** Classes applied to the card when selected */
        selectedCardClass: string;
        /** Classes applied to the icon wrapper when selected */
        selectedIconClass: string;
    }
> = {
    CLIENT: {
        labelKey: 'roles.client.label',
        descriptionKey: 'roles.client.description',
        icon: <UserIcon className="h-4 w-4" />,
        iconClass: 'text-muted-foreground border-border',
        selectedCardClass:
            'border-blue-400 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950 dark:border-blue-700 dark:ring-blue-900',
        selectedIconClass:
            'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300',
    },
    MANAGER: {
        labelKey: 'roles.manager.label',
        descriptionKey: 'roles.manager.description',
        icon: <UserCog className="h-4 w-4" />,
        iconClass: 'text-muted-foreground border-border',
        selectedCardClass:
            'border-orange-400 bg-orange-50 ring-2 ring-orange-100 dark:bg-orange-950 dark:border-orange-600 dark:ring-orange-900',
        selectedIconClass:
            'bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-300',
    },
    ADMIN: {
        labelKey: 'roles.admin.label',
        descriptionKey: 'roles.admin.description',
        icon: <ShieldCheck className="h-4 w-4" />,
        iconClass: 'text-muted-foreground border-border',
        selectedCardClass:
            'border-red-400 bg-red-50 ring-2 ring-red-100 dark:bg-red-950 dark:border-red-700 dark:ring-red-900',
        selectedIconClass:
            'bg-red-100 border-red-200 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300',
    },
};

function normalizeRole(role?: string | null): Role | undefined {
    return ROLE_ORDER.find((value) => value === role);
}

function getRoleVariant(role?: string | null): StatusVariant {
    switch (normalizeRole(role)) {
        case 'ADMIN':
            return 'admin';
        case 'MANAGER':
            return 'manager';
        case 'CLIENT':
            return 'client';
        default:
            return 'default';
    }
}

// =============================================================================
// Role Selector Card
// =============================================================================

function RoleCard({
    role,
    selected,
    onSelect,
}: {
    role: Role;
    selected: boolean;
    onSelect: (role: Role) => void;
}) {
    const { t } = useTranslation('users');
    const config = ROLE_CONFIG[role];

    return (
        <button
            type="button"
            onClick={() => onSelect(role)}
            className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all',
                'hover:border-orange-300 hover:bg-orange-50/60 dark:hover:border-orange-700 dark:hover:bg-orange-950/40',
                selected
                    ? config.selectedCardClass
                    : 'border-border bg-background'
            )}
        >
            <span
                className={cn(
                    'rounded-md border p-1.5 transition-all',
                    selected ? config.selectedIconClass : config.iconClass
                )}
            >
                {config.icon}
            </span>
            <span className="text-sm font-semibold leading-tight">
                {t(config.labelKey)}
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
                {t(config.descriptionKey)}
            </span>
        </button>
    );
}

// =============================================================================
// Field Row helper
// =============================================================================

function FieldRow({ children }: { children: React.ReactNode }) {
    return <div className="space-y-1.5">{children}</div>;
}

function FieldLabel({
    htmlFor,
    children,
    required,
}: {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <Label
            htmlFor={htmlFor}
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
            {children}
            {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-destructive">{message}</p>;
}

// =============================================================================
// Add / Edit User Dialog
// =============================================================================

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEdit?: boolean;
    formData: typeof DEFAULT_FORM_DATA;
    formErrors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: React.MouseEventHandler<HTMLButtonElement>;
    onClose: () => void;
    onFieldChange: (field: string, value: string) => void;
}

function UserDialog({
    open,
    onOpenChange,
    isEdit = false,
    formData,
    formErrors,
    isSubmitting,
    onSubmit,
    onClose,
    onFieldChange,
}: UserDialogProps) {
    const { t } = useTranslation('users');
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!o) onClose();
            }}
        >
            <DialogContent className="sm:max-w-[460px] p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="flex flex-row items-start gap-3 border-b px-6 py-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <UserIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 space-y-0.5 pt-0.5">
                        <DialogTitle className="text-base font-semibold leading-none">
                            {isEdit
                                ? t('dialog.editTitle')
                                : t('dialog.createTitle')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {isEdit
                                ? t('dialog.editDescription')
                                : t('dialog.createDescription')}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="space-y-4 px-6 py-5">
                    {/* Email */}
                    <FieldRow>
                        <FieldLabel htmlFor="email" required>
                            {t('dialog.fields.email')}
                        </FieldLabel>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    onFieldChange('email', e.target.value)
                                }
                                placeholder={t('dialog.placeholders.email')}
                                disabled={isEdit}
                                className={cn(
                                    'pl-9 focus-visible:ring-orange-400/30 focus-visible:border-orange-400',
                                    formErrors.email && 'border-destructive'
                                )}
                            />
                        </div>
                        {isEdit && (
                            <p className="text-[11px] text-muted-foreground">
                                {t('dialog.emailLocked')}
                            </p>
                        )}
                        <FieldError message={formErrors.email} />
                    </FieldRow>

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <FieldRow>
                            <FieldLabel htmlFor="firstName" required>
                                {t('dialog.fields.firstName')}
                            </FieldLabel>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    onFieldChange('firstName', e.target.value)
                                }
                                placeholder={t('dialog.placeholders.firstName')}
                                className={cn(
                                    'focus-visible:ring-orange-400/30 focus-visible:border-orange-400',
                                    formErrors.firstName && 'border-destructive'
                                )}
                            />
                            <FieldError message={formErrors.firstName} />
                        </FieldRow>
                        <FieldRow>
                            <FieldLabel htmlFor="lastName">
                                {t('dialog.fields.lastName')}
                            </FieldLabel>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                    onFieldChange('lastName', e.target.value)
                                }
                                placeholder={t('dialog.placeholders.lastName')}
                                className={cn(
                                    'focus-visible:ring-orange-400/30 focus-visible:border-orange-400',
                                    formErrors.lastName && 'border-destructive'
                                )}
                            />
                            <FieldError message={formErrors.lastName} />
                        </FieldRow>
                    </div>

                    {/* Password */}
                    <FieldRow>
                        <FieldLabel htmlFor="password" required={!isEdit}>
                            {t('dialog.fields.password')}
                            {isEdit && (
                                <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">
                                    {t('dialog.optional')}
                                </span>
                            )}
                        </FieldLabel>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) =>
                                    onFieldChange('password', e.target.value)
                                }
                                placeholder={
                                    isEdit
                                        ? t('dialog.placeholders.passwordEdit')
                                        : t(
                                              'dialog.placeholders.passwordCreate'
                                          )
                                }
                                className={cn(
                                    'pl-9 pr-9 focus-visible:ring-orange-400/30 focus-visible:border-orange-400',
                                    formErrors.password && 'border-destructive'
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                                aria-label={
                                    showPassword
                                        ? t('dialog.aria.hidePassword')
                                        : t('dialog.aria.showPassword')
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                    <Eye className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                        <FieldError message={formErrors.password} />
                    </FieldRow>

                    {/* Role selector */}
                    <FieldRow>
                        <FieldLabel htmlFor="role" required>
                            {t('dialog.fields.role')}
                        </FieldLabel>
                        <div className="grid grid-cols-3 gap-2">
                            {ROLE_ORDER.map((role) => (
                                <RoleCard
                                    key={role}
                                    role={role}
                                    selected={formData.role === role}
                                    onSelect={(r) => onFieldChange('role', r)}
                                />
                            ))}
                        </div>
                        <FieldError message={formErrors.role} />
                    </FieldRow>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t px-6 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('dialog.actions.cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white border-0 dark:bg-orange-600 dark:hover:bg-orange-500"
                    >
                        {isSubmitting ? (
                            <LoadingSpinner text="" className="h-4 w-4 mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-1.5" />
                        )}
                        {isEdit
                            ? t('dialog.actions.saveChanges')
                            : t('dialog.actions.addUser')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// =============================================================================
// Delete Confirmation Dialog (2-step)
// =============================================================================

interface DeleteConfirmDialogProps {
    open: boolean;
    userName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

function DeleteConfirmDialog({
    open,
    userName,
    onConfirm,
    onCancel,
    isDeleting,
}: DeleteConfirmDialogProps) {
    const { t } = useTranslation('users');
    const [step, setStep] = React.useState<1 | 2>(1);
    const [confirmText, setConfirmText] = React.useState('');

    React.useEffect(() => {
        if (open) {
            setStep(1);
            setConfirmText('');
        }
    }, [open]);

    const displayName = userName || t('deleteDialog.fallbackUser');
    const confirmationWord = t('deleteDialog.confirmationWord');
    const canConfirmStep2 =
        confirmText.trim().toLowerCase() === confirmationWord;

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!o) onCancel();
            }}
        >
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="flex flex-row items-start gap-3 border-b px-6 py-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 space-y-0.5 pt-0.5">
                        <DialogTitle className="text-base font-semibold leading-none text-red-600 dark:text-red-400">
                            {t('deleteDialog.title')}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {t('deleteDialog.step', {
                                step,
                                label:
                                    step === 1
                                        ? t('deleteDialog.intentStep')
                                        : t('deleteDialog.finalStep'),
                            })}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4">
                    {step === 1 ? (
                        <>
                            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 dark:border-red-900 dark:bg-red-950/60">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                        {t('deleteDialog.warningTitle')}
                                    </p>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80">
                                        {t('deleteDialog.warningDescription')}
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-muted/40 px-4 py-3">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                    {t('deleteDialog.userToBeDeleted')}
                                </p>
                                <p className="text-sm font-semibold">
                                    {displayName}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('deleteDialog.proceed')}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3.5 dark:border-orange-900 dark:bg-orange-950/60">
                                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-700 dark:text-orange-300">
                                    {t('deleteDialog.typePrefix')}{' '}
                                    <span className="font-bold font-mono bg-orange-100 dark:bg-orange-900 px-1 py-0.5 rounded">
                                        {confirmationWord}
                                    </span>{' '}
                                    {t('deleteDialog.typeMiddle')}{' '}
                                    <span className="font-semibold">
                                        {displayName}
                                    </span>
                                    {t('deleteDialog.typeSuffix')}
                                </p>
                            </div>
                            <FieldRow>
                                <FieldLabel htmlFor="confirm-delete">
                                    {t('deleteDialog.typeLabel', {
                                        word: confirmationWord,
                                    })}
                                </FieldLabel>
                                <Input
                                    id="confirm-delete"
                                    value={confirmText}
                                    onChange={(e) =>
                                        setConfirmText(e.target.value)
                                    }
                                    placeholder={confirmationWord}
                                    autoComplete="off"
                                    className={cn(
                                        'focus-visible:ring-red-400/30 focus-visible:border-red-400',
                                        canConfirmStep2 &&
                                            'border-red-400 bg-red-50/50 dark:bg-red-950/30'
                                    )}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' &&
                                            canConfirmStep2
                                        )
                                            onConfirm();
                                    }}
                                />
                            </FieldRow>
                        </>
                    )}
                </div>

                <DialogFooter className="border-t px-6 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        {t('deleteDialog.actions.cancel')}
                    </Button>
                    {step === 1 ? (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            {t('deleteDialog.actions.continueDelete')}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={onConfirm}
                            disabled={!canConfirmStep2 || isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-40 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {isDeleting ? (
                                <LoadingSpinner
                                    text=""
                                    className="h-4 w-4 mr-2"
                                />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            {t('deleteDialog.actions.permanentlyDelete')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// =============================================================================
// Default form data
// =============================================================================

const DEFAULT_FORM_DATA = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'CLIENT',
};

// =============================================================================
// Main Page
// =============================================================================

export default function Users() {
    const { t } = useTranslation('users');
    const {
        items: users,
        meta,
        isLoading,
        isFetching,
        searchTerm,
        setSearchTerm,
        page,
        setPage,
        limit,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        isSubmitting,
        formData,
        formErrors,
        handleCreate,
        handleUpdate,
        handleDelete,
        openEditDialog,
        closeDialogs,
        handleFieldChange,
    } = useCrudOperations<User>({
        api: userService,
        entityName: 'User',
        defaultFormData: DEFAULT_FORM_DATA,
        queryKey: ['users'],
        validateForm: (data, editingItem) => {
            const errors: Record<string, string> = {};
            const isEdit = !!editingItem;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email.trim())
                errors.email = t('validation.emailRequired');
            else if (!emailRegex.test(data.email))
                errors.email = t('validation.emailInvalid');

            if (!data.firstName?.trim())
                errors.firstName = t('validation.firstNameRequired');
            else if (data.firstName.length < 2)
                errors.firstName = t('validation.firstNameMin');
            else if (data.firstName.length > 100)
                errors.firstName = t('validation.firstNameMax');

            if (data.lastName && data.lastName.length > 100)
                errors.lastName = t('validation.lastNameMax');

            if (!isEdit) {
                if (!data.password)
                    errors.password = t('validation.passwordRequired');
                else if (data.password.length < 6)
                    errors.password = t('validation.passwordMin');
            } else if (data.password && data.password.length < 6) {
                errors.password = t('validation.passwordMin');
            }

            if (!data.role) errors.role = t('validation.roleRequired');
            else if (!ROLE_ORDER.includes(data.role as Role))
                errors.role = t('validation.roleInvalid');

            return errors;
        },
    });

    const [roleFilter, setRoleFilter] = React.useState<string>('all');
    const [deleteTarget, setDeleteTarget] = React.useState<{
        id: string;
        name: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const getRoleLabel = React.useCallback(
        (role?: string | null) => {
            const normalized = normalizeRole(role);
            if (!normalized) return role ?? '';
            return t(ROLE_CONFIG[normalized].labelKey);
        },
        [t]
    );

    const filteredUsers = React.useMemo(() => {
        let result = users || [];
        if (roleFilter !== 'all') {
            result = result.filter((u) => u.role === roleFilter);
        }
        return result;
    }, [users, roleFilter]);

    const stats = React.useMemo(() => {
        const safeUsers = users || [];
        return [
            {
                title: t('metrics.totalUsers'),
                value: safeUsers.length,
                icon: <UsersIcon className="h-4 w-4" />,
                iconClassName: 'bg-blue-100 text-blue-600',
                description: t('metrics.totalDescription', {
                    total: meta?.total || 0,
                }),
            },
            {
                title: t('metrics.admins'),
                value: safeUsers.filter((u) => u.role === 'ADMIN').length,
                icon: <ShieldCheck className="h-4 w-4" />,
                iconClassName: 'bg-red-100 text-red-600',
            },
            {
                title: t('metrics.managers'),
                value: safeUsers.filter((u) => u.role === 'MANAGER').length,
                icon: <UserCog className="h-4 w-4" />,
                iconClassName: 'bg-amber-100 text-amber-600',
            },
            {
                title: t('metrics.clients'),
                value: safeUsers.filter((u) => u.role === 'CLIENT').length,
                icon: <UserIcon className="h-4 w-4" />,
                iconClassName: 'bg-green-100 text-green-600',
            },
        ];
    }, [users, meta, t]);

    const getInitials = (
        firstName?: string | null,
        lastName?: string | null
    ) => {
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
        if (!fullName) return '??';
        return fullName
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const sharedDialogProps = {
        formData,
        formErrors,
        isSubmitting,
        onClose: closeDialogs,
        onFieldChange: handleFieldChange,
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        await handleDelete(deleteTarget.id, deleteTarget.name);
        setIsDeleting(false);
        setDeleteTarget(null);
    };

    const paginationFrom = (page - 1) * limit + 1;
    const paginationTo = Math.min(page * limit, meta?.total || 0);
    const paginationTotal = meta?.total || 0;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div
                        data-tutorial="users-header"
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
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

                    <div data-tutorial="users-metrics">
                        <MetricGrid
                            metrics={stats}
                            isLoading={isLoading}
                            columns={4}
                        />
                    </div>

                    {/* Create dialog */}
                    <UserDialog
                        open={isCreateDialogOpen}
                        onOpenChange={(o) => {
                            if (!o) closeDialogs();
                        }}
                        isEdit={false}
                        onSubmit={(event) => {
                            void handleCreate(event);
                        }}
                        {...sharedDialogProps}
                    />

                    {/* Edit dialog */}
                    <UserDialog
                        open={isEditDialogOpen}
                        onOpenChange={(o) => {
                            if (!o) closeDialogs();
                        }}
                        isEdit={true}
                        onSubmit={(event) => {
                            void handleUpdate(event);
                        }}
                        {...sharedDialogProps}
                    />

                    {/* Delete confirmation dialog */}
                    <DeleteConfirmDialog
                        open={!!deleteTarget}
                        userName={deleteTarget?.name ?? ''}
                        onConfirm={handleDeleteConfirm}
                        onCancel={() => setDeleteTarget(null)}
                        isDeleting={isDeleting}
                    />

                    <Card
                        className="border-slate-200 shadow-sm"
                        data-tutorial="users-table"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    {t('table.title')}
                                    {isFetching && !isLoading && (
                                        <LoadingSpinner
                                            text=""
                                            className="h-4 w-4"
                                        />
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t('table.description')}
                                </CardDescription>
                            </div>
                            <Button
                                data-tutorial="users-add-button"
                                size="sm"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('table.addUser')}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div
                                data-tutorial="users-search-filter"
                                className="flex flex-col sm:flex-row gap-3 mb-4"
                            >
                                <div className="flex-1">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        placeholder={t(
                                            'table.searchPlaceholder'
                                        )}
                                    />
                                </div>
                                <div className="w-full sm:w-44">
                                    <Select
                                        value={roleFilter}
                                        onValueChange={setRoleFilter}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'table.filterPlaceholder'
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('table.allRoles')}
                                            </SelectItem>
                                            {ROLE_ORDER.slice()
                                                .reverse()
                                                .map((role) => (
                                                    <SelectItem
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {getRoleLabel(role)}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {isLoading ? (
                                <LoadingSpinner text="" />
                            ) : filteredUsers.length === 0 ? (
                                <EmptyState
                                    hasSearch={
                                        !!searchTerm || roleFilter !== 'all'
                                    }
                                    searchMessage={t('table.emptySearch')}
                                    emptyMessage={t('table.empty')}
                                />
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        {t(
                                                            'table.headers.name'
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'table.headers.email'
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'table.headers.role'
                                                        )}
                                                    </TableHead>
                                                    <TableHead>
                                                        {t(
                                                            'table.headers.createdAt'
                                                        )}
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        {t(
                                                            'table.headers.actions'
                                                        )}
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow
                                                        key={user.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatarUrl ||
                                                                            undefined
                                                                        }
                                                                        alt={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                                                                    />
                                                                    <AvatarFallback className="text-xs bg-muted">
                                                                        {getInitials(
                                                                            user.firstName,
                                                                            user.lastName
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span>
                                                                    {user.firstName ||
                                                                        ''}{' '}
                                                                    {user.lastName ||
                                                                        ''}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <StatusBadge
                                                                status={getRoleLabel(
                                                                    user.role
                                                                )}
                                                                variant={getRoleVariant(
                                                                    user.role
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.createdAt
                                                                ? new Date(
                                                                      user.createdAt
                                                                  ).toLocaleDateString()
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div
                                                                data-tutorial="users-actions"
                                                                className="flex justify-end gap-2"
                                                            >
                                                                <Button
                                                                    size="icon-sm"
                                                                    variant="ghost"
                                                                    aria-label={t(
                                                                        'table.aria.editUser'
                                                                    )}
                                                                    title={t(
                                                                        'table.aria.editUser'
                                                                    )}
                                                                    onClick={() =>
                                                                        openEditDialog(
                                                                            user,
                                                                            (
                                                                                u
                                                                            ) => ({
                                                                                email: u.email,
                                                                                firstName:
                                                                                    u.firstName ||
                                                                                    '',
                                                                                lastName:
                                                                                    u.lastName ||
                                                                                    '',
                                                                                password:
                                                                                    '',
                                                                                role: u.role,
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon-sm"
                                                                    variant="ghost"
                                                                    aria-label={t(
                                                                        'table.aria.deleteUser'
                                                                    )}
                                                                    title={t(
                                                                        'table.aria.deleteUser'
                                                                    )}
                                                                    onClick={() =>
                                                                        setDeleteTarget(
                                                                            {
                                                                                id: user.id,
                                                                                name:
                                                                                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                                                                    user.email,
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {t('table.pagination', {
                                                from: paginationFrom,
                                                to: paginationTo,
                                                total: paginationTotal,
                                            })}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPage((p) =>
                                                        Math.max(1, p - 1)
                                                    )
                                                }
                                                disabled={page === 1}
                                            >
                                                {t('table.previous')}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPage((p) => p + 1)
                                                }
                                                disabled={
                                                    page * limit >=
                                                    (meta?.total || 0)
                                                }
                                            >
                                                {t('table.next')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
