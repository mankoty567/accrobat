module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ['mocha'],
  extends: ['eslint:recommended', 'prettier', 'plugin:mocha/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'no-unused-vars': 'warn',
    'mocha/no-exports': 'never',
  },
};
