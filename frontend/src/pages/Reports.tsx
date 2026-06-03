import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { dashboardService } from '@/services/dashboard-service';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';

type ExportPeriod = '1d' | '7d' | '14d' | '30d' | '90d' | '365d';
type PlatformFilter = 'ALL' | 'GOOGLE_ADS' | 'FACEBOOK' | 'TIKTOK' | 'LINE_ADS';
type StatusFilter = 'ALL' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT';

const PERIOD_OPTIONS: { value: ExportPeriod; labelKey: string }[] = [
    { value: '1d', labelKey: 'periods.1d' },
    { value: '7d', labelKey: 'periods.7d' },
    { value: '14d', labelKey: 'periods.14d' },
    { value: '30d', labelKey: 'periods.30d' },
    { value: '90d', labelKey: 'periods.90d' },
    { value: '365d', labelKey: 'periods.365d' },
];

const PLATFORM_OPTIONS: { value: PlatformFilter; labelKey: string }[] = [
    { value: 'ALL', labelKey: 'platforms.all' },
    { value: 'GOOGLE_ADS', labelKey: 'platforms.googleAds' },
    { value: 'FACEBOOK', labelKey: 'platforms.facebookAds' },
    { value: 'TIKTOK', labelKey: 'platforms.tiktokAds' },
    { value: 'LINE_ADS', labelKey: 'platforms.lineAds' },
];

const STATUS_OPTIONS: { value: StatusFilter; labelKey: string }[] = [
    { value: 'ALL', labelKey: 'statuses.all' },
    { value: 'ACTIVE', labelKey: 'statuses.active' },
    { value: 'PAUSED', labelKey: 'statuses.paused' },
    { value: 'ENDED', labelKey: 'statuses.ended' },
    { value: 'DRAFT', labelKey: 'statuses.draft' },
];

function getDateRangeFromPeriod(period: ExportPeriod): {
    startDate: string;
    endDate: string;
} {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];

    const start = new Date(today);
    switch (period) {
        case '1d':
            break;
        case '7d':
            start.setDate(start.getDate() - 6);
            break;
        case '14d':
            start.setDate(start.getDate() - 13);
            break;
        case '30d':
            start.setDate(start.getDate() - 29);
            break;
        case '90d':
            start.setDate(start.getDate() - 89);
            break;
        case '365d':
            start.setDate(start.getDate() - 364);
            break;
        default:
            break;
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate,
    };
}

