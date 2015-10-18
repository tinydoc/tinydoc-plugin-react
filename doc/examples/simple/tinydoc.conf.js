module.exports = function(config) {
  var jsPlugin = require('tinydoc/plugins/cjs')({
    navigationLabel: 'Simple Example',
    routeName: 'examples--simple',

    source: [
      'doc/examples/simple/index.js'
    ]
  });

  var reactPlugin = require('../../../lib')({
    targets: [ jsPlugin ],
    routeName: 'examples--simple',

    scripts: [
      'node_modules/react/dist/react.min.js',
      'doc/examples/simple/index.js',
    ]
  });

  config.plugins.push(jsPlugin);
  config.plugins.push(reactPlugin);
};