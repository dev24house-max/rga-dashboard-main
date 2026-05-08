
import { PrismaClient, AdPlatform } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const tenantId = 'e287f944-feea-41a1-b0b9-e3b4486f017c';
  
  try {
    const where: any = {
      tenantId,
      status: { not: 'DELETED' }
    };

    // Simulate platform filter "GOOGLE_ADS"
    const platformInput = 'GOOGLE_ADS';
    const platforms = platformInput.split(',').map(p => p.trim().toUpperCase());
    
    // This is what the repo does:
    const mappedPlatforms = platforms.map(p => {
       if (p === 'GOOGLE') return 'GOOGLE_ADS';
       return p;
    });

    where.platform = { in: mappedPlatforms };

    console.log('Query Where:', JSON.stringify(where, null, 2));

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        metrics: {
          take: 5
        }
      }
    });

    console.log(`Found ${campaigns.length} campaigns`);
    for (const c of campaigns) {
      console.log(`- ${c.name} (${c.platform})`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
