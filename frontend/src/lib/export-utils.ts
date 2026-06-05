import domtoimage from "dom-to-image-more";
import { jsPDF } from "jspdf";

type CaptureOptions = {
  targetWidthPx?: number;
  pixelRatio?: number;
  exportTheme?: "current" | "light";
};

export interface PdfSummaryData {
  title?: string;
  subtitle?: string;
  roi?: number;
  roiDelta?: number;
  total?: number;
  totalLabel?: string;
  currency?: string;
  breakdownLabel?: string;
  metricsLabel?: string;
  breakdown?: Array<{
    name: string;
    value: number;
    formattedValue?: string;
  }>;
  summary?: Array<{
    label: string;
    value: number;
    formattedValue?: string;
    deltaLabel?: string;
  }>;
}

const LIGHT_EXPORT_CSS_VARIABLES: Record<string, string> = {
  "--primary": "var(--color-blue-700)",
  "--primary-foreground": "var(--color-blue-50)",
  "--sidebar-primary": "var(--color-blue-600)",
  "--sidebar-primary-foreground": "var(--color-blue-50)",
  "--chart-1": "var(--color-blue-300)",
  "--chart-2": "var(--color-blue-500)",
  "--chart-3": "var(--color-blue-600)",
  "--chart-4": "var(--color-blue-700)",
  "--chart-5": "var(--color-blue-800)",
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.235 0.015 65)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.235 0.015 65)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.235 0.015 65)",
  "--secondary": "oklch(0.98 0.001 286.375)",
  "--secondary-foreground": "oklch(0.4 0.015 65)",
  "--muted": "oklch(0.967 0.001 286.375)",
  "--muted-foreground": "oklch(0.552 0.016 285.938)",
  "--accent": "oklch(0.967 0.001 286.375)",
  "--accent-foreground": "oklch(0.141 0.005 285.823)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "oklch(0.985 0 0)",
  "--border": "oklch(0.92 0.004 286.32)",
  "--input": "oklch(0.92 0.004 286.32)",
  "--ring": "oklch(0.623 0.214 259.815)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.235 0.015 65)",
  "--sidebar-accent": "oklch(0.967 0.001 286.375)",
  "--sidebar-accent-foreground": "oklch(0.141 0.005 285.823)",
  "--sidebar-border": "oklch(0.92 0.004 286.32)",
  "--sidebar-ring": "oklch(0.623 0.214 259.815)",
  "--chart-empty": "#cbd5e1",
  "--theme-surface": "var(--card)",
  "--theme-surface-hover": "var(--accent)",
  "--theme-border": "var(--border)",
  "--theme-text": "var(--foreground)",
  "--theme-card-shadow": "none",
};

function setStyles(
  element: HTMLElement | SVGElement,
  styles: Partial<CSSStyleDeclaration>
) {
  Object.assign(element.style, styles);
}

function applyLightThemeForExport(element: HTMLElement) {
  element.classList.remove("dark");
  Object.entries(LIGHT_EXPORT_CSS_VARIABLES).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
}

function forceLightModeExportColors(root: HTMLElement) {
  root.querySelectorAll<SVGElement>("[data-export-light-fill]").forEach(el => {
    const fill = el.getAttribute("data-export-light-fill");
    if (!fill) return;
    el.setAttribute("fill", fill);
    el.style.setProperty("fill", fill, "important");
  });

  root.querySelectorAll<HTMLElement>("[data-export-light-bg]").forEach(el => {
    const backgroundColor = el.getAttribute("data-export-light-bg");
    if (!backgroundColor) return;
    el.style.setProperty("background-color", backgroundColor, "important");
  });
}

function removeExportExcludedElements(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>('[data-export-exclude="true"]')
    .forEach(el => el.remove());
}

