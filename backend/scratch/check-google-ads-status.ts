
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        integrations: true,
        googleAdsAccounts: true
      }
    });

    for (const t of tenants) {
      console.log(`Tenant: ${t.name} (${t.id})`);
      console.log(`  Integrations: ${t.integrations.map(i => i.type).join(', ') || 'None'}`);
      console.log(`  Google Ads Accounts: ${t.googleAdsAccounts.length}`);
      
      const campaignsCount = await prisma.campaign.count({
        where: { tenantId: t.id, platform: 'GOOGLE_ADS' }
      });
      console.log(`  Google Ads Campaigns: ${campaignsCount}`);

      const lastSync = await prisma.syncLog.findFirst({
        where: { tenantId: t.id, platform: 'GOOGLE_ADS' },
        orderBy: { createdAt: 'desc' }
      });
      if (lastSync) {
        console.log(`  Last Sync: ${lastSync.status} (${lastSync.createdAt}) - ${lastSync.errorMessage || 'No error'}`);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
