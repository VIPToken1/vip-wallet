module.exports = {
  root: true,
  extends: '@react-native-community',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }]
  }
};
