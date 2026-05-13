import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveUpRight, HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SeoMetricSummary } from "../types";

interface SeoPremiumCardsProps {
    data: SeoMetricSummary;
    isLoading?: boolean;
}

// SEO Premium Metric tooltip content with contextual logic
const getSeoPremiumMetricTooltip = (metric: string, data: SeoMetricSummary) => {
    const safe = (val: number | null) => val === undefined || val === null || isNaN(val) ? 0 : val;

    const ur = safe(data.ur);
    const dr = safe(data.dr);
    const backlinks = safe(data.backlinks);
    const referringDomains = safe(data.referringDomains);
    const keywords = safe(data.keywords);
    const trafficCost = safe(data.trafficCost);
    const organicSessions = safe(data.organicSessions);

    switch (metric) {
        case 'ur':
            if (ur === 0) {
                return {
                    explanation: 'URL Rating: Ahrefs\' score measuring the strength of a target page\'s backlink profile.',
                    contextual: 'No URL rating data available. UR scores typically range from 0-100.'
                };
            }
            return {
                explanation: 'URL Rating: Ahrefs\' score measuring the strength of a target page\'s backlink profile.',
                contextual: ur >= 80
                    ? `Excellent UR score of ${ur}! Your page has a very strong backlink profile.`
                    : ur >= 60
                    ? `Good UR score of ${ur}. Your page has a decent backlink profile.`
                    : ur >= 30
                    ? `Fair UR score of ${ur}. Consider building more quality backlinks.`
                    : `Low UR score of ${ur}. Focus on acquiring high-quality backlinks.`
            };

        case 'dr':
            if (dr === 0) {
                return {
                    explanation: 'Domain Rating: Ahrefs\' score measuring the strength of your entire domain\'s backlink profile.',
                    contextual: 'No domain rating data available. DR scores typically range from 0-100.'
                };
            }
            return {
                explanation: 'Domain Rating: Ahrefs\' score measuring the strength of your entire domain\'s backlink profile.',
                contextual: dr >= 80
                    ? `Outstanding DR score of ${dr}! Your domain has excellent authority.`
                    : dr >= 60
                    ? `Strong DR score of ${dr}. Your domain has good authority.`
                    : dr >= 30
                    ? `Moderate DR score of ${dr}. Consider improving domain authority.`
                    : `Low DR score of ${dr}. Focus on building domain authority through quality backlinks.`
            };

        case 'backlinks':
            return {
                explanation: 'Backlinks: Total number of external links pointing to your website.',
                contextual: backlinks === 0
                    ? 'No backlinks detected. Start building quality backlinks to improve SEO.'
                    : `${backlinks.toLocaleString()} backlinks from ${referringDomains.toLocaleString()} domains. ${backlinks > referringDomains ? 'Good link diversity!' : 'Consider diversifying your backlink sources.'}`
            };

        case 'organicSearch':
            return {
                explanation: 'Organic Search: Website traffic from unpaid search engine results.',
                contextual: organicSessions === 0
                    ? 'No organic search traffic. Focus on SEO optimization to appear in search results.'
                    : `${organicSessions.toLocaleString()} organic visitors. ${keywords > 0 ? `${keywords.toLocaleString()} keywords driving traffic.` : 'Monitor keyword performance to identify opportunities.'}`
            };

        default:
            return {
                explanation: 'SEO metric explanation not available.',
                contextual: 'Contact support if you need help understanding this metric.'
            };
    }
};

