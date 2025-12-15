import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', '**/*.d.ts'],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  // Browser environment for public folder
  {
    files: ['src/public/**/*.js'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'script',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          bracketSameLine: false,
          bracketSpacing: true,
          semi: true,
          experimentalTernaries: false,
          singleQuote: true,
          jsxSingleQuote: false,
          quoteProps: 'as-needed',
          trailingComma: 'all',
          singleAttributePerLine: false,
          htmlWhitespaceSensitivity: 'css',
          vueIndentScriptAndStyle: false,
          proseWrap: 'preserve',
          insertPragma: false,
          printWidth: 80,
          requirePragma: false,
          tabWidth: 2,
          useTabs: false,
          embeddedLanguageFormatting: 'auto',
        },
      ],
      'no-template-curly-in-string': 'off',
      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      'no-unreachable': 'error',
      'no-var': 'error',
      'no-import-assign': 'off',
      'no-prototype-builtins': 'off',
      'object-curly-spacing': ['warn', 'always'],
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
