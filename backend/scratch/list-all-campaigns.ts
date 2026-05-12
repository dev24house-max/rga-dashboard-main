
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tenants = await prisma.tenant.findMany({
      select: { id: true, name: true }
    });

    for (const t of tenants) {
      const counts = await prisma.campaign.groupBy({
        by: ['platform'],
        where: { tenantId: t.id },
        _count: true
      });
      console.log(`Tenant: ${t.name} (${t.id})`);
      if (counts.length === 0) {
        console.log('  No campaigns');
      }
      for (const c of counts) {
        console.log(`  - ${c.platform}: ${c._count}`);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