export default function Reports() {
    const { t } = useTranslation('reports');

    // Filter states
    const [period, setPeriod] = useState<ExportPeriod>('7d');
    const [platform, setPlatform] = useState<PlatformFilter>('ALL');
    const [status, setStatus] = useState<StatusFilter>('ALL');

    // Loading states
    const [isExportingCSV, setIsExportingCSV] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    const getPeriodLabel = (value: ExportPeriod) => {
        const option = PERIOD_OPTIONS.find((item) => item.value === value);
        return option ? t(option.labelKey) : value;
    };

    const getPlatformLabel = (value: PlatformFilter) => {
        const option = PLATFORM_OPTIONS.find((item) => item.value === value);
        return option ? t(option.labelKey) : value;
    };

    const getCsvPlatformLabel = (value: PlatformFilter) => {
        return value === 'ALL'
            ? t('platforms.allPlatformsLower')
            : getPlatformLabel(value);
    };

    /**
     * Export campaigns to CSV
     * Endpoint: GET /dashboard/export/campaigns/csv
     */
    const handleExportCSV = async () => {
        setIsExportingCSV(true);
        try {
            const { startDate, endDate } = getDateRangeFromPeriod(period);
            const response = await dashboardService.exportCampaignsCSV(
                startDate,
                endDate,
                platform === 'ALL' ? undefined : platform,
                status === 'ALL' ? undefined : status
            );

            // Create blob and trigger download
            const blob =
                response.data instanceof Blob
                    ? response.data
                    : new Blob([response.data], {
                          type: 'text/csv;charset=utf-8',
                      });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `campaigns-${period}-${platform.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(t('toasts.csvSuccess'), {
                description: t('toasts.csvSuccessDescription', {
                    period: getPeriodLabel(period),
                    platform: getCsvPlatformLabel(platform),
                }),
            });
        } catch (error) {
            console.error('Export CSV error:', error);
            toast.error(t('toasts.csvFailed'), {
                description: t('toasts.retryDescription'),
            });
        } finally {
            setIsExportingCSV(false);
        }
    };

    /**
     * Export metrics to PDF
     * Endpoint: GET /dashboard/export/metrics/pdf
     */
    const handleExportPDF = async () => {
        setIsExportingPDF(true);
        try {
            const selectedPlatform = platform === 'ALL' ? undefined : platform;
            const response = await dashboardService.exportMetricsPDF(
                period,
                selectedPlatform
            );

            // Create blob and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const platformSlug = (selectedPlatform || 'ALL').toLowerCase();
            link.setAttribute(
                'download',
                `metrics-report-${period}-${platformSlug}-${new Date().toISOString().split('T')[0]}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(t('toasts.pdfSuccess'), {
                description: selectedPlatform
                    ? t('toasts.pdfSuccessDescriptionPlatform', {
                          period: getPeriodLabel(period),
                          platform: getPlatformLabel(selectedPlatform),
                      })
                    : t('toasts.pdfSuccessDescriptionAll', {
                          period: getPeriodLabel(period),
                      }),
            });
        } catch (error) {
            console.error('Export PDF error:', error);
            toast.error(t('toasts.pdfFailed'), {
                description: t('toasts.retryDescription'),
            });
        } finally {
            setIsExportingPDF(false);
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div data-tutorial="reports-header">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {t('page.title')}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {t('page.subtitle')}
                        </p>
                    </div>

                    {/* Filters Section */}
                    <Card data-tutorial="reports-filters">
                        <CardHeader>
                            <CardTitle className="text-base">
                                {t('filters.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('filters.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Period Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="period">
                                        {t('filters.period')}
                                    </Label>
                                    <Select
                                        value={period}
                                        onValueChange={(v) =>
                                            setPeriod(v as ExportPeriod)
                                        }
                                    >
                                        <SelectTrigger id="period">
                                            <SelectValue
                                                placeholder={t(
                                                    'filters.placeholders.period'
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PERIOD_OPTIONS.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {t(option.labelKey)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Platform Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="platform">
                                        {t('filters.platform')}
                                    </Label>
                                    <Select
                                        value={platform}
                                        onValueChange={(v) =>
                                            setPlatform(v as PlatformFilter)
                                        }
                                    >
                                        <SelectTrigger id="platform">
                                            <SelectValue
                                                placeholder={t(
                                                    'filters.placeholders.platform'
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PLATFORM_OPTIONS.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {t(option.labelKey)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        {t('filters.status')}
                                    </Label>
                                    <Select
                                        value={status}
                                        onValueChange={(v) =>
                                            setStatus(v as StatusFilter)
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue
                                                placeholder={t(
                                                    'filters.placeholders.status'
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {t(option.labelKey)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Export Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* CSV Export Card */}
                        <Card
                            data-tutorial="reports-export-csv"
                            className="border-slate-200 hover:border-slate-300 transition-colors"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {t('exportCards.csv.title')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('exportCards.csv.description')}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-600">
                                        <p>{t('exportCards.csv.includes')}</p>
                                        <ul className="list-disc list-inside mt-1 text-slate-500">
                                            <li>
                                                {t(
                                                    'exportCards.csv.items.campaignDetails'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.csv.items.performance'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.csv.items.conversion'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.csv.items.costMetrics'
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={handleExportCSV}
                                        disabled={isExportingCSV}
                                    >
                                        {isExportingCSV ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t('exportCards.csv.exporting')}
                                            </>
                                        ) : (
                                            <>
                                                <Download className="mr-2 h-4 w-4" />
                                                {t('exportCards.csv.download')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PDF Export Card */}
                        <Card
                            data-tutorial="reports-export-pdf"
                            className="border-slate-200 hover:border-slate-300 transition-colors"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <FileText className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {t('exportCards.pdf.title')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('exportCards.pdf.description')}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-600">
                                        <p>{t('exportCards.pdf.includes')}</p>
                                        <ul className="list-disc list-inside mt-1 text-slate-500">
                                            <li>
                                                {t(
                                                    'exportCards.pdf.items.summaryTable'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.pdf.items.comparison'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.pdf.items.dailyBreakdown'
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    'exportCards.pdf.items.trends'
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleExportPDF}
                                        disabled={isExportingPDF}
                                    >
                                        {isExportingPDF ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t(
                                                    'exportCards.pdf.generating'
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Download className="mr-2 h-4 w-4" />
                                                {t('exportCards.pdf.download')}
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-slate-400 text-center">
                                        {t('exportCards.pdf.periodNote', {
                                            period: getPeriodLabel(period),
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Section */}
                    <Card
                        data-tutorial="reports-info"
                        className="bg-slate-50 border-slate-200"
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-100 rounded-full">
                                    <svg
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-sm text-slate-600">
                                    <p className="font-medium text-slate-700">
                                        {t('info.title')}
                                    </p>
                                    <p className="mt-1">
                                        {t('info.description')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
