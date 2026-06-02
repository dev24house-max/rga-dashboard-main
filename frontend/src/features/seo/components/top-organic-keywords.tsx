import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';
import { useEffect, useState } from 'react';
import { SeoService } from '../api';
import { useTranslation } from '@/i18n/use-translation';

interface KeywordData {
    keyword: string;
    position: number;
    volume: number;
    cpc?: number;
    trafficPercent: number;
}

export function TopOrganicKeywords() {
    const { t } = useTranslation('seo');
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const data = await SeoService.getTopKeywords();
                setKeywords(data);
            } catch (error) {
                console.error('Failed to fetch keywords:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchKeywords();
    }, []);

    if (loading) {
        return (
            <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
                <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
                    <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
                        {t('topKeywords.title')}
                    </CardTitle>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-normal">
                        {t('topKeywords.beta')}
                    </span>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-sm text-muted-foreground">
                            {t('topKeywords.loading')}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
            <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
                    {t('topKeywords.title')}
                </CardTitle>
                <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-normal">
                    {t('topKeywords.beta')}
                </span>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
                <table className="w-full caption-bottom text-xs text-left">
                    <thead className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm dark:bg-muted/20">
                        <tr className="border-b border-border dark:border-border/70">
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[40%]">
                                {t('topKeywords.columns.keywords')}
                            </th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                {t('topKeywords.columns.position')}
                            </th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                {t('topKeywords.columns.volume')}
                            </th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                {t('topKeywords.columns.cpc')}
                            </th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                {t('topKeywords.columns.trafficPercent')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 text-xs">
                        {keywords.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-border transition-colors hover:bg-muted/30 dark:border-border/60 dark:hover:bg-muted/20"
                            >
                                <td className="p-2 px-4 align-middle font-medium text-blue-600 cursor-pointer hover:underline truncate max-w-[150px] dark:text-sky-300/80 dark:hover:text-sky-200">
                                    {item.keyword}
                                </td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">
                                    {item.position}
                                </td>
                                <td className="p-2 px-4 align-middle">
                                    <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium text-[10px] dark:bg-emerald-500/10 dark:text-emerald-300/85">
                                        {formatCompactNumber(item.volume)}
                                    </span>
                                </td>
                                <td className="p-2 px-4 align-middle text-gray-600 dark:text-muted-foreground">
                                    {item.cpc !== undefined && item.cpc !== null
                                        ? `$${item.cpc.toFixed(2)}`
                                        : '-'}
                                </td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">
                                    {item.trafficPercent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