const SeoPremiumMetricTooltip = ({ metric, data, children }: { metric: string; data: SeoMetricSummary; children: React.ReactNode }) => {
    const tip = getSeoPremiumMetricTooltip(metric, data);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[260px] p-0 border-0 shadow-2xl overflow-hidden rounded-[10px]"
                    style={{ background: '#111827' }}
                >
                    <div>
                        {/* Header with orange accent */}
                        <div className="px-3.5 pt-2.5 pb-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <div
                                    className="w-0.5 h-3.5 rounded-full shrink-0"
                                    style={{ background: '#F97316' }}
                                />
                                <span
                                    className="text-[10px] font-medium uppercase tracking-wider"
                                    style={{ color: '#FB923C' }}
                                >
                                    {metric.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                            <p className="text-[12.5px] text-slate-100 leading-relaxed m-0">
                                {tip.explanation}
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export function SeoPremiumCards({ data, isLoading }: SeoPremiumCardsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse h-48 bg-white/50" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* UR Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title="UR">
                        UR
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="ur" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center relative min-h-[110px]">
                        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[130px] max-h-[130px] transform rotate-135">
                            {/* Background Track */}
                            <circle
                                cx="50"
                                cy="50"
                                r={38}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-100"
                                strokeDasharray={`${38 * 2 * Math.PI * 0.75} ${38 * 2 * Math.PI}`}
                                strokeLinecap="round"
                            />
                            {/* Active Progress Bar */}
                            {data.ur !== null && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={38}
                                    fill="none"
                                    className="stroke-green-500"
                                    strokeWidth="8"
                                    strokeDasharray={`${38 * 2 * Math.PI * 0.75} ${38 * 2 * Math.PI}`}
                                    strokeDashoffset={38 * 2 * Math.PI * 0.75 - ((data.ur ?? 0) / 100 * 38 * 2 * Math.PI * 0.75)}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                />
                            )}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pt-2">
                            <span className={`text-3xl font-bold ${data.ur === null ? 'text-gray-300' : 'text-gray-900'}`}>
                                {data.ur ?? 0}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DR Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title="DR">
                        DR
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="dr" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center relative min-h-[110px]">
                        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[130px] max-h-[130px] transform rotate-135">
                            {/* Background Track */}
                            <circle
                                cx="50"
                                cy="50"
                                r={38}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-100"
                                strokeDasharray={`${38 * 2 * Math.PI * 0.75} ${38 * 2 * Math.PI}`}
                                strokeLinecap="round"
                            />
                            {/* Active Progress Bar */}
                            {data.dr !== null && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={38}
                                    fill="none"
                                    className="stroke-orange-400"
                                    strokeWidth="8"
                                    strokeDasharray={`${38 * 2 * Math.PI * 0.75} ${38 * 2 * Math.PI}`}
                                    strokeDashoffset={38 * 2 * Math.PI * 0.75 - ((data.dr ?? 0) / 100 * 38 * 2 * Math.PI * 0.75)}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                />
                            )}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pt-2">
                            <span className={`text-3xl font-bold ${data.dr === null ? 'text-gray-300' : 'text-gray-900'}`}>
                                {data.dr ?? 0}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Backlinks Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title="Backlinks">
                        Backlinks
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="backlinks" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col justify-between h-full">
                    <div className="mt-2">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-blue-600">
                                {data.backlinks ? data.backlinks.toLocaleString() : "0"}
                            </span>
                            <span className="text-muted-foreground text-xs">Total Backlinks</span>
                        </div>
                    </div>
                    <div className="mt-auto pt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Referring Domains</span>
                            <span className="font-medium text-gray-900">{data.referringDomains ? data.referringDomains.toLocaleString() : "0"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Keywords</span>
                            <span className="font-medium text-gray-900">{data.keywords ? data.keywords.toLocaleString() : "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Traffic Cost</span>
                            <span className="font-medium text-gray-900">${data.trafficCost ? data.trafficCost.toLocaleString() : "0"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Organic Search Card */}
            <Card className="hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title="Organic Search">
                        Organic Search
                    </CardTitle>
                    <SeoPremiumMetricTooltip metric="organicSearch" data={data}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                    </SeoPremiumMetricTooltip>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col justify-between h-full">
                    <div className="mt-2">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-green-500">
                                {data.organicSessions.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-xs">Total Traffic</span>
                        </div>
                        {/* Use Trend if available */}
                        {data.organicSessionsTrend !== undefined && (
                            <div className={`flex items-center w-fit text-xs px-2 py-0.5 rounded-full ${data.organicSessionsTrend >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                                <MoveUpRight className={`h-3 w-3 mr-1 ${data.organicSessionsTrend < 0 ? 'rotate-90' : ''}`} />
                                {Math.abs(data.organicSessionsTrend)}%
                            </div>
                        )}
                    </div>
                    <div className="mt-auto pt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Keywords</span>
                            <span className="font-medium text-gray-900">{data.keywords ? data.keywords.toLocaleString() : "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Traffic Cost</span>
                            <span className="font-medium text-gray-900">${data.trafficCost ? data.trafficCost.toLocaleString() : "0"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
