import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { SeoService } from '../api';
import { formatCompactNumber } from '@/lib/formatters';
import { useTranslation } from '@/i18n/use-translation';

interface IntentData {
    type: string;
    keywords: number;
    traffic: number;
    keywordsTrend?: number;
    trafficTrend?: number;
}

export function OrganicKeywordsByIntent({
    isLoading,
}: {
    isLoading?: boolean;
}) {
    const { t } = useTranslation('seo');
    const { data: intentData, isLoading: isQueryLoading } = useQuery({
        queryKey: ['seo-keyword-intent'],
        queryFn: () => SeoService.getKeywordIntent(),
        enabled: !isLoading,
    });

    const loading = isLoading || isQueryLoading;

    if (loading) {
        return <Card className="h-full animate-pulse bg-white/50" />;
    }

    const data = intentData || [];

    // Helper to get data by type safely
    const getByType = (t: string) =>
        data.find((d: IntentData) => d.type === t) || {
            type: t,
            keywords: 0,
            traffic: 0,
            keywordsTrend: 0,
            trafficTrend: 0,
        };

    const branded = getByType('branded');
    const nonBranded = getByType('non_branded');
    const informational = getByType('informational');
    const navigational = getByType('navigational');
    const commercial = getByType('commercial');
    const transactional = getByType('transactional');

    // Calculate max for bar width calculation if needed,
    // but for now we'll use a relative background bar similar to the design but adapted for light mode.

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="p-3 pb-2 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-semibold text-gray-700">
                        {t('keywordIntent.title')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-hidden">
                    <table className="w-full text-xs text-left">
                        <thead className="text-[10px] text-muted-foreground bg-muted/50 uppercase">
                            <tr>
                                <th className="px-3 py-2 font-medium w-[40%]">
                                    {t('keywordIntent.columns.intent')}
                                </th>
                                <th className="px-3 py-2 font-medium text-right w-[30%]">
                                    {t('keywordIntent.columns.keywords')}
                                </th>
                                <th className="px-3 py-2 font-medium text-right w-[30%]">
                                    {t('keywordIntent.columns.traffic')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {/* Branded / Non-Branded Group - Styled with backgrounds */}
                            <IntentRow
                                label={t('keywordIntent.labels.branded')}
                                data={branded}
                                barColor="bg-orange-100"
                                textColor="text-orange-700"
                            />
                            <IntentRow
                                label={t('keywordIntent.labels.nonBranded')}
                                data={nonBranded}
                                barColor="bg-orange-50"
                                textColor="text-orange-600"
                            />

                            {/* Spacer Row or distinct section */}

                            <IntentRow
                                label={t('keywordIntent.labels.informational')}
                                data={informational}
                                barColor="bg-blue-100 dark:bg-sky-500/10"
                                textColor="text-blue-700 dark:text-sky-300/80"
                                showBorderTop
                            />
                            <IntentRow
                                label={t('keywordIntent.labels.navigational')}
                                data={navigational}
                                barColor="bg-blue-50 dark:bg-sky-500/5"
                                textColor="text-blue-600 dark:text-sky-300/75"
                            />
                            <IntentRow
                                label={t('keywordIntent.labels.commercial')}
                                data={commercial}
                                barColor="bg-blue-50 dark:bg-sky-500/5"
                                textColor="text-blue-600 dark:text-sky-300/75"
                            />
                            <IntentRow
                                label={t('keywordIntent.labels.transactional')}
                                data={transactional}
                                barColor="bg-orange-50"
                                textColor="text-orange-600"
                            />
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function IntentRow({
    label,
    data,
    barColor,
    textColor,
    showBorderTop,
}: {
    label: string;
    data: IntentData;
    barColor: string;
    textColor: string;
    showBorderTop?: boolean;
}) {
    return (
        <tr
            className={`relative group ${showBorderTop ? 'border-t-2 border-muted' : ''}`}
        >
            <td className="px-3 py-2 relative">
                {/* Background Bar Simulation */}
                <div
                    className={`absolute inset-y-[2px] left-2 right-0 ${barColor} -z-10 rounded-sm w-[95%]`}
                />
                <span className="font-medium text-gray-700 relative z-10">
                    {label}
                </span>
            </td>
            <td className="px-3 py-2 text-right relative">
                <div
                    className={`absolute inset-y-[2px] left-[-100%] right-2 ${barColor} -z-10 rounded-sm`}
                />
                <span className={`${textColor} font-medium relative z-10`}>
                    {formatCompactNumber(data.keywords)}
                </span>
                <span
                    className={`text-[10px] ml-1 relative z-10 ${data.keywordsTrend && data.keywordsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                    {data.keywordsTrend && data.keywordsTrend > 0 ? '+' : ''}
                    {formatCompactNumber(data.keywordsTrend || 0)}
                </span>
            </td>
            <td className="px-3 py-2 text-right relative">
                <div
                    className={`absolute inset-y-[2px] left-[-100%] right-2 ${barColor} -z-10 rounded-sm`}
                />
                <span className="text-gray-900 font-medium relative z-10">
                    {formatCompactNumber(data.traffic)}
                </span>
                <span
                    className={`text-[10px] ml-1 relative z-10 ${data.trafficTrend && data.trafficTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                    {data.trafficTrend && data.trafficTrend > 0 ? '+' : ''}
                    {formatCompactNumber(data.trafficTrend || 0)}
                </span>
            </td>
        </tr>
    );
}
