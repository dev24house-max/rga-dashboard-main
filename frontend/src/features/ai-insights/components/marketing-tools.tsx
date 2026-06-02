import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormatter } from '@/hooks/use-formatter';
import {
    Calculator,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/i18n/use-translation';

interface MarketingToolsProps {
    onBack?: () => void;
}

export function MarketingTools({ onBack }: MarketingToolsProps) {
    const { t } = useTranslation('aiInsights');
    const [activeTab, setActiveTab] = useState('conversion');

    // State for calculators
    const [conversion, setConversion] = useState({
        actions: '',
        visitors: '',
        result: 0,
    });
    const [roi, setRoi] = useState({ revenue: '', cost: '', result: 0 });
    const [cpl, setCpl] = useState({ cost: '', leads: '', result: 0 });
    const [leads, setLeads] = useState({
        traffic: '',
        conversionRate: '',
        result: 0,
    });
    const [cpa, setCpa] = useState({ cost: '', customers: '', result: 0 });
    const [profit, setProfit] = useState({ revenue: '', cost: '', result: 0 });

    // Calculation Handlers
    const calculateConversion = (key: string, value: string) => {
        const newData = { ...conversion, [key]: value };
        setConversion(newData);
        const actions = parseFloat(newData.actions) || 0;
        const visitors = parseFloat(newData.visitors) || 0;
        const result = visitors > 0 ? (actions / visitors) * 100 : 0;
        setConversion((prev) => ({
            ...prev,
            result: parseFloat(result.toFixed(2)),
        }));
    };

    const calculateRoi = (key: string, value: string) => {
        const newData = { ...roi, [key]: value };
        setRoi(newData);
        const revenue = parseFloat(newData.revenue) || 0;
        const cost = parseFloat(newData.cost) || 0;
        const result = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
        setRoi((prev) => ({ ...prev, result: parseFloat(result.toFixed(2)) }));
    };

    const calculateCpl = (key: string, value: string) => {
        const newData = { ...cpl, [key]: value };
        setCpl(newData);
        const cost = parseFloat(newData.cost) || 0;
        const leadsCount = parseFloat(newData.leads) || 0;
        const result = leadsCount > 0 ? cost / leadsCount : 0;
        setCpl((prev) => ({ ...prev, result: parseFloat(result.toFixed(2)) }));
    };

    const calculateLeads = (key: string, value: string) => {
        const newData = { ...leads, [key]: value };
        setLeads(newData);
        const traffic = parseFloat(newData.traffic) || 0;
        const rate = parseFloat(newData.conversionRate) || 0;
        const result = (traffic * rate) / 100;
        setLeads((prev) => ({ ...prev, result: Math.round(result) }));
    };

    const calculateCpa = (key: string, value: string) => {
        const newData = { ...cpa, [key]: value };
        setCpa(newData);
        const cost = parseFloat(newData.cost) || 0;
        const customers = parseFloat(newData.customers) || 0;
        const result = customers > 0 ? cost / customers : 0;
        setCpa((prev) => ({ ...prev, result: parseFloat(result.toFixed(2)) }));
    };

    const calculateProfit = (key: string, value: string) => {
        const newData = { ...profit, [key]: value };
        setProfit(newData);
        const revenue = parseFloat(newData.revenue) || 0;
        const cost = parseFloat(newData.cost) || 0;
        const result = revenue - cost;
        setProfit((prev) => ({
            ...prev,
            result: parseFloat(result.toFixed(2)),
        }));
    };

    const { currencyCode, formatCurrency } = useFormatter();

    const tabs = [
        { id: 'conversion', label: t('tools.tabs.conversion'), icon: Target },
        { id: 'lead', label: t('tools.tabs.lead'), icon: Users },
        { id: 'roi', label: t('tools.tabs.roi'), icon: TrendingUp },
        { id: 'profit', label: t('tools.tabs.profit'), icon: DollarSign },
        { id: 'cpl', label: t('tools.tabs.cpl'), icon: DollarSign },
        { id: 'cpa', label: t('tools.tabs.cpa'), icon: Calculator },
    ];

    return (
        <div className="flex flex-col items-center w-full h-full min-w-0 overflow-x-hidden overflow-y-auto custom-scrollbar pb-12 gap-4 sm:gap-8 relative">
            {onBack && (
                <div className="min-h-12 sm:min-h-14 w-full shrink-0 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 py-2 bg-white/80 backdrop-blur relative z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="group flex h-10 w-10 sm:w-auto items-center justify-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-full sm:rounded-xl shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200 sm:px-4 sm:py-2"
                        >
                            <div className="p-1 sm:p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                            </div>
                            <span className="hidden sm:inline text-xs sm:text-sm font-bold text-slate-700 group-hover:text-slate-900">
                                {t('tools.backToAssistant')}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex shrink-0 flex-col items-center text-center space-y-2 sm:space-y-3 max-w-2xl px-4 pt-6 sm:pt-10"
            >
                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl mb-1 sm:mb-2">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {t('tools.title')}
                </h2>
                <p className="text-slate-500 text-xs sm:text-base max-w-lg leading-5 sm:leading-6">
                    {t('tools.subtitle')}
                </p>
            </motion.div>

            {/* Tabs Navigation */}
            <div className="w-full max-w-4xl min-w-0 shrink-0 px-4">
                <div className="-mx-4 mb-6 sm:mb-8 overflow-x-auto overscroll-x-contain px-4 pb-1 custom-scrollbar [-webkit-overflow-scrolling:touch]">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex w-max min-w-full flex-nowrap items-center gap-2 border-b border-slate-200 pb-1 sm:justify-center"
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors duration-200',
                                        isActive
                                            ? 'text-orange-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'w-4 h-4 flex-shrink-0',
                                            isActive
                                                ? 'text-orange-600'
                                                : 'text-slate-400'
                                        )}
                                    />
                                    <span>{tab.label}</span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeTab"
                                            className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-orange-600 rounded-t-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Tab Content Panels */}
                <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-12 items-start w-full">
                    {/* Information Side (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="md:col-span-4 space-y-4 order-2 md:order-1"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100"
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    {activeTab === 'conversion' && (
                                        <Target className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    {activeTab === 'roi' && (
                                        <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    {activeTab === 'profit' && (
                                        <DollarSign className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    {activeTab === 'cpl' && (
                                        <DollarSign className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    {activeTab === 'lead' && (
                                        <Users className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    {activeTab === 'cpa' && (
                                        <Calculator className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    )}
                                    <span className="truncate">
                                        {
                                            tabs.find(
                                                (tab) => tab.id === activeTab
                                            )?.label
                                        }
                                    </span>
                                </h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                                    {activeTab === 'conversion' &&
                                        t('tools.descriptions.conversion')}
                                    {activeTab === 'roi' &&
                                        t('tools.descriptions.roi')}
                                    {activeTab === 'profit' &&
                                        t('tools.descriptions.profit')}
                                    {activeTab === 'cpl' &&
                                        t('tools.descriptions.cpl')}
                                    {activeTab === 'lead' &&
                                        t('tools.descriptions.lead')}
                                    {activeTab === 'cpa' &&
                                        t('tools.descriptions.cpa')}
                                </p>
                                <div className="pt-4 border-t border-slate-200">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                        {t('tools.tip')}
                                    </span>
                                    <p className="text-slate-600 text-xs sm:text-sm">
                                        {activeTab === 'conversion' &&
                                            t('tools.tips.conversion')}
                                        {activeTab === 'roi' &&
                                            t('tools.tips.roi')}
                                        {activeTab === 'profit' &&
                                            t('tools.tips.profit')}
                                        {activeTab === 'cpl' &&
                                            t('tools.tips.cpl')}
                                        {activeTab === 'lead' &&
                                            t('tools.tips.lead')}
                                        {activeTab === 'cpa' &&
                                            t('tools.tips.cpa')}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Calculator Side (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="md:col-span-8 order-1 md:order-2"
                    >
                        <Card className="border border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                                        {/* Conversion Rate Inputs */}
                                        {activeTab === 'conversion' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.numberOfActions'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                conversion.actions
                                                            }
                                                            onChange={(e) =>
                                                                calculateConversion(
                                                                    'actions',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalVisitors'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                conversion.visitors
                                                            }
                                                            onChange={(e) =>
                                                                calculateConversion(
                                                                    'visitors',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.conversionRate'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={
                                                                conversion.result
                                                            }
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-2xl sm:text-3xl font-bold text-slate-900"
                                                        >
                                                            {conversion.result}
                                                        </motion.span>
                                                        <span className="text-base sm:text-lg font-medium text-slate-500">
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ROI Inputs */}
                                        {activeTab === 'roi' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.revenue',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={roi.revenue}
                                                            onChange={(e) =>
                                                                calculateRoi(
                                                                    'revenue',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.investmentCost',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={roi.cost}
                                                            onChange={(e) =>
                                                                calculateRoi(
                                                                    'cost',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.returnOnInvestment'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={roi.result}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-2xl sm:text-3xl font-bold text-slate-900"
                                                        >
                                                            {roi.result}
                                                        </motion.span>
                                                        <span className="text-base sm:text-lg font-medium text-slate-500">
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Profit Inputs */}
                                        {activeTab === 'profit' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalRevenue',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                profit.revenue
                                                            }
                                                            onChange={(e) =>
                                                                calculateProfit(
                                                                    'revenue',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalCost',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={profit.cost}
                                                            onChange={(e) =>
                                                                calculateProfit(
                                                                    'cost',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.netProfit'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={profit.result}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className={cn(
                                                                'text-2xl sm:text-3xl font-bold',
                                                                profit.result >=
                                                                    0
                                                                    ? 'text-slate-900'
                                                                    : 'text-red-600'
                                                            )}
                                                        >
                                                            {formatCurrency(
                                                                profit.result
                                                            )}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CPL Inputs */}
                                        {activeTab === 'cpl' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalSpend',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={cpl.cost}
                                                            onChange={(e) =>
                                                                calculateCpl(
                                                                    'cost',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalLeads'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={cpl.leads}
                                                            onChange={(e) =>
                                                                calculateCpl(
                                                                    'leads',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.costPerLead'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={cpl.result}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-2xl sm:text-3xl font-bold text-slate-900"
                                                        >
                                                            {formatCurrency(
                                                                cpl.result,
                                                                {
                                                                    maximumFractionDigits: 0,
                                                                }
                                                            )}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lead Inputs */}
                                        {activeTab === 'lead' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.monthlyTraffic'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                leads.traffic
                                                            }
                                                            onChange={(e) =>
                                                                calculateLeads(
                                                                    'traffic',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.expectedConversion'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                leads.conversionRate
                                                            }
                                                            onChange={(e) =>
                                                                calculateLeads(
                                                                    'conversionRate',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.projectedLeads'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={leads.result}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-2xl sm:text-3xl font-bold text-slate-900"
                                                        >
                                                            {leads.result}
                                                        </motion.span>
                                                        <span className="text-sm sm:text-lg font-medium text-slate-500">
                                                            {t(
                                                                'tools.labels.leadsUnit'
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CPA Inputs */}
                                        {activeTab === 'cpa' && (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.totalCostUsed',
                                                                { currencyCode }
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={cpa.cost}
                                                            onChange={(e) =>
                                                                calculateCpa(
                                                                    'cost',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-slate-700 font-medium text-xs sm:text-sm">
                                                            {t(
                                                                'tools.labels.numberOfCustomers'
                                                            )}
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="h-10 rounded-lg border-slate-300 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            placeholder="0"
                                                            value={
                                                                cpa.customers
                                                            }
                                                            onChange={(e) =>
                                                                calculateCpa(
                                                                    'customers',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        {t(
                                                            'tools.labels.costPerCustomer'
                                                        )}
                                                    </span>
                                                    <div className="flex items-baseline gap-1">
                                                        <motion.span
                                                            key={cpa.result}
                                                            initial={{
                                                                opacity: 0,
                                                                y: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            className="text-2xl sm:text-3xl font-bold text-slate-900"
                                                        >
                                                            {formatCurrency(
                                                                cpa.result,
                                                                {
                                                                    maximumFractionDigits: 0,
                                                                }
                                                            )}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </motion.div>
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
