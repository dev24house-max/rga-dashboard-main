import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Target, Timer, Trophy, Users, HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SeoMetricSummary } from "../types";

interface SeoSummaryCardsProps {
    data: SeoMetricSummary;
    isLoading?: boolean;
}

// SEO Metric tooltip content with contextual logic
const getSeoMetricTooltip = (metric: string, data: SeoMetricSummary) => {
    const safe = (val: number | null) => val === undefined || val === null || isNaN(val) ? 0 : val;

    const organicSessions = safe(data.organicSessions);
    const goalCompletions = safe(data.goalCompletions);
    const avgPosition = safe(data.avgPosition);
    const avgTimeOnPage = safe(data.avgTimeOnPage);

    switch (metric) {
        case 'organicSessions':
            return {
                explanation: 'Organic Sessions: Total number of visits from organic search results.',
                contextual: organicSessions === 0
                    ? 'No organic traffic detected. Check if Google Analytics is properly connected.'
                    : `${organicSessions.toLocaleString()} visitors found your site through search engines.`
            };

        case 'goalCompletions':
            if (goalCompletions === 0) {
                return {
                    explanation: 'Goal Completions: Number of times visitors completed your defined conversion goals.',
                    contextual: 'No goals completed yet. Set up conversion goals in Google Analytics to track user actions.'
                };
            }
            return {
                explanation: 'Goal Completions: Number of times visitors completed your defined conversion goals.',
                contextual: `${goalCompletions.toLocaleString()} visitors completed your goals. Good job on conversions!`
            };

        case 'avgPosition':
            if (avgPosition === 0) {
                return {
                    explanation: 'Average Position: Your website\'s average ranking position in search results.',
                    contextual: 'No ranking data available. Rankings typically appear after your site gets organic traffic.'
                };
            }
            return {
                explanation: 'Average Position: Your website\'s average ranking position in search results.',
                contextual: avgPosition <= 3
                    ? `Excellent! Ranking at position ${avgPosition.toFixed(1)} puts you on the first page.`
                    : avgPosition <= 10
                    ? `Good ranking at position ${avgPosition.toFixed(1)}. Consider optimizing for top 3 positions.`
                    : `Ranking at position ${avgPosition.toFixed(1)}. Focus on improving SEO to reach top 10.`
            };

        case 'avgTimeOnPage':
            return {
                explanation: 'Average Time on Page: How long visitors spend on your website pages.',
                contextual: avgTimeOnPage < 30
                    ? `Visitors spend only ${Math.floor(avgTimeOnPage)} seconds. Improve content engagement.`
                    : avgTimeOnPage < 120
                    ? `Decent engagement with ${Math.floor(avgTimeOnPage / 60)}m ${Math.floor(avgTimeOnPage % 60)}s average time.`
                    : `Excellent engagement! Visitors spend ${Math.floor(avgTimeOnPage / 60)}m ${Math.floor(avgTimeOnPage % 60)}s on average.`
            };

        default:
            return {
                explanation: 'SEO metric explanation not available.',
                contextual: 'Contact support if you need help understanding this metric.'
            };
    }
};

const SeoMetricTooltip = ({ metric, data, children }: { metric: string; data: SeoMetricSummary; children: React.ReactNode }) => {
    const tip = getSeoMetricTooltip(metric, data);

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

export function SeoSummaryCards({ data, isLoading }: SeoSummaryCardsProps) {
    const metrics = [
        {
            title: "Organic Sessions",
            value: data.organicSessions.toLocaleString(),
            icon: Users,
            trend: `${data.organicSessionsTrend && data.organicSessionsTrend > 0 ? '+' : ''}${data.organicSessionsTrend ?? 0}%`,
            trendUp: (data.organicSessionsTrend ?? 0) >= 0,
            description: "Total organic traffic sessions",
            color: "text-blue-500",
            bg: "bg-blue-50",
            metric: "organicSessions"
        },
        {
            title: "Goal Completions",
            value: data.goalCompletions !== null ? data.goalCompletions.toLocaleString() : "-",
            icon: Target,
            trend: `${data.goalCompletionsTrend && data.goalCompletionsTrend > 0 ? '+' : ''}${data.goalCompletionsTrend ?? 0}%`,
            trendUp: (data.goalCompletionsTrend ?? 0) >= 0,
            description: "Completed conversion goals",
            color: "text-green-500",
            bg: "bg-green-50",
            metric: "goalCompletions"
        },
        {
            title: "Avg. Position",
            value: data.avgPosition !== null ? data.avgPosition.toFixed(1) : "-",
            icon: Trophy,
            trend: `${data.avgPositionTrend && data.avgPositionTrend > 0 ? '+' : ''}${data.avgPositionTrend ?? 0}%`,
            trendUp: (data.avgPositionTrend ?? 0) <= 0, // Lower position is better, so negative trend is good
            description: "Average search ranking position",
            color: "text-amber-500",
            bg: "bg-amber-50",
            metric: "avgPosition"
        },
        {
            title: "Avg. Time on Page",
            value: formatDuration(data.avgTimeOnPage),
            icon: Timer,
            trend: `${data.avgTimeOnPageTrend && data.avgTimeOnPageTrend > 0 ? '+' : ''}${data.avgTimeOnPageTrend ?? 0}%`,
            trendUp: (data.avgTimeOnPageTrend ?? 0) >= 0,
            description: "Average session duration",
            color: "text-purple-500",
            bg: "bg-purple-50",
            metric: "avgTimeOnPage"
        }
    ];

    if (isLoading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 h-32" />
                </Card>
            ))}
        </div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <Card key={metric.title} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground line-clamp-1 flex-1" title={metric.title}>
                            {metric.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <SeoMetricTooltip metric={metric.metric} data={data}>
                                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                            </SeoMetricTooltip>
                            <div className={`p-2 rounded-full ${metric.bg}`}>
                                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-baseline justify-between pt-2">
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className={`flex items-center text-xs ${metric.trendUp ? 'text-green-600' : 'text-red-600'} bg-opacity-10 px-2 py-1 rounded-full ${metric.trendUp ? 'bg-green-50' : 'bg-red-50'}`}>
                                {metric.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {metric.trend}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {metric.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}
