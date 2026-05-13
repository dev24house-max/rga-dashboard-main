import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

type CaptureOptions = {
    /**
     * Force a fixed render width (in CSS px) for consistent layouts.
     * Useful for A4 exports to avoid responsive “narrow view” rendering.
     */
    targetWidthPx?: number;
    /** Increase resolution without changing layout size. */
    pixelRatio?: number;
};

function stripBorderStyles(element: HTMLElement) {
    element.style.border = 'none';
    element.style.outline = 'none';
    element.style.boxShadow = 'none';

    const classesToRemove = Array.from(element.classList).filter((cls) =>
        cls.startsWith('border') || cls.includes('border-') || cls.includes('shadow')
    );
    classesToRemove.forEach((cls) => element.classList.remove(cls));

    element.querySelectorAll<HTMLElement>('*').forEach((child) => {
        child.style.border = 'none';
        child.style.outline = 'none';
        child.style.boxShadow = 'none';

        const childClassesToRemove = Array.from(child.classList).filter((cls) =>
            cls.startsWith('border') || cls.includes('border-') || cls.includes('shadow')
        );
        childClassesToRemove.forEach((cls) => child.classList.remove(cls));
    });
}

function removeExportTextNodes(root: HTMLElement) {
    const candidates = root.querySelectorAll<HTMLElement>('button,a,span,div,p');
    candidates.forEach((el) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;

        // Remove standalone "Export" labels (commonly the export button).
        if (/^export$/i.test(text)) {
            el.remove();
        }
    });
}

async function captureElementAsPng(element: HTMLElement, options: CaptureOptions = {}) {
    const clone = element.cloneNode(true) as HTMLElement;
    stripBorderStyles(clone);
    removeExportTextNodes(clone);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.style.background = '#ffffff';
    container.style.overflow = 'hidden';

    // Force a stable width to prevent responsive “collapsed” rendering.
    const rect = element.getBoundingClientRect();
    const forcedWidth = options.targetWidthPx ?? Math.max(1, Math.round(rect.width));
    clone.style.width = `${forcedWidth}px`;
    clone.style.maxWidth = 'none';
    clone.style.boxSizing = 'border-box';

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
        // Ensure sizes are computed after mount and width override.
        const width = Math.max(1, Math.round(clone.scrollWidth || clone.getBoundingClientRect().width));
        const height = Math.max(1, Math.round(clone.scrollHeight || clone.getBoundingClientRect().height));
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;

        return await domtoimage.toPng(clone, {
            bgcolor: '#ffffff',
            cacheBust: true,
            pixelRatio: options.pixelRatio ?? 2,
            quality: 1.0,
            style: {
                transform: 'none',
                transformOrigin: 'top left',
                width: `${width}px`,
            },
            width,
            height,
            useCORS: true,
        });
    } finally {
        document.body.removeChild(container);
    }
}

function summarizeElementText(element: HTMLElement) {
    const rawText = element.innerText || '';
    const normalized = rawText
        .replace(/\r?\n[ \t]*/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{2,}/g, '\n\n')
        .trim();

    if (normalized) {
        return normalized;
    }

    const fallbackParts: string[] = [];
    const collect = (el: HTMLElement) => {
        const ariaLabel = el.getAttribute('aria-label');
        const title = el.getAttribute('title');
        const alt = (el as any).alt;
        if (ariaLabel) fallbackParts.push(ariaLabel.trim());
        if (title) fallbackParts.push(title.trim());
        if (alt) fallbackParts.push((alt as string).trim());
    };

    collect(element);
    element.querySelectorAll<HTMLElement>('[aria-label],[title],[alt]').forEach(collect);

    const fallbackText = fallbackParts.filter(Boolean).join(' | ').replace(/\s+/g, ' ').trim();
    return fallbackText || 'No text content available from the exported element.';
}

function buildTextSummary(text: string) {
    const cleaned = text.trim();
    if (!cleaned) {
        return ['No readable text found in the exported image.'];
    }

    const lines = cleaned
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length > 0) {
        return lines;
    }

    const sentences = cleaned
        .match(/[^.!?]+[.!?]+/g)
        ?.map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);

    if (sentences && sentences.length > 0) {
        return sentences;
    }

    return [cleaned];
}

