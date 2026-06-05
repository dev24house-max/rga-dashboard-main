import { useState } from 'react';
import { Download, FileImage, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    exportToImage,
    exportToPdfWithSummary,
    type PdfSummaryData,
} from '@/lib/export-utils';
import { useTranslation } from '@/i18n/use-translation';

interface ExportDropdownProps {
    /** The element to capture for Image/PDF. Pass a ref.current */
    targetElement?: HTMLElement | null;
    /** Base filename for the export */
    filename: string;
    /** Optional handler for CSV export */
    onExportCsv?: () => void;
    /** Optional structured data to render below the PDF image */
    pdfSummaryData?: PdfSummaryData;
    /** Disable all actions */
    disabled?: boolean;
}

export function ExportDropdown({
    targetElement,
    filename,
    onExportCsv,
    pdfSummaryData,
    disabled = false,
}: ExportDropdownProps) {
    const { t } = useTranslation('exportControls');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (type: 'image' | 'pdf') => {
        if (!targetElement) return;

        setIsExporting(true);
        try {
            // Small delay to ensure dropdown closes
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (type === 'image') {
                await exportToImage(targetElement, filename);
            } else if (type === 'pdf') {
                await exportToPdfWithSummary(
                    targetElement,
                    filename,
                    pdfSummaryData
                );
            }
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    data-export-exclude="true"
                    disabled={disabled || isExporting}
                >
                    {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {t('export')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    onClick={() => handleExport('image')}
                    disabled={!targetElement}
                >
                    <FileImage className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{t('saveAsImage')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleExport('pdf')}
                    disabled={!targetElement}
                >
                    <FileText className="mr-2 h-4 w-4 text-red-500" />
                    <span>{t('saveAsPdf')}</span>
                </DropdownMenuItem>
                {onExportCsv && (
                    <DropdownMenuItem onClick={onExportCsv}>
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
                        <span>{t('saveAsCsv')}</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
