import { Prisma } from '@prisma/client';

export function getAlertMetricCutoffDate() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return cutoff;
}

export function visibleAlertWhere(
    metricCutoff: Date = getAlertMetricCutoffDate(),
): Prisma.AlertWhereInput {
    return {
        OR: [
            { campaignId: null },
            {
                campaign: {
                    is: {
                        metrics: {
                            some: {
                                date: { gte: metricCutoff },
                                isMockData: false,
                            },
                        },
                    },
                },
            },
        ],
    };
}

export function visibleNotificationWhere(
    metricCutoff: Date = getAlertMetricCutoffDate(),
): Prisma.NotificationWhereInput {
    return {
        OR: [
            { type: { not: 'ALERT' } },
            {
                alert: {
                    is: visibleAlertWhere(metricCutoff),
                },
            },
        ],
    };
}
