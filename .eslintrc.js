module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 11,
  },
  'rules': {
    'no-unused-vars': [
      'error', {
        'argsIgnorePattern': '_',
      },
    ],
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'comma-dangle': [
      'error', {
        'arrays': 'always',
        'objects': 'always',
      },
    ],
    'semi': [
      'error',
      'always',
    ],
  },
};
