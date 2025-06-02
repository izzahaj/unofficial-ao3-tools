import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
      "@stylistic": stylistic,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@stylistic/indent": ["error", 2],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/brace-style": "error",
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
      "@stylistic/comma-style": ["error", "last"],
      "@stylistic/computed-property-spacing": ["error", "never"],
      "@stylistic/curly-newline": ["error", "always"],
      "@stylistic/function-call-spacing": ["error", "never"],
      "@stylistic/indent-binary-ops": ["error", 2],
      "@stylistic/jsx-closing-tag-location": ["error", "tag-aligned"],
      "@stylistic/jsx-equals-spacing": [2, "never"],
      "@stylistic/jsx-pascal-case": [
        2,
        { allowAllCaps: false, allowNamespace: false, allowLeadingUnderscore: false },
      ],
      "@stylistic/key-spacing": [
        "error",
        { "beforeColon": false, "afterColon": true, "mode": "strict" },
      ],
      "@stylistic/keyword-spacing": ["error", { "before": true, "after": true }],
      "@stylistic/max-len": [
        "error",
        {
          "code": 100,
          "ignoreUrls": false,
          "ignoreStrings": false,
          "ignoreComments": false,
          "ignoreTrailingComments": false,
        },
      ],
      "@stylistic/max-statements-per-line": ["error", { "max": 1 }],
      "@stylistic/member-delimiter-style": "error",
      "@stylistic/new-parens": "error",
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-multi-spaces": ["error"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-whitespace-before-property": "error",
      "@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
      "@stylistic/rest-spread-spacing": ["error"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/semi-spacing": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": "error",
      "@stylistic/space-in-parens": ["error", "never"],
      "@stylistic/spaced-comment": ["error", "always"],
      "@stylistic/switch-colon-spacing": "error",
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/type-generic-spacing": ["error"],
    },
  },
);
