import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { SeoService } from '../api';
import { formatCompactNumber } from '@/lib/formatters';
import { useTranslation } from '@/i18n/use-translation';

interface LocationData {
    country: string;
    city: string;
    traffic: number;
    keywords?: number;
    countryCode: string;
}

interface TrafficByLocationProps {
    isLoading?: boolean;
}

export function TrafficByLocation({ isLoading }: TrafficByLocationProps) {
    const { t } = useTranslation('seo');
    const { data: locationData, isLoading: isQueryLoading } = useQuery<
        LocationData[]
    >({
        queryKey: ['seo-traffic-by-location'],
        queryFn: () => SeoService.getTrafficByLocation(),
        enabled: !isLoading,
    });

    const loading = isLoading || isQueryLoading;

    if (loading) {
        return <Card className="h-[400px] animate-pulse bg-white/50" />;
    }

    const data = locationData || [];

    // Calculate total traffic for percentage calculation
    const totalTraffic = data.reduce(
        (sum, location) => sum + location.traffic,
        0
    );

    return (
        <Card className="shadow-sm h-[400px] flex flex-col">
            <CardHeader className="p-3 pb-2 border-b shrink-0">
                <CardTitle className="text-xs font-semibold text-gray-700">
                    {t('trafficLocation.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2 flex-1 min-h-0 overflow-auto">
                <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 z-10 text-[10px] text-muted-foreground bg-muted/30 backdrop-blur-sm uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">
                                {t('trafficLocation.columns.location')}
                            </th>
                            <th className="px-3 py-2 font-medium text-right">
                                {t('trafficLocation.columns.traffic')}
                            </th>
                            <th className="px-3 py-2 font-medium text-right">
                                {t('trafficLocation.columns.share')}
                            </th>
                            <th className="px-3 py-2 font-medium text-right">
                                {t('trafficLocation.columns.keywords')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-3 py-6 text-center text-muted-foreground text-[10px]"
                                >
                                    {t('trafficLocation.empty')}
                                </td>
                            </tr>
                        ) : (
                            data.map((location, index) => {
                                const share =
                                    totalTraffic > 0
                                        ? (location.traffic / totalTraffic) *
                                          100
                                        : 0;
                                const city =
                                    location.city?.trim() || '(not set)';
                                const country =
                                    location.country?.trim() || city;
                                const countryCode = location.countryCode
                                    ?.trim()
                                    .toLowerCase();
                                const hasFlag = Boolean(
                                    countryCode &&
                                        countryCode !== 'xx' &&
                                        /^[a-z]{2}$/.test(countryCode)
                                );

                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                {hasFlag ? (
                                                    <img
                                                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                                                        alt={country}
                                                        className="w-5 h-auto shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="flex h-4 w-5 items-center justify-center rounded-sm border border-border bg-muted text-[8px] font-medium text-muted-foreground">
                                                        --
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="truncate font-medium text-gray-700">
                                                        {city}
                                                    </div>
                                                    <div className="truncate text-[10px] text-muted-foreground">
                                                        {country}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <span className="font-medium">
                                                {formatCompactNumber(
                                                    location.traffic
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <span className="text-muted-foreground">
                                                {share.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <span className="text-muted-foreground">
                                                {formatCompactNumber(
                                                    location.keywords || 0
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
