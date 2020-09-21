module.exports = {
  env: {
    es6: true,
  },
  globals: {
    window: true,
    module: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsdoc/recommended',
    'plugin:unicorn/recommended',
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/standard",
    "prettier/unicorn",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'es2020',
    project: './tsconfig.eslint.json',
    sourceType: 'script',
    // debugLevel: true,
    createDefaultProgram: true
  },
  rules: {
    'import/no-unresolved': 'off',
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
  },
  plugins: ['@typescript-eslint', 'jsdoc', 'import', 'prefer-arrow', 'unicorn'],
}