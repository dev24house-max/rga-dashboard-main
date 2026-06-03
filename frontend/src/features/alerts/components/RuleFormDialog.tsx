// =============================================================================
// RuleFormDialog - Create/Edit Alert Rule Modal
// =============================================================================

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { AlertRule } from '@/services/alert-service';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// Schema
// =============================================================================

type RuleFormValues = {
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    description?: string;
};

function createRuleFormSchema(t: (path: string) => string) {
    return z.object({
        name: z
            .string()
            .min(1, t('alertRules.form.validation.nameRequired'))
            .max(100, t('alertRules.form.validation.nameTooLong')),
        metric: z
            .string()
            .min(1, t('alertRules.form.validation.metricRequired')),
        operator: z
            .string()
            .min(1, t('alertRules.form.validation.operatorRequired')),
        threshold: z.coerce
            .number()
            .min(0, t('alertRules.form.validation.thresholdPositive')),
        severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
        description: z.string().optional(),
    });
}

// =============================================================================
// Options
// =============================================================================

const METRIC_OPTIONS = [
    { value: 'ctr', labelKey: 'alertRules.metricOptions.ctr' },
    { value: 'cpc', labelKey: 'alertRules.metricOptions.cpc' },
    { value: 'roas', labelKey: 'alertRules.metricOptions.roas' },
    { value: 'spend', labelKey: 'alertRules.metricOptions.spend' },
    { value: 'impressions', labelKey: 'alertRules.metricOptions.impressions' },
    { value: 'clicks', labelKey: 'alertRules.metricOptions.clicks' },
    { value: 'conversions', labelKey: 'alertRules.metricOptions.conversions' },
];

const OPERATOR_OPTIONS = [
    { value: 'gt', labelKey: 'alertRules.operators.gt' },
    { value: 'lt', labelKey: 'alertRules.operators.lt' },
    { value: 'gte', labelKey: 'alertRules.operators.gte' },
    { value: 'lte', labelKey: 'alertRules.operators.lte' },
    { value: 'eq', labelKey: 'alertRules.operators.eq' },
];

const SEVERITY_OPTIONS = [
    {
        value: 'INFO',
        labelKey: 'alertRules.severity.info',
        className: 'text-blue-600',
    },
    {
        value: 'WARNING',
        labelKey: 'alertRules.severity.warning',
        className: 'text-yellow-600',
    },
    {
        value: 'CRITICAL',
        labelKey: 'alertRules.severity.critical',
        className: 'text-red-600',
    },
];

// =============================================================================
// Props
// =============================================================================

interface RuleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rule?: AlertRule | null;
    onSubmit: (data: RuleFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function RuleFormDialog({
    open,
    onOpenChange,
    rule,
    onSubmit,
    isSubmitting = false,
}: RuleFormDialogProps) {
    const { t } = useTranslation('settings');
    const isEditing = !!rule;
    const ruleFormSchema = useMemo(() => createRuleFormSchema(t), [t]);

    const form = useForm<RuleFormValues>({
        resolver: zodResolver(ruleFormSchema) as any,
        defaultValues: {
            name: '',
            metric: 'ctr',
            operator: 'lt',
            threshold: 1,
            severity: 'WARNING',
            description: '',
        },
    });

    // Reset form when rule changes
    useEffect(() => {
        if (rule) {
            form.reset({
                name: rule.name,
                metric: rule.metric,
                operator: rule.operator,
                threshold: rule.threshold,
                severity: rule.severity,
                description: rule.description || '',
            });
        } else {
            form.reset({
                name: '',
                metric: 'ctr',
                operator: 'lt',
                threshold: 1,
                severity: 'WARNING',
                description: '',
            });
        }
    }, [rule, form]);

    const handleSubmit = async (values: RuleFormValues) => {
        await onSubmit(values);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t('alertRules.form.editTitle')
                            : t('alertRules.form.createTitle')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? t('alertRules.form.editDescription')
                            : t('alertRules.form.createDescription')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('alertRules.form.fields.name')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                'alertRules.form.placeholders.name'
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Metric & Operator Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="metric"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('alertRules.form.fields.metric')}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'alertRules.form.placeholders.metric'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {METRIC_OPTIONS.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {t(opt.labelKey)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="operator"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'alertRules.form.fields.condition'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'alertRules.form.placeholders.operator'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {OPERATOR_OPTIONS.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {t(opt.labelKey)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Threshold & Severity Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="threshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'alertRules.form.fields.threshold'
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder={t(
                                                    'alertRules.form.placeholders.threshold'
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {t(
                                                'alertRules.form.help.threshold'
                                            )}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="severity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'alertRules.form.fields.severity'
                                            )}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'alertRules.form.placeholders.severity'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {SEVERITY_OPTIONS.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className={
                                                            opt.className
                                                        }
                                                    >
                                                        {t(opt.labelKey)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t(
                                            'alertRules.form.fields.description'
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t(
                                                'alertRules.form.placeholders.description'
                                            )}
                                            className="resize-none"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                {t('alertRules.form.actions.cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEditing
                                    ? t('alertRules.form.actions.saveChanges')
                                    : t('alertRules.form.actions.createRule')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