function addTextBlock(
    pdf: jsPDF,
    content: string | string[],
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    bottomMargin: number
) {
    const paragraphs = Array.isArray(content) ? content : [content];
    let currentY = y;
    const pageHeight = pdf.internal.pageSize.getHeight();

    paragraphs.forEach((paragraph, index) => {
        const lines = paragraph ? pdf.splitTextToSize(paragraph, maxWidth) : [''];
        lines.forEach((line: string) => {
            if (currentY + lineHeight > pageHeight - bottomMargin) {
                pdf.addPage();
                currentY = 15;
            }
            pdf.text(line, x, currentY);
            currentY += lineHeight;
        });

        if (index < paragraphs.length - 1) {
            currentY += lineHeight / 2;
        }
    });

    return currentY;
}

/**
 * Export an HTML element as a PNG image
 */
export async function exportToImage(element: HTMLElement, filename: string) {
    try {
        const dataUrl = await captureElementAsPng(element);

        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Export to image failed:', error);
        throw error;
    }
}

/**
 * Export an HTML element as a PDF document
 */
export async function exportToPdf(element: HTMLElement, filename: string) {
    try {
        const dataUrl = await captureElementAsPng(element);

        const img = new Image();
        img.src = dataUrl;
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
        });

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const printWidth = pageWidth - 20;
        const printHeight = printWidth * (img.naturalHeight / img.naturalWidth);

        let renderWidth = printWidth;
        let renderHeight = printHeight;

        if (renderHeight > pageHeight - 20) {
            renderHeight = pageHeight - 20;
            renderWidth = renderHeight * (img.naturalWidth / img.naturalHeight);
        }

        pdf.addImage(dataUrl, 'PNG', 10, 10, renderWidth, renderHeight);
        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Export to PDF failed:', error);
        throw error;
    }
}

/**
 * Summary data interface for PDF export
 */
export interface PdfSummaryData {
    title?: string;
    subtitle?: string;
    roi?: number;
    roiDelta?: number;
    total?: number;
    currency?: string;
    breakdown?: Array<{ name: string; value: number }>;
    summary?: Array<{ label: string; value: number; deltaLabel?: string }>;
}

/**
 * Export an HTML element as a single-page A4 PDF:
 * - Top: Screenshot of the element
 * - Bottom: Text summary from the data
 */
