import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: "./tsconfig.json",
    },
  },
  {
    rules: {},
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
