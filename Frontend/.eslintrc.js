module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: 'module', // Allows using import/export statements
    ecmaFeatures: {
      jsx: true, // Enable JSX since we're using React
      tsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the react version
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  env: {
    es2021: true,
    browser: true, // Enables browser globals like window and document
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true, // Enables Node.js global variables and Node.js scoping.
  },
  plugins: ['simple-import-sort'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Make this the last element so prettier config overrides other formatting rules
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/jsx-runtime',
  ],
  globals: {
    JSX: true,
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/no-named-as-default': 0,
    'simple-import-sort/imports': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
