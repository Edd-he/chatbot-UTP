// eslint.config.mjs
import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import pluginNext from '@next/eslint-plugin-next'
import globals from 'globals'
export default [
  {
    ...js.configs.recommended,
    files: ['**/*.{js,ts,jsx,tsx}'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        fetch:'readonly',
        Headers:'readonly',
        console: 'readonly',
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      import: pluginImport,
      prettier: pluginPrettier,
      next: pluginNext,
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-unused-vars': ['error'],
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-undef': 'error',
      'no-empty': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
]
