import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { GoogleAnalyticsApiService } from '../src/modules/integrations/google-analytics/google-analytics-api.service';
import { PrismaService } from '../src/modules/prisma/prisma.service';

const ranges = [
  { label: '7d', startDate: '7daysAgo', endDate: 'today' },
  { label: '30d', startDate: '30daysAgo', endDate: 'today' },
  { label: '90d', startDate: '90daysAgo', endDate: 'today' },
  { label: '365d', startDate: '365daysAgo', endDate: 'today' },
];

async function main() {
  const tenantId = process.argv[2];

  if (!tenantId) {
    throw new Error('Usage: npx ts-node scratch/diagnose-ga4-report.ts <tenantId>');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const prisma = app.get(PrismaService);
  const apiService = app.get(GoogleAnalyticsApiService);

  try {
    const account = await prisma.googleAnalyticsAccount.findFirst({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { updatedAt: 'desc' },
    });

    if (!account) {
      throw new Error(`No active GA4 account found for tenant ${tenantId}`);
    }

    console.log(
      JSON.stringify(
        {
          account: {
            id: account.id,
            propertyId: account.propertyId,
            propertyName: account.propertyName,
            hasAccessToken: !!account.accessToken,
            hasRefreshToken: !!account.refreshToken,
            tokenExpiresAt: account.tokenExpiresAt,
            lastSyncAt: account.lastSyncAt,
          },
        },
        null,
        2,
      ),
    );

    const realtimeResponse = await apiService.runRealtimeReport(account, {
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'unifiedScreenName' }],
    });
    const realtimeRows = realtimeResponse?.rows ?? [];
    const realtimeActiveUsers = realtimeRows.reduce(
      (sum: number, row: any) => sum + Number(row.metricValues?.[0]?.value ?? 0),
      0,
    );
    console.log(
      JSON.stringify(
        {
          realtime: {
            rowCount: realtimeRows.length,
            activeUsers: realtimeActiveUsers,
            rows: realtimeRows.slice(0, 5).map((row: any) => ({
              screenName: row.dimensionValues?.[0]?.value ?? null,
              activeUsers: Number(row.metricValues?.[0]?.value ?? 0),
            })),
          },
        },
        null,
        2,
      ),
    );

    for (const range of ranges) {
      const response = await apiService.runReport(account, {
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
      });

      const rows = response?.rows ?? [];
      const totals = rows.reduce(
        (sum: any, row: any) => ({
          activeUsers: sum.activeUsers + Number(row.metricValues?.[0]?.value ?? 0),
          sessions: sum.sessions + Number(row.metricValues?.[1]?.value ?? 0),
          screenPageViews: sum.screenPageViews + Number(row.metricValues?.[2]?.value ?? 0),
        }),
        { activeUsers: 0, sessions: 0, screenPageViews: 0 },
      );

      console.log(
        JSON.stringify(
          {
            range: range.label,
            rowCount: rows.length,
            totals,
            firstDate: rows[0]?.dimensionValues?.[0]?.value ?? null,
            lastDate: rows[rows.length - 1]?.dimensionValues?.[0]?.value ?? null,
          },
          null,
          2,
        ),
      );
    }

    const savedRows = await prisma.webAnalyticsDaily.count({ where: { tenantId } });
    console.log(JSON.stringify({ savedRows }, null, 2));
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
