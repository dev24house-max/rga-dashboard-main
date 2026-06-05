import { useRef, useState, useEffect } from "react";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatNumber } from "@/lib/formatters";
import { downloadCsv } from "@/lib/download-utils";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n/use-translation";

export interface FunnelStage {
  label: string;
  value: number;
  barClassName: string;
  dotClassName: string;
}

export interface PlatformFunnelStage {
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  color: string;
}

export interface ConversionFunnelProps {
  stages?: FunnelStage[];
  platformStages?: PlatformFunnelStage[];
  className?: string;
  title?: string;
  description?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildFunnelCsv(stages: FunnelStage[]) {
  const max = Math.max(1, ...stages.map(s => s.value));
  const rows = stages.map(s => {
    const pct = (s.value / max) * 100;
    return [s.label, String(s.value), pct.toFixed(2)].join(",");
  });

  return ["stage,value,percentage", ...rows].join("\n");
}

function formatPlatformFunnelSummary(
  platform: PlatformFunnelStage,
  labels: {
    impressions: string;
    clicks: string;
    conversions: string;
  }
) {
  return {
    label: `${platform.platform} (${labels.impressions} / ${labels.clicks} / ${labels.conversions})`,
    value: platform.impressions,
    formattedValue: `${formatNumber(platform.impressions)} / ${formatNumber(platform.clicks)} / ${formatNumber(platform.conversions)}`,
  };
}

// =============================================================================
// Info Tooltip Component
// =============================================================================

function ConversionFunnelInfoTooltip() {
  const { t } = useTranslation("dashboard");

  return (
    <TooltipProvider>
      <UiTooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm leading-relaxed">
          <p className="font-semibold mb-1">
            {t("conversionFunnel.infoTitle")}
          </p>
          <p>{t("conversionFunnel.infoDescription")}</p>
        </TooltipContent>
      </UiTooltip>
    </TooltipProvider>
  );
}

export function ConversionFunnel({
  stages = [],
  platformStages = [],
  className,
  title,
  description,
}: ConversionFunnelProps) {
  const { t } = useTranslation("dashboard");
  const displayStages = stages;
  const hasData = displayStages.length > 0;
  const hasPlatformData = platformStages.length > 0;
  const max = Math.max(1, ...displayStages.map(s => s.value));
  const resolvedTitle = title ?? t("conversionFunnel.title");
  const resolvedDescription = description ?? t("conversionFunnel.description");
  const pdfSummaryData = hasData
    ? {
        title: resolvedTitle,
        subtitle: resolvedDescription,
        breakdownLabel: resolvedTitle,
        metricsLabel: t("conversionFunnel.platformPerformance"),
        breakdown: displayStages.map(stage => ({
          name: stage.label,
          value: stage.value,
          formattedValue: formatNumber(stage.value),
        })),
        summary: hasPlatformData
          ? platformStages.map(platform =>
              formatPlatformFunnelSummary(platform, {
                impressions: t("conversionFunnel.impressionsShort"),
                clicks: t("conversionFunnel.clicks"),
                conversions: t("conversionFunnel.conversionsShort"),
              })
            )
          : undefined,
      }
    : undefined;

  const cardRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    if (cardRef.current) {
      setTargetElement(cardRef.current);
    }
  }, []);

  const handleExportCsv = () => {
    downloadCsv("conversion-funnel.csv", buildFunnelCsv(displayStages));
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "h-auto rounded-3xl border border-border shadow-lg",
        className
      )}
    >
      <CardHeader className="space-y-1 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle
                className="whitespace-nowrap text-lg font-bold leading-[1.35]"
                style={{ lineHeight: "1.35" }}
              >
                {resolvedTitle}
              </CardTitle>
              <ConversionFunnelInfoTooltip />
            </div>
            <CardDescription
              className="block leading-[1.6]"
              style={{ lineHeight: "1.6", marginTop: "0.5rem" }}
            >
              {resolvedDescription}
            </CardDescription>
          </div>

          <ExportDropdown
            filename="conversion-funnel"
            targetElement={targetElement}
            onExportCsv={hasData ? handleExportCsv : undefined}
            pdfSummaryData={pdfSummaryData}
            disabled={!hasData}
          />
        </div>
      </CardHeader>

      {hasData ? (
        <CardContent className="space-y-6">
          {/* Main Funnel Visualization */}
          <div className="space-y-4 pt-2">
            {displayStages.map((stage, index) => {
              const widthPct = clamp((stage.value / max) * 100, 0, 100);

              const nextStage = displayStages[index + 1];

              const conversionRate =
                nextStage && stage.value > 0
                  ? ((nextStage.value / stage.value) * 100).toFixed(1)
                  : null;

              return (
                <div key={stage.label}>
                  <div className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className={cn(
                        "relative h-10 overflow-hidden rounded-full shadow-sm transition-all duration-700 ease-out group-hover:shadow-lg group-hover:scale-[1.01] brightness-105",
                        stage.barClassName
                      )}
                      style={{
                        width: `${widthPct}%`,
                        minWidth: "40px",
                      }}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] mix-blend-overlay" />
                    </div>

                    <div className="flex w-full flex-col items-end text-right sm:min-w-[100px]">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {stage.label}
                      </span>
                      <span className="text-2xl font-bold tracking-tight text-foreground">
                        <span className="md:hidden">
                          {formatCompactNumber(stage.value)}
                        </span>
                        <span className="hidden md:inline">
                          {formatNumber(stage.value)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Conversion rate connector */}
                  {conversionRate && (
                    <div className="relative h-8 ml-8 my-1 flex items-center">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                        <span>{"\u2193"}</span>
                        <span className="font-medium">
                          {conversionRate}%{" "}
                          {t("conversionFunnel.conversionSuffix")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Platform Performance */}
          {hasPlatformData && (
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold mb-4 text-foreground/80">
                {t("conversionFunnel.platformPerformance")}
              </h4>

              <div className="grid gap-3 md:grid-cols-2">
                {platformStages?.map(platform => (
                  <div
                    key={platform.platform}
                    className="grid grid-cols-1 gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-all duration-200 sm:grid-cols-[minmax(120px,1fr)_auto] sm:items-center"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border shadow-sm">
                        <BrandLogo
                          platformId={platform.platform}
                          className="h-4 w-4"
                        />
                      </div>

                      <span className="truncate text-sm font-semibold">
                        {platform.platform}
                      </span>
                    </div>

                    <div className="grid w-full grid-cols-[minmax(56px,1fr)_minmax(44px,1fr)_minmax(72px,1fr)] items-start gap-3 text-sm sm:w-auto sm:min-w-[220px] sm:gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="whitespace-nowrap text-[10px] leading-none text-muted-foreground uppercase">
                          {t("conversionFunnel.impressionsShort")}
                        </span>
                        <span className="whitespace-nowrap font-medium leading-none tabular-nums">
                          <span className="md:hidden">
                            {formatCompactNumber(platform.impressions)}
                          </span>
                          <span className="hidden md:inline">
                            {formatNumber(platform.impressions)}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="whitespace-nowrap text-[10px] leading-none text-muted-foreground uppercase">
                          {t("conversionFunnel.clicks")}
                        </span>
                        <span className="whitespace-nowrap font-medium leading-none tabular-nums">
                          <span className="md:hidden">
                            {formatCompactNumber(platform.clicks)}
                          </span>
                          <span className="hidden md:inline">
                            {formatNumber(platform.clicks)}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="whitespace-nowrap text-[10px] leading-none text-muted-foreground uppercase">
                          {t("conversionFunnel.conversionsShort")}
                        </span>
                        <span className="whitespace-nowrap font-bold leading-none tabular-nums text-foreground">
                          <span className="md:hidden">
                            {formatCompactNumber(platform.conversions)}
                          </span>
                          <span className="hidden md:inline">
                            {formatNumber(platform.conversions)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="flex h-[280px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {t("conversionFunnel.noDataTitle")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("conversionFunnel.noDataDescription")}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default ConversionFunnel;
