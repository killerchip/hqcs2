module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'babel-plugin-transform-typescript-metadata',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~app': './app',
            '~assets': './assets',
            '~config': './src/config',
            '~domains': './src/domains',
            '~gateways': './src/gateways',
            '~testHelpers': './src/testHelpers',
            '~react': './src/react',
          },
        },
      ],
    ],
  };
};
