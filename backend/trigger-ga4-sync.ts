import { NestFactory } from '@nestjs/core';
import { AdPlatform } from '@prisma/client';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/modules/prisma/prisma.service';
import { UnifiedSyncService } from './src/modules/sync/unified-sync.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const syncService = app.get(UnifiedSyncService);
  const prisma = app.get(PrismaService);
  const tenantId = process.argv[2];

  console.log('Starting GA4 Sync...\n');

  const ga4Accounts = await prisma.googleAnalyticsAccount.findMany({
    where: {
      status: 'ACTIVE',
      ...(tenantId ? { tenantId } : {}),
    },
    include: { tenant: true },
  });

  if (ga4Accounts.length === 0) {
    console.log('No active Google Analytics accounts found');
    await app.close();
    return;
  }

  console.log(`Found ${ga4Accounts.length} active Google Analytics account(s)\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const account of ga4Accounts) {
    console.log(`Syncing: ${account.propertyName} (ID: ${account.propertyId})`);
    console.log(`   Tenant: ${account.tenant.name}`);

    try {
      const result = await syncService.syncPlatformForTenant(
        AdPlatform.GOOGLE_ANALYTICS,
        account.tenantId,
      );

      console.log(`   Sync Result: ${result.success} success, ${result.failed} failed`);
      totalSuccess += result.success;
      totalFailed += result.failed;
    } catch (error: any) {
      console.log(`   Error: ${error.message}`);
      totalFailed++;
    }

    console.log();
  }

  console.log('Verifying synced data...\n');

  const totalRecords = await prisma.webAnalyticsDaily.count();
  console.log(`Total web_analytics_daily records: ${totalRecords}`);

  for (const account of ga4Accounts) {
    const recordCount = await prisma.webAnalyticsDaily.count({
      where: {
        tenantId: account.tenantId,
        propertyId: account.propertyId,
      },
    });

    const latestRecord = await prisma.webAnalyticsDaily.findFirst({
      where: {
        tenantId: account.tenantId,
        propertyId: account.propertyId,
      },
      orderBy: { date: 'desc' },
    });

    console.log(`\n${account.propertyName}:`);
    console.log(`  Records: ${recordCount}`);
    if (latestRecord) {
      console.log(`  Latest Date: ${latestRecord.date}`);
      console.log(`  Sessions: ${latestRecord.sessions}`);
      console.log(`  Users: ${latestRecord.activeUsers}`);
    }
  }

  console.log(`\nGA4 Sync Complete: ${totalSuccess} success, ${totalFailed} failed`);
  await app.close();

  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

bootstrap().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
