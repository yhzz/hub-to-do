var path = require('path');
const { override, disableChunk } = require('customize-cra');

module.exports = {
  webpack: function (config, env) {
    config.entry = {
      main: [path.resolve('src/index')],
      background_script: [path.resolve('src/background_script')],
    };
    config.output.filename = 'static/js/[name].js';
    config.module.rules[2].oneOf[0].options.limit = true;
    config.module.rules[2].oneOf[0].test.push(/\.svg$/);
    config.module.rules[2].oneOf[3].use[0] = {
      loader: require.resolve('style-loader'),
    };
    return override(disableChunk())(config, env);
  },
};
