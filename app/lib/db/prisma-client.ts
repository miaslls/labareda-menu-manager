import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function normalizeNeonHost(rawUrl: string, envVarName: string): string {
  let hostname: string;

  try {
    hostname = new URL(rawUrl).hostname.toLowerCase();
  } catch {
    throw new Error(`${envVarName} must be a valid URL.`);
  }

  const [firstLabel, ...rest] = hostname.split('.');

  if (!firstLabel || rest.length === 0) {
    return hostname;
  }

  const normalizedFirstLabel = firstLabel.endsWith('-pooler')
    ? firstLabel.slice(0, -'-pooler'.length)
    : firstLabel;

  return [normalizedFirstLabel, ...rest].join('.');
}

function assertSameNeonTarget(pooledUrl: string, unpooledUrl: string): void {
  const pooledHost = normalizeNeonHost(pooledUrl, 'DATABASE_URL');
  const unpooledHost = normalizeNeonHost(unpooledUrl, 'DATABASE_URL_UNPOOLED');

  if (pooledHost !== unpooledHost) {
    throw new Error(
      `DATABASE_URL and DATABASE_URL_UNPOOLED must target the same Neon host (normalized). Received "${pooledHost}" and "${unpooledHost}".`
    );
  }
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const unpooledConnectionString =
    process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  if (!unpooledConnectionString) {
    throw new Error('DATABASE_URL_UNPOOLED (or DATABASE_POSTGRES_URL_NON_POOLING) is not set.');
  }

  assertSameNeonTarget(connectionString, unpooledConnectionString);

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const prisma = createPrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}
