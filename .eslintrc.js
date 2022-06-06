module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    project: ['tsconfig.json'],
    requireConfigFile: false,
  },
  plugins: ['jest', 'prettier', '@typescript-eslint'],
  extends: ['plugin:jest/recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error',
    'prefer-template': 'error',
    'no-constant-condition': 0,
    camelcase: 0,
    'jest/no-deprecated-functions': 0,
  },
};
