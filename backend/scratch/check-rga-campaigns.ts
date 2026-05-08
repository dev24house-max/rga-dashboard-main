
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { name: 'RGA' }
    });

    if (!tenant) {
      console.log('Tenant RGA not found');
      return;
    }

    const campaigns = await prisma.campaign.findMany({
      where: { tenantId: tenant.id },
      include: {
        _count: {
          select: { metrics: true }
        }
      }
    });

    console.log(`Campaigns for Tenant RGA (${tenant.id}):`);
    for (const c of campaigns) {
      console.log(`- Name: ${c.name}, Platform: ${c.platform}, Status: ${c.status}, Metrics Count: ${c._count.metrics}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