export async function exportToPdfWithSummary(
    element: HTMLElement,
    filename: string,
    summaryData?: PdfSummaryData
) {
    try {
        const captureSummary = summarizeElementText(element);
        // A4 width at 96dpi ≈ 794px. Forcing this prevents “mobile layout” captures.
        const dataUrl = await captureElementAsPng(element, { targetWidthPx: 794, pixelRatio: 2 });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const leftMargin = 15;
        const rightMargin = pageWidth - 15;
        const bottomMargin = 15;
        const contentWidth = rightMargin - leftMargin;
        const hasSummaryContent = !!summaryData || !!captureSummary;

        const img = new Image();
        const imagePromise = new Promise<{ width: number; height: number }>((resolve, reject) => {
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
            };
            img.onerror = reject;
            img.src = dataUrl;
        });

        const imgDimensions = await imagePromise;
        const aspectRatio = imgDimensions.height / imgDimensions.width;

        const availableWidth = contentWidth;
        // Keep image readable on A4; let text flow to next pages if needed.
        const maxImageHeight = Math.max(
            60,
            Math.min(140, pageHeight - 15 - bottomMargin - (hasSummaryContent ? 70 : 20))
        );

        let imageWidth = availableWidth;
        let imageHeight = availableWidth * aspectRatio;

        if (imageHeight > maxImageHeight) {
            imageHeight = maxImageHeight;
            imageWidth = maxImageHeight / aspectRatio;
        }

        const imageX = leftMargin + (contentWidth - imageWidth) / 2;
        const imageTop = 15;

        pdf.addImage(dataUrl, 'PNG', imageX, imageTop, imageWidth, imageHeight);

        if (hasSummaryContent) {
            let yPosition = imageTop + imageHeight + 12;

            // Typography tuned for A4 readability and density.
            const FONT = {
                TITLE: 16,
                SECTION: 12,
                BODY: 10,
                FOOTER: 8,
            } as const;
            const LINE = {
                TITLE: 7,
                SECTION: 6,
                BODY: 5.5,
            } as const;

            pdf.setFontSize(FONT.TITLE);
            pdf.setFont('helvetica', 'bold');
            const titleText = `${summaryData?.title || 'Report Summary'}`;
            const titleLines = pdf.splitTextToSize(titleText, contentWidth);
            pdf.text(titleLines, leftMargin, yPosition);
            yPosition += titleLines.length * LINE.TITLE;

            // No divider line (clean A4 layout)
            yPosition += 4;

            // Keep the extracted text, but do not show the "Image Summary" heading.
            if (captureSummary) {
                pdf.setFontSize(FONT.BODY);
                pdf.setFont('helvetica', 'normal');

                const summaryLines = buildTextSummary(captureSummary);
                yPosition = addTextBlock(
                    pdf,
                    summaryLines,
                    leftMargin,
                    yPosition,
                    contentWidth,
                    LINE.BODY,
                    bottomMargin
                );
                yPosition += 6;
            }

            if (summaryData) {
                const headerFields: string[] = [];
                headerFields.push(`${summaryData.subtitle || 'Overview'}`);
                headerFields.push(`Currency: ${summaryData.currency || 'USD'}`);
                headerFields.push(
                    `ROI: ${summaryData.roi?.toFixed(1) ?? 'N/A'}${
                        summaryData.roiDelta !== undefined ? ` (${summaryData.roiDelta.toFixed(1)})` : ''
                    }`
                );
                headerFields.push(
                    `Total: ${summaryData.currency || 'USD'} ${((summaryData.total || 0)).toLocaleString()}`
                );

                pdf.setFontSize(FONT.BODY);
                pdf.setFont('helvetica', 'bold');
                yPosition = addTextBlock(
                    pdf,
                    headerFields,
                    leftMargin,
                    yPosition,
                    contentWidth,
                    LINE.BODY,
                    bottomMargin
                );
                yPosition += 6;

                const summaryLines: string[] = [];
                if (summaryData.breakdown && summaryData.breakdown.length > 0) {
                    summaryLines.push('BREAKDOWN');
                    summaryData.breakdown.forEach((item) => {
                        summaryLines.push(`• ${item.name}: ${summaryData.currency || 'USD'} ${item.value.toLocaleString()}`);
                    });
                    summaryLines.push('');
                }

                if (summaryData.summary && summaryData.summary.length > 0) {
                    summaryLines.push('METRICS');
                    summaryData.summary.forEach((item) => {
                        const line = `• ${item.label}: ${summaryData.currency || 'USD'} ${item.value.toLocaleString()}`;
                        summaryLines.push(item.deltaLabel ? `${line} (${item.deltaLabel})` : line);
                    });
                }

                if (summaryLines.length > 0) {
                    pdf.setFontSize(FONT.SECTION);
                    pdf.setFont('helvetica', 'bold');
                    yPosition = addTextBlock(
                        pdf,
                        'Summary Details',
                        leftMargin,
                        yPosition,
                        contentWidth,
                        LINE.SECTION,
                        bottomMargin
                    );
                    pdf.setFontSize(FONT.BODY);
                    pdf.setFont('helvetica', 'normal');
                    yPosition = addTextBlock(
                        pdf,
                        summaryLines,
                        leftMargin,
                        yPosition,
                        contentWidth,
                        LINE.BODY,
                        bottomMargin
                    );
                }
            }

            if (yPosition + 10 > pageHeight - bottomMargin) {
                pdf.addPage();
                yPosition = 15;
            }

            pdf.setFontSize(FONT.FOOTER);
            pdf.setFont('helvetica', 'italic');
            pdf.text(
                `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                leftMargin,
                pageHeight - 8
            );
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Export to PDF with summary failed:', error);
        throw error;
    }
}
