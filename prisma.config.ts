import { config as dotenvConfig } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenvConfig({ path: '.env.local' });

if (!process.env.DATABASE_URL_UNPOOLED && process.env.DATABASE_POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_POSTGRES_URL_NON_POOLING;
}

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

function assertSameNeonTarget(): void {
  const pooledUrl = process.env.DATABASE_URL;
  const unpooledUrl = process.env.DATABASE_URL_UNPOOLED;

  if (!pooledUrl || !unpooledUrl) {
    return;
  }

  const pooledHost = normalizeNeonHost(pooledUrl, 'DATABASE_URL');
  const unpooledHost = normalizeNeonHost(unpooledUrl, 'DATABASE_URL_UNPOOLED');

  if (pooledHost !== unpooledHost) {
    throw new Error(
      `DATABASE_URL and DATABASE_URL_UNPOOLED must target the same Neon host (normalized). Received "${pooledHost}" and "${unpooledHost}".`
    );
  }
}

assertSameNeonTarget();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
