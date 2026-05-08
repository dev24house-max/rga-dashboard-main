
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log('Checking Google Ads campaigns and metrics...');

  const campaigns = await prisma.campaign.findMany({
    where: { platform: 'GOOGLE_ADS' },
    include: {
      _count: {
        select: { metrics: true }
      }
    }
  });

  console.log(`Found ${campaigns.length} Google Ads campaigns.`);

  for (const c of campaigns) {
    console.log(`\nCampaign: ${c.name} (ID: ${c.id}, ExternalID: ${c.externalId})`);
    console.log(`Metric count: ${c._count.metrics}`);

    const metrics = await prisma.metric.findMany({
      where: { campaignId: c.id },
      orderBy: { date: 'desc' },
      take: 10
    });

    if (metrics.length > 0) {
      console.log('Last 10 metrics:');
      metrics.forEach(m => {
        console.log(`- Date: ${m.date.toISOString().split('T')[0]}, Source: ${m.source}, Spend: ${m.spend}, Impressions: ${m.impressions}`);
      });

      const distinctSources = await prisma.metric.findMany({
        where: { campaignId: c.id },
        distinct: ['source'],
        select: { source: true }
      });
      const lifetimeMetrics = await prisma.metric.findMany({
        where: { campaignId: c.id, source: 'lifetime_summary' },
      });
      console.log(`- Lifetime summary rows: ${lifetimeMetrics.length}`);
      lifetimeMetrics.forEach(lm => {
        console.log(`  - Date: ${lm.date.toISOString().split('T')[0]}, Spend: ${lm.spend}`);
      });

    } else {
      console.log('No metrics found for this campaign.');
    }
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