function stripBorderStyles(element: HTMLElement) {
  element.style.border = "none";
  element.style.outline = "none";
  element.style.boxShadow = "none";

  const classesToRemove = Array.from(element.classList).filter(
    cls =>
      cls.startsWith("border") ||
      cls.includes("border-") ||
      cls.includes("shadow")
  );
  classesToRemove.forEach(cls => element.classList.remove(cls));

  element.querySelectorAll<HTMLElement>("*").forEach(child => {
    child.style.border = "none";
    child.style.outline = "none";
    child.style.boxShadow = "none";

    const childClassesToRemove = Array.from(child.classList).filter(
      cls =>
        cls.startsWith("border") ||
        cls.includes("border-") ||
        cls.includes("shadow")
    );
    childClassesToRemove.forEach(cls => child.classList.remove(cls));
  });
}

function removeExportTextNodes(root: HTMLElement) {
  const candidates = root.querySelectorAll<HTMLElement>("button,a,span,div,p");
  candidates.forEach(el => {
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (/^export$/i.test(text)) {
      el.remove();
    }
  });
}

function hasThaiText(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

function getSummaryLabels(summaryData?: PdfSummaryData) {
  const contextText = [
    summaryData?.title,
    summaryData?.subtitle,
    ...(summaryData?.breakdown?.map(item => item.name) ?? []),
    ...(summaryData?.summary?.map(item => item.label) ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  const lang = document.documentElement.lang || navigator.language || "";
  const isThai =
    hasThaiText(contextText) || lang.toLowerCase().startsWith("th");

  return isThai
    ? {
        summary: "\u0e2a\u0e23\u0e38\u0e1b\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23",
        roi: "ROAS",
        total: "\u0e23\u0e27\u0e21",
        breakdown:
          "\u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14",
        metrics: "\u0e15\u0e31\u0e27\u0e0a\u0e35\u0e49\u0e27\u0e31\u0e14",
      }
    : {
        summary: "Summary",
        roi: "ROAS",
        total: "Total",
        breakdown: "Breakdown",
        metrics: "Metrics",
      };
}

function formatSummaryValue(value: number, formattedValue?: string) {
  return formattedValue ?? value.toLocaleString();
}

function appendText(parent: HTMLElement, text: string) {
  const el = document.createElement("div");
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function appendReceiptDivider(parent: HTMLElement) {
  const divider = document.createElement("div");
  setStyles(divider, {
    height: "16px",
  });
  parent.appendChild(divider);
}

function appendReceiptHeading(parent: HTMLElement, text: string) {
  const heading = appendText(parent, text);
  setStyles(heading, {
    marginTop: "18px",
    marginBottom: "6px",
    color: "#111827",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  });
}

function appendReceiptRow(
  parent: HTMLElement,
  label: string,
  value: string,
  deltaLabel?: string
) {
  const row = document.createElement("div");
  setStyles(row, {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "28px",
    padding: "7px 0",
  });
  parent.appendChild(row);

  const labelEl = appendText(row, label);
  setStyles(labelEl, {
    flex: "1 1 auto",
    minWidth: "0",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "1.35",
    wordBreak: "normal",
    overflowWrap: "break-word",
  });

  const valueWrap = document.createElement("div");
  setStyles(valueWrap, {
    flex: "0 0 auto",
    minWidth: "180px",
    color: "#111827",
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1.35",
    textAlign: "right",
    whiteSpace: "nowrap",
  });
  row.appendChild(valueWrap);

  appendText(valueWrap, value);

  if (deltaLabel) {
    const delta = appendText(valueWrap, deltaLabel);
    setStyles(delta, {
      color: "#059669",
      fontSize: "12px",
      fontWeight: "600",
    });
  }
}

function createPdfSummaryDocument(summaryData?: PdfSummaryData) {
  if (!summaryData) return null;

  const labels = getSummaryLabels(summaryData);
  const section = document.createElement("section");
  section.setAttribute("data-export-pdf-summary", "true");
  setStyles(section, {
    width: "760px",
    padding: "0",
    border: "none",
    outline: "none",
    boxShadow: "none",
    background: "#ffffff",
    color: "#0f172a",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    lineHeight: "1.45",
    boxSizing: "border-box",
  });

  const title = appendText(section, summaryData.title ?? labels.summary);
  setStyles(title, {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.18",
  });

  if (summaryData.subtitle) {
    const subtitle = appendText(section, summaryData.subtitle);
    setStyles(subtitle, {
      marginTop: "8px",
      color: "#64748b",
      fontSize: "13px",
      fontWeight: "400",
      lineHeight: "1.35",
    });
  }

  appendReceiptDivider(section);

  if (summaryData.roi !== undefined) {
    appendReceiptRow(
      section,
      labels.roi,
      `${summaryData.roi.toFixed(1)}x${
        summaryData.roiDelta === undefined
          ? ""
          : ` (${summaryData.roiDelta >= 0 ? "+" : ""}${summaryData.roiDelta.toFixed(1)}%)`
      }`
    );
  }

  if (summaryData.totalLabel || summaryData.total !== undefined) {
    appendReceiptRow(
      section,
      labels.total,
      summaryData.totalLabel ?? formatSummaryValue(summaryData.total ?? 0)
    );
  }

  const breakdownRows =
    summaryData.breakdown?.map(item => ({
      label: item.name,
      value: formatSummaryValue(item.value, item.formattedValue),
    })) ?? [];

  if (breakdownRows.length > 0) {
    appendReceiptHeading(
      section,
      summaryData.breakdownLabel ?? labels.breakdown
    );
    breakdownRows.forEach(item =>
      appendReceiptRow(section, item.label, item.value)
    );
  }

  const metricRows =
    summaryData.summary?.map(item => ({
      label: item.label,
      value: formatSummaryValue(item.value, item.formattedValue),
      deltaLabel: item.deltaLabel,
    })) ?? [];

  if (metricRows.length > 0) {
    appendReceiptHeading(section, summaryData.metricsLabel ?? labels.metrics);
    metricRows.forEach(item =>
      appendReceiptRow(section, item.label, item.value, item.deltaLabel)
    );
  }

  appendReceiptDivider(section);
  return section;
}

async function captureElementAsPng(
  element: HTMLElement,
  options: CaptureOptions = {}
) {
  const clone = element.cloneNode(true) as HTMLElement;
  removeExportExcludedElements(clone);
  stripBorderStyles(clone);
  removeExportTextNodes(clone);

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.pointerEvents = "none";
  container.style.opacity = "0";
  container.style.background = "#ffffff";
  container.style.overflow = "hidden";

  const rect = element.getBoundingClientRect();
  const forcedWidth =
    options.targetWidthPx ?? Math.max(1, Math.round(rect.width));
  clone.style.width = `${forcedWidth}px`;
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";

  if (options.exportTheme === "light") {
    applyLightThemeForExport(container);
    applyLightThemeForExport(clone);
    clone.querySelectorAll<HTMLElement>(".dark").forEach(child => {
      child.classList.remove("dark");
    });
    forceLightModeExportColors(clone);
  }

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const width = Math.max(
      1,
      Math.round(clone.scrollWidth || clone.getBoundingClientRect().width)
    );
    const height = Math.max(
      1,
      Math.round(clone.scrollHeight || clone.getBoundingClientRect().height)
    );
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    return await domtoimage.toPng(clone, {
      bgcolor: "#ffffff",
      cacheBust: true,
      pixelRatio: options.pixelRatio ?? 2,
      quality: 1.0,
      style: {
        transform: "none",
        transformOrigin: "top left",
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

async function captureDetachedElementAsPng(
  element: HTMLElement,
  pixelRatio = 2
) {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.pointerEvents = "none";
  container.style.background = "#ffffff";
  container.style.overflow = "hidden";

  applyLightThemeForExport(container);
  applyLightThemeForExport(element);
  stripBorderStyles(element);

  container.appendChild(element);
  document.body.appendChild(container);

  try {
    const width = Math.max(
      1,
      Math.round(element.scrollWidth || element.getBoundingClientRect().width)
    );
    const height = Math.max(
      1,
      Math.round(element.scrollHeight || element.getBoundingClientRect().height)
    );
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    return await domtoimage.toPng(element, {
      bgcolor: "#ffffff",
      cacheBust: true,
      pixelRatio,
      quality: 1.0,
      style: {
        transform: "none",
        transformOrigin: "top left",
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

async function loadImage(dataUrl: string) {
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });
  return img;
}

const PDF_MARGIN_MM = 12;
const PDF_GAP_MM = 10;

function getFittedImageSize(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
) {
  const aspectRatio = img.naturalHeight / img.naturalWidth;
  let width = maxWidth;
  let height = width * aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height / aspectRatio;
  }

  return { width, height };
}

function addImageCenteredOnPage(
  pdf: jsPDF,
  dataUrl: string,
  img: HTMLImageElement,
  y: number,
  maxWidth: number,
  maxHeight: number
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const size = getFittedImageSize(img, maxWidth, maxHeight);
  const x = (pageWidth - size.width) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, size.width, size.height);
  return size;
}

function addImageToA4Pdf(dataUrl: string, img: HTMLImageElement) {
  const pdf = new jsPDF({
    orientation:
      img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PDF_MARGIN_MM * 2;
  const maxHeight = pageHeight - PDF_MARGIN_MM * 2;
  const size = getFittedImageSize(img, maxWidth, maxHeight);
  const x = (pageWidth - size.width) / 2;
  const y = (pageHeight - size.height) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, size.width, size.height);
  return pdf;
}

function addReportImagesToA4Pdf(
  chartDataUrl: string,
  chartImg: HTMLImageElement,
  summaryDataUrl: string,
  summaryImg: HTMLImageElement
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PDF_MARGIN_MM * 2;
  const maxHeight = pageHeight - PDF_MARGIN_MM * 2;

  const chartSize = addImageCenteredOnPage(
    pdf,
    chartDataUrl,
    chartImg,
    PDF_MARGIN_MM,
    maxWidth,
    maxHeight
  );

  const summarySize = getFittedImageSize(summaryImg, maxWidth, maxHeight);
  let summaryY = PDF_MARGIN_MM + chartSize.height + PDF_GAP_MM;

  if (summaryY + summarySize.height > pageHeight - PDF_MARGIN_MM) {
    pdf.addPage("a4", "portrait");
    summaryY = PDF_MARGIN_MM;
  }

  addImageCenteredOnPage(
    pdf,
    summaryDataUrl,
    summaryImg,
    summaryY,
    maxWidth,
    maxHeight
  );

  return pdf;
}

export async function exportToImage(element: HTMLElement, filename: string) {
  try {
    const dataUrl = await captureElementAsPng(element, {
      exportTheme: "light",
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export to image failed:", error);
    throw error;
  }
}

export async function exportToPdf(element: HTMLElement, filename: string) {
  try {
    const dataUrl = await captureElementAsPng(element, {
      exportTheme: "light",
    });
    const img = await loadImage(dataUrl);
    const pdf = addImageToA4Pdf(dataUrl, img);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Export to PDF failed:", error);
    throw error;
  }
}

export async function exportToPdfWithSummary(
  element: HTMLElement,
  filename: string,
  summaryData?: PdfSummaryData
) {
  try {
    const dataUrl = await captureElementAsPng(element, {
      exportTheme: "light",
    });
    const img = await loadImage(dataUrl);
    if (!summaryData) {
      const pdf = addImageToA4Pdf(dataUrl, img);
      pdf.save(`${filename}.pdf`);
      return;
    }

    const summaryElement = createPdfSummaryDocument(summaryData);
    if (!summaryElement) {
      const pdf = addImageToA4Pdf(dataUrl, img);
      pdf.save(`${filename}.pdf`);
      return;
    }

    const summaryDataUrl = await captureDetachedElementAsPng(summaryElement);
    const summaryImg = await loadImage(summaryDataUrl);
    const pdf = addReportImagesToA4Pdf(
      dataUrl,
      img,
      summaryDataUrl,
      summaryImg
    );

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Export to PDF with summary failed:", error);
    throw error;
  }
}
