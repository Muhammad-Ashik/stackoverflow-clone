import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: './tsconfig.json',
    },
  },
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
      'no-template-curly-in-string': 0,
      'import/no-anonymous-default-export': 0,
      'no-console': 0,
      eqeqeq: ['error', 'always'],
      'jsx-a11y/anchor-is-valid': 0,
      'no-unreachable': 2,
      'no-var': 'error',
      'no-import-assign': 0,
      'no-prototype-builtins': 0,
      'object-curly-spacing': ['warn', 'always'],
      '@typescript-eslint/no-redeclare': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/explicit-member-accessibility': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-explicit-any': 2,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars-experimental': 'off',
      'no-control-regex': 0,
      'import/prefer-default-export': 'off',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
