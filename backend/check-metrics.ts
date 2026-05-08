import { PrismaClient, AdPlatform } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const campaignCount = await prisma.campaign.count();
    const metricCount = await prisma.metric.count();
    const ga4MetricCount = await prisma.metric.count({
      where: { platform: AdPlatform.GOOGLE_ANALYTICS }
    });
    const campaignWithBudgetCount = await prisma.campaign.count({
      where: { budget: { gt: 0 } }
    });
    const metricsWithRevenueCount = await prisma.metric.count({
        where: { revenue: { gt: 0 } }
    });

    console.log('Campaign count:', campaignCount);
    console.log('Metric count:', metricCount);
    console.log('GA4 Metric count:', ga4MetricCount);
    console.log('Campaigns with Budget > 0:', campaignWithBudgetCount);
    console.log('Metrics with Revenue > 0:', metricsWithRevenueCount);

    const latestGa4Metrics = await prisma.metric.findMany({
        where: { platform: AdPlatform.GOOGLE_ANALYTICS },
        take: 5,
        orderBy: { date: 'desc' }
    });
    console.log('Latest GA4 metrics:', JSON.stringify(latestGa4Metrics, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
