/** @type {import('eslint').Linter.Config} */
export default {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "error",
  },
  env: {
    node: true, // Enable Node.js global variables
    es6: true,  // Enable ES6 syntax
  },
  globals: {
    ...globals.node,
    ...globals.es2021,
  },
};
