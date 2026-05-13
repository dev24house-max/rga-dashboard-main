import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantId = process.argv[2];

  if (!tenantId) {
    throw new Error('Usage: npx ts-node scratch/check-ga4-token-status.ts <tenantId>');
  }

  const accounts = await prisma.googleAnalyticsAccount.findMany({
    where: { tenantId },
    select: {
      id: true,
      propertyId: true,
      propertyName: true,
      status: true,
      accessToken: true,
      refreshToken: true,
      tokenExpiresAt: true,
      lastSyncAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  console.log(
    JSON.stringify(
      accounts.map((account) => ({
        id: account.id,
        propertyId: account.propertyId,
        propertyName: account.propertyName,
        status: account.status,
        hasAccessToken: !!account.accessToken,
        accessTokenLen: account.accessToken?.length ?? 0,
        hasRefreshToken: !!account.refreshToken,
        refreshTokenLen: account.refreshToken?.length ?? 0,
        tokenExpiresAt: account.tokenExpiresAt,
        lastSyncAt: account.lastSyncAt,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
      null,
      2,
    ),
  );

  const webAnalyticsRows = await prisma.webAnalyticsDaily.count({
    where: { tenantId },
  });
  const latest = await prisma.webAnalyticsDaily.findFirst({
    where: { tenantId },
    orderBy: { date: 'desc' },
    select: {
      propertyId: true,
      date: true,
      activeUsers: true,
      sessions: true,
      screenPageViews: true,
      isMockData: true,
    },
  });

  console.log(JSON.stringify({ webAnalyticsRows, latest }, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
