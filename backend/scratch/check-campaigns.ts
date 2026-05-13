
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        googleAdsAccounts: true,
        integrations: {
          where: { type: 'GOOGLE_ADS' }
        }
      }
    });

    console.log('Tenants Google Ads Status:');
    for (const t of tenants) {
      console.log(`- Tenant: ${t.name} (${t.id})`);
      console.log(`  Google Ads Accounts: ${t.googleAdsAccounts.length}`);
      for (const acc of t.googleAdsAccounts) {
        console.log(`    - ID: ${acc.customerId}, Name: ${acc.accountName}, Status: ${acc.status}`);
      }
      console.log(`  Integrations (GOOGLE_ADS): ${t.integrations.length}`);
      for (const int of t.integrations) {
        console.log(`    - Name: ${int.name}, Active: ${int.isActive}, Last Sync: ${int.lastSyncAt}`);
      }
      
      const campaignsCount = await prisma.campaign.count({
        where: { tenantId: t.id, platform: 'GOOGLE_ADS' }
      });
      console.log(`  Google Ads Campaigns Count: ${campaignsCount}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
