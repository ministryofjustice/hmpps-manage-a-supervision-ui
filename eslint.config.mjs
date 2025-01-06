import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['playwright-report/**', '.zap/**'],
    extraPathsAllowingDevDependencies: ['e2e_tests/**', 'playwright.config.ts'],
    extraFrontendGlobals: { $: 'readonly', MOJFrontend: 'readonly' },
  }),

  {
    name: 'overrides',
    files: ['**/*.ts'],
    ignores: ['**/*.js'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // TODO remove these overrides and fix the issues:
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'import/prefer-default-export': 0,
    },
  },
]
