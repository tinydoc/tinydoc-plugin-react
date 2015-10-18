var babel = require('babel-core');
var fs = require('fs');
var path = require('path');

module.exports = function(config) {
  var jsPlugin = require('tinydoc/plugins/cjs')({
    navigationLabel: 'Example Babel-Transform',
    routeName: 'examples--babel-transform',

    source: [
      'doc/examples/babel-transform/index.js'
    ]
  });

  var reactPlugin = require('../../../lib')({
    routeName: 'examples--babel-transform',

    scripts: [
      'node_modules/react/dist/react.min.js',
      'doc/compiled/assets/example--babel-transform.js',
    ],

    compile: function(compiler, components, done) {
      var transformedCode = babel.transform(
        fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf-8')
      ).code;

      compiler.utils.writeAsset('assets/example--babel-transform.js', transformedCode);

      done();
    }
  });

  config.plugins.push(jsPlugin);
  config.plugins.push(reactPlugin);
};