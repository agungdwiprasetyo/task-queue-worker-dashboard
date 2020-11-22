const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const nextConfig = {
  // your config

  // webpack config
  webpack(config, _options) {
    config.resolve.alias['@pages'] = path.join(__dirname, 'pages');

    // Returns environment variables as an object
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});
    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  },
};

module.exports = nextConfig;
