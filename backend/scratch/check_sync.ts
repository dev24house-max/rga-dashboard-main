
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const tenantId = 'e7e4bd2f-a06a-4797-844b-f3246c7cca35';
  console.log(`Checking Tenant: ${tenantId}`);

  const googleAdsAccount = await prisma.googleAdsAccount.findFirst({
    where: { tenantId }
  });
  console.log('Google Ads Account:', googleAdsAccount);

  const latestSyncLogs = await prisma.syncLog.findMany({
    where: { tenantId, platform: 'GOOGLE_ADS' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Latest Sync Logs:', latestSyncLogs);

  const campaignCount = await prisma.campaign.count({
    where: { tenantId, platform: 'GOOGLE_ADS' }
  });
  console.log('Google Ads Campaigns Count:', campaignCount);

  const metricCount = await prisma.metric.count({
    where: { tenantId, platform: 'GOOGLE_ADS' }
  });
  console.log('Google Ads Metrics Count:', metricCount);

  if (metricCount > 0) {
    const latestMetric = await prisma.metric.findFirst({
      where: { tenantId, platform: 'GOOGLE_ADS' },
      orderBy: { date: 'desc' }
    });
    console.log('Latest Google Ads Metric:', latestMetric);
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
