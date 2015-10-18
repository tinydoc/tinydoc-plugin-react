var path = require('path');
var config = {
  assetRoot: path.resolve(__dirname, '..'),

  title: 'tinydoc React',
  outputDir: 'doc/compiled',
  readme: 'README.md',
  useHashLocation: true,
  publicPath: '',
  disqus: false,
  layout: 'single-page',
};

config.plugins = [
  require('tinydoc/plugins/cjs')({
    navigationLabel: 'API',

    source: [
      'lib/**/*.js',
      'ui/**/*.js',
    ],

    exclude: [
      /\.test\.js$/,
      /\.tmpl\.js$/
    ],

    showSourcePaths: false
  })
];

module.exports = config;