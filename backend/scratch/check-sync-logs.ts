
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const logs = await prisma.syncLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    console.log('Recent Sync Logs:');
    for (const log of logs) {
      console.log(`- Time: ${log.createdAt}`);
      console.log(`  Platform: ${log.platform}`);
      console.log(`  Status: ${log.status}`);
      console.log(`  Error: ${log.errorMessage}`);
      console.log(`  Records: ${log.recordsCount}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
