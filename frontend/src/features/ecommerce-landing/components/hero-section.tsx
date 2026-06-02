import { Button } from '@/components/ui/button';
import { BarChart3, Cpu, Layers3 } from 'lucide-react';
import type { ReactNode } from 'react';

import { ProductStack } from './product-stack-section';
import { useTranslation } from '@/i18n/use-translation';

const HERO_PILL_KEYS = [
    'hero.pills.comprehensiveOverview',
    'hero.pills.automatedInsights',
    'hero.pills.multiUserSupport',
] as const;

const HERO_METRICS = [
    {
        labelKey: 'hero.metrics.impressions.label',
        valueKey: 'hero.metrics.impressions.value',
        tone: 'sky',
    },
    {
        labelKey: 'hero.metrics.clicks.label',
        valueKey: 'hero.metrics.clicks.value',
        tone: 'indigo',
    },
    {
        labelKey: 'hero.metrics.cost.label',
        valueKey: 'hero.metrics.cost.value',
        tone: 'fuchsia',
    },
    {
        labelKey: 'hero.metrics.conversions.label',
        valueKey: 'hero.metrics.conversions.value',
        tone: 'sky',
    },
    {
        labelKey: 'hero.metrics.ctr.label',
        valueKey: 'hero.metrics.ctr.value',
        tone: 'indigo',
    },
    {
        labelKey: 'hero.metrics.roas.label',
        valueKey: 'hero.metrics.roas.value',
        tone: 'fuchsia',
    },
] as const;

const INTEGRATION_KEYS = [
    'hero.integrations.googleAds',
    'hero.integrations.facebookAds',
    'hero.integrations.tiktokAds',
    'hero.integrations.lineAds',
    'hero.integrations.ga4',
] as const;

export function HeroSection() {
    const { t } = useTranslation('ecommerce');

    return (
        <section className="relative w-full overflow-hidden bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-slate-50 dark:via-zinc-900 to-slate-50 dark:to-zinc-900 opacity-40" />
            <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-sky-200 dark:bg-indigo-500/20 blur-3xl opacity-30 animate-blob" />
            <div className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-fuchsia-200 dark:bg-purple-500/20 blur-3xl opacity-30 animate-blob animation-delay-2000" />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-24 lg:py-28">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000 text-slate-900 dark:text-zinc-100">
                                <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 dark:from-indigo-400 dark:via-sky-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                                    {t('hero.brandName')}
                                </span>{' '}
                                {t('hero.brandSuffix')}
                            </h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-zinc-400 sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                {t('hero.description')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <Button
                                size="lg"
                                className="h-12 px-8 text-base bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-500/25 hover:shadow-indigo-300 dark:hover:shadow-indigo-500/40 transition-all duration-300"
                            >
                                {t('hero.getStarted')}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 px-8 text-base border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800/50 backdrop-blur-sm text-slate-900 dark:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                            >
                                {t('hero.viewPlans')}
                            </Button>
                        </div>

                        <div className="grid gap-4 pt-4 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                            <HeroPill
                                icon={<BarChart3 className="h-5 w-5" />}
                                label={t(HERO_PILL_KEYS[0])}
                            />
                            <HeroPill
                                icon={<Cpu className="h-5 w-5" />}
                                label={t(HERO_PILL_KEYS[1])}
                            />
                            <HeroPill
                                icon={<Layers3 className="h-5 w-5" />}
                                label={t(HERO_PILL_KEYS[2])}
                            />
                        </div>

                        <div className="rounded-3xl border border-white/60 dark:border-zinc-700 bg-white/40 dark:bg-zinc-800/50 backdrop-blur-md p-6 shadow-xl shadow-slate-100/50 dark:shadow-zinc-900/50 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
                            <div className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-4">
                                {t('hero.metricsTracked')}
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {HERO_METRICS.map((metric) => (
                                    <MetricTile
                                        key={metric.labelKey}
                                        label={t(metric.labelKey)}
                                        value={t(metric.valueKey)}
                                        tone={metric.tone}
                                    />
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100/50 dark:border-zinc-700/50">
                                <div className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-3">
                                    {t('hero.integrations.title')}
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {INTEGRATION_KEYS.map((integrationKey) => (
                                        <SourceChip key={integrationKey}>
                                            {t(integrationKey)}
                                        </SourceChip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                        <ProductStack />
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeroPill({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 dark:text-zinc-300 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400">
                {icon}
            </span>
            <span className="leading-tight font-semibold">{label}</span>
        </div>
    );
}

function MetricTile({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: 'sky' | 'indigo' | 'fuchsia';
}) {
    const toneStyles: Record<typeof tone, { dot: string; label: string }> = {
        sky: {
            dot: 'bg-sky-500 shadow-sky-200 dark:shadow-sky-400/30',
            label: 'text-sky-700 dark:text-sky-400',
        },
        indigo: {
            dot: 'bg-indigo-500 shadow-indigo-200 dark:shadow-indigo-400/30',
            label: 'text-indigo-700 dark:text-indigo-400',
        },
        fuchsia: {
            dot: 'bg-fuchsia-500 shadow-fuchsia-200 dark:shadow-fuchsia-400/30',
            label: 'text-fuchsia-700 dark:text-fuchsia-400',
        },
    };

    return (
        <div className="group rounded-2xl border border-slate-100 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/50 backdrop-blur-sm px-4 py-3 shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md dark:hover:border-zinc-600">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <span
                        className={`h-2.5 w-2.5 rounded-full shadow-sm ${toneStyles[tone].dot}`}
                    />
                    <div
                        className={`text-xs font-bold ${toneStyles[tone].label}`}
                    >
                        {label}
                    </div>
                </div>
            </div>
            <div className="mt-1.5 text-xs font-medium text-slate-500/80 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-400 transition-colors">
                {value}
            </div>
        </div>
    );
}

function SourceChip({ children }: { children: ReactNode }) {
    return (
        <div className="cursor-default rounded-full border border-slate-200 dark:border-zinc-600 bg-white/50 dark:bg-zinc-800/50 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 shadow-sm transition-colors hover:border-indigo-100 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400">
            {children}
        </div>
    );
}
