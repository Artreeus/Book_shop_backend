import pkg from 'eslint';
const { defineConfig } = pkg;

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'], // Applies to JS, MJS, CJS, and TS files
    languageOptions: {
      globals: globals.browser, // Sets global context to "browser" environment
    },
    plugins: ['@typescript-eslint', 'prettier'], // Register plugins
    rules: {
      eqeqeq: 'off', // Disable eqeqeq rule
      'no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'no-undef': 'error',
      'no-console': 'warn',
      'prefer-const': [
        'error',
        {
          ignoreReadBeforeAssign: true, // Ignore read before assignment for prefer-const
        },
      ], // Enforce prefer-const rule

      // Prettier plugin integration
      'prettier/prettier': ['error', { 'endOfLine': 'auto' }],
    },
  },
  {
    // Use ESLint's built-in recommended rules for JavaScript
    ...pluginJs.configs.recommended,
  },
  {
    // Spread TypeScript ESLint recommended rules
    ...tseslint.configs.recommended,
  },
  {
    // Manually apply Prettier's recommended config as a set of rules
    rules: {
      'prettier/prettier': 'error', // Ensure Prettier integration is enabled
    },
  },
]);
