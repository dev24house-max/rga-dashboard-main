
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const tenantId = 'e7e4bd2f-a06a-4797-844b-f3246c7cca35'; // TestCompany
  
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { tenantId },
      select: { name: true, platform: true, status: true }
    });

    console.log(`Campaigns for TestCompany (${tenantId}):`);
    for (const c of campaigns) {
      console.log(`- ${c.name} (${c.platform}), Status: ${c.status}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
