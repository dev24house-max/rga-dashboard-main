import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'testuser@gmail.com' }
    });
    console.log('Current User Tenant ID:', user?.tenantId);

    if (user?.tenantId) {
      const accounts = await prisma.googleAdsAccount.findMany({
        where: { tenantId: user.tenantId }
      });
      console.log('Google Ads Accounts for this tenant:', accounts.map(a => ({
        id: a.id,
        customerId: a.customerId,
        accountName: a.accountName
      })));

      const campaignCount = await prisma.campaign.count({
        where: { tenantId: user.tenantId, platform: 'GOOGLE_ADS' }
      });
      console.log('Campaign count for this tenant:', campaignCount);

      const metricCount = await prisma.metric.count({
        where: { tenantId: user.tenantId, platform: 'GOOGLE_ADS' }
      });
      console.log('Metric count for this tenant:', metricCount);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
