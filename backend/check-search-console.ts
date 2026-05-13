import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const searchConsoleCount = await prisma.searchConsolePerformance.count();
    console.log('Search Console Performance count:', searchConsoleCount);

    const latestSearchConsole = await prisma.searchConsolePerformance.findMany({
        take: 5,
        orderBy: { date: 'desc' }
    });
    console.log('Latest Search Console Performance:', JSON.stringify(latestSearchConsole, null, 2));

    // Check if data looks like mock (e.g., all clicks = 0 or repetitive data)
    if (searchConsoleCount > 0) {
      const sampleData = await prisma.searchConsolePerformance.findMany({
        take: 10
      });
      const allClicksZero = sampleData.every(item => item.clicks === 0);
      const allImpressionsZero = sampleData.every(item => item.impressions === 0);
      console.log('All sample clicks are 0:', allClicksZero);
      console.log('All sample impressions are 0:', allImpressionsZero);

      if (allClicksZero && allImpressionsZero) {
        console.log('This data appears to be mock data (no real clicks or impressions).');
      } else {
        console.log('This data appears to be real data.');
      }
    } else {
      console.log('No Search Console data found.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();