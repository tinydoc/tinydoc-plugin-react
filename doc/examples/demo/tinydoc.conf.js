var path = require('path');
var webpack = require('webpack');

var jsPlugin = require('tinydoc/plugins/cjs')({
  navigationLabel: 'Demo',
  routeName: 'demo',

  source: [
    'doc/examples/demo/components/*.js',
  ]
});

var reactPlugin = require('../../../lib')({
  routeName: 'demo',

  scripts: [
    'node_modules/react/dist/react.js',
    'doc/compiled/assets/demo.js',
  ],

  compile: function(compiler, _components, done) {
    webpack({
      entry: path.resolve(__dirname, 'index.js'),
      output: {
        filename: 'demo.js',
        path: compiler.utils.getOutputPath('assets')
      },

      module: {
        loaders: [{ test: /\.js$/, loader: 'babel-loader' }]
      }
    }, done);
  }
});

module.exports = function(config) {
  config.plugins.push(jsPlugin);
  config.plugins.push(reactPlugin);
};