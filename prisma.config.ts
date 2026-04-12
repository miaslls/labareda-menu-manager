import { config as dotenvConfig } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenvConfig({ path: '.env.local' });

if (!process.env.DATABASE_URL_UNPOOLED && process.env.DATABASE_POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_POSTGRES_URL_NON_POOLING;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
