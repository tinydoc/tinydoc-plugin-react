var path = require('path');
var config = {
  assetRoot: path.resolve(__dirname, '..'),

  title: 'tinydoc React',
  outputDir: 'doc/compiled',
  readme: 'README.md',
  disqus: false,
  layout: 'single-page',
  stylesheet: 'doc/style.less',
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
  }),
];

require('./examples/demo/tinydoc.conf.js')(config);

module.exports = config;