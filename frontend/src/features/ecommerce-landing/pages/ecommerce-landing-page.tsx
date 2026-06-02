import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, CheckCircle2, Sparkles } from 'lucide-react';
import { useFormatter } from '@/hooks/use-formatter';
import { HeroSection } from '../components/hero-section';
import { TestimonialsSection } from '../components/testimonials-section';

import { FooterSection } from '../components/footer-section';
import { useTranslation } from '@/i18n/use-translation';

// Define Plan Type
type Plan = {
    id: string;
    nameKey: string;
    price: number;
    descriptionKey: string;
    featureKeys: string[];
    highlight?: boolean;
    buttonTextKey: string;
};

const PLANS: Plan[] = [
    {
        id: 'starter',
        nameKey: 'pricing.plans.starter.name',
        price: 490,
        descriptionKey: 'pricing.plans.starter.description',
        featureKeys: [
            'pricing.plans.starter.features.dashboard',
            'pricing.plans.starter.features.platforms',
            'pricing.plans.starter.features.metrics',
            'pricing.plans.starter.features.pdfReports',
            'pricing.plans.starter.features.support',
        ],
        buttonTextKey: 'pricing.plans.starter.buttonText',
        highlight: false,
    },
    {
        id: 'pro',
        nameKey: 'pricing.plans.pro.name',
        price: 990,
        descriptionKey: 'pricing.plans.pro.description',
        featureKeys: [
            'pricing.plans.pro.features.starterPlus',
            'pricing.plans.pro.features.unlimitedPlatforms',
            'pricing.plans.pro.features.campaignManagement',
            'pricing.plans.pro.features.seoAnalytics',
            'pricing.plans.pro.features.alerts',
            'pricing.plans.pro.features.csvExcelReports',
        ],
        buttonTextKey: 'pricing.plans.pro.buttonText',
        highlight: true, // Recommended
    },
    {
        id: 'enterprise',
        nameKey: 'pricing.plans.enterprise.name',
        price: 2990,
        descriptionKey: 'pricing.plans.enterprise.description',
        featureKeys: [
            'pricing.plans.enterprise.features.proPlus',
            'pricing.plans.enterprise.features.aiInsights',
            'pricing.plans.enterprise.features.trendAnalysis',
            'pricing.plans.enterprise.features.teamRoles',
            'pricing.plans.enterprise.features.prioritySupport',
            'pricing.plans.enterprise.features.onboarding',
        ],
        buttonTextKey: 'pricing.plans.enterprise.buttonText',
        highlight: false,
    },
];

export default function EcommerceLandingPage() {
    const { t } = useTranslation('ecommerce');
    const introFeatureKeys = [
        'intro.features.dashboardOverview',
        'intro.features.campaignPerformance',
        'intro.features.anomalyAlerts',
        'intro.features.exportReports',
        'intro.features.userAccess',
        'intro.features.dataSyncing',
    ];

    return (
        <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-900">
            <HeroSection />

            <section className="w-full py-20 lg:py-24">
                <div className="container px-4 mx-auto max-w-6xl space-y-24">
                    {/* Intro & Key Features */}
                    <div className="space-y-16">
                        <div className="text-center space-y-4 max-w-3xl mx-auto">
                            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-zinc-100 dark:to-zinc-300">
                                {t('intro.title')}
                            </h2>
                            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                {t('intro.badge')}
                            </div>
                            <p className="text-xl leading-8 text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                {t('intro.description')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {introFeatureKeys.map((featureKey) => (
                                <div
                                    key={featureKey}
                                    className="group flex items-start gap-4 p-6 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all duration-300"
                                >
                                    <div className="mt-1 p-2 rounded-full bg-indigo-50 dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-500/25">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="text-base font-medium text-slate-700 dark:text-zinc-300 pt-1 group-hover:text-slate-900 dark:group-hover:text-zinc-100 transition-colors">
                                        {t(featureKey)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div id="pricing" className="space-y-12 relative">
                        {/* Decorative background blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-100/50 dark:bg-indigo-500/20 blur-[100px] -z-10 rounded-full mix-blend-multiply opacity-70" />

                        <div className="text-center space-y-4">
                            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                {t('pricing.title')}
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-zinc-400">
                                {t('pricing.subtitle')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-start">
                            {PLANS.map((plan) => (
                                <PricingCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialsSection />

            <FooterSection />
        </main>
    );
}

function PricingCard({ plan }: { plan: Plan }) {
    const { formatCurrency } = useFormatter();
    const { t } = useTranslation('ecommerce');

    return (
        <Card
            className={cn(
                'flex flex-col h-full relative transition-all duration-300 rounded-2xl border-0 overflow-visible group',
                plan.highlight
                    ? 'shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-500/25 scale-105 z-10 bg-white dark:bg-zinc-800 ring-1 ring-indigo-50 dark:ring-indigo-500/30'
                    : 'shadow-lg hover:shadow-xl hover:-translate-y-2 bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm'
            )}
        >
            {/* Gradient Border for Highlighted Card */}
            {plan.highlight && (
                <div
                    className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-indigo-500 to-purple-600 p-[2px] opacity-100"
                    style={{ margin: '-2px' }}
                />
            )}
            {/* Inner White Background for Gradient Border */}
            <div
                className={cn(
                    'absolute inset-0 rounded-2xl bg-white dark:bg-zinc-800 h-full w-full -z-10',
                    plan.highlight && 'm-[1px]' // match border width
                )}
            />

            {plan.highlight && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />{' '}
                        {t('pricing.popularChoice')}
                    </span>
                </div>
            )}

            <CardHeader className="space-y-2 pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
                    {t(plan.nameKey)}
                </CardTitle>
                <div className="text-sm text-slate-500 dark:text-zinc-500 h-10 leading-snug">
                    {t(plan.descriptionKey)}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
                        {formatCurrency(plan.price)}
                    </span>
                    <span className="text-base font-medium text-slate-500 dark:text-zinc-500">
                        {t('pricing.monthly')}
                    </span>
                </div>

                <ul className="space-y-4">
                    {plan.featureKeys.map((featureKey) => (
                        <li
                            key={featureKey}
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-zinc-300"
                        >
                            <div
                                className={cn(
                                    'mt-0.5 p-0.5 rounded-full shrink-0',
                                    plan.highlight
                                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                        : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400'
                                )}
                            >
                                <Check className="h-3 w-3" />
                            </div>
                            <span className="font-medium">{t(featureKey)}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pb-8 pt-4">
                <Button
                    size="lg"
                    className={cn(
                        'w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg',
                        plan.highlight
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0'
                            : 'bg-slate-900 dark:bg-zinc-700 hover:bg-slate-800 dark:hover:bg-zinc-600 text-white border-0'
                    )}
                >
                    {t(plan.buttonTextKey)}
                </Button>
            </CardFooter>
        </Card>
    );
}
