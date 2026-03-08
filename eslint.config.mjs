import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']],
          pathGroups: [
            { pattern: '@domain/**', group: 'internal', position: 'after' },
            { pattern: '@persistence/**', group: 'internal', position: 'after' },
            { pattern: '@lib/**', group: 'internal', position: 'after' },
            { pattern: '@/*', group: 'internal', position: 'after' },
          ],
          distinctGroup: false,
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
          named: true,
          warnOnUnassignedImports: true,
          sortTypesGroup: true,
        },
      ],
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
