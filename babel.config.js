module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@constants/*': './src/constants/',
          '@hooks/*': './src/hooks/',
          '@navigation/*': './src/navigation/',
          '@services': './src/services',
          '@utils': './src/utils',
          '@types/*': './src/types'
        }
      }
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin'
  ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};
