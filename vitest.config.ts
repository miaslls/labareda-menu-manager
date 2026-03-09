import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

const config = {
  resolve: {
    alias: {
      '@': rootDir,
      '@lib': path.resolve(rootDir, 'app/lib'),
      '@domain': path.resolve(rootDir, 'app/lib/domain'),
      '@persistence': path.resolve(rootDir, 'app/lib/persistence'),
    },
  },
  test: {
    environment: 'node',
    include: ['app/lib/**/__tests__/**/*.test.ts', 'app/lib/**/__tests__/**/*.spec.ts'],
  },
};

export default config;
