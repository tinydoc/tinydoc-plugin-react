var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');
var createLiveExampleTagProcessor = require('./customTags/LiveExample');

var defaults = {
  fileName: 'styleguide.js',

  assets: [],

  /**
   * Stylesheets to inject into the iframe.
   * @type {Array}
   */
  styleSheets: [],

  /**
   * Scripts to inject into the iframe.
   */
  scripts: []
};

function createReactPlugin(userConfig) {
  var exports = { name: 'ReactPlugin' };
  var config = _.extend({}, defaults, userConfig);
  var liveExampleProcessor = createLiveExampleTagProcessor({
    resolveComponentName: config.resolveComponentName
  });

  exports.install = function(cjsPlugin) {
    assert(!!cjsPlugin && cjsPlugin.defineCustomTag instanceof Function,
      "You must pass an instance of the CJS plugin to extend with " +
      "@live_example support."
    );

    cjsPlugin.addNodeAnalyzer(require('./nodeAnalyzer'));
    cjsPlugin.addPostProcessor(require('./postProcessor'));
    cjsPlugin.defineCustomTag('live_example', liveExampleProcessor.definition);
  };

  exports.run = function(compiler) {
    var utils = compiler.utils;
    var runtimeConfig = {
      scripts: config.scripts,
      styleSheets: config.styleSheets.map(function(href) {
        return utils.getPublicAssetPath(href);
      })
    };

    compiler.on('write', function(done) {
      config.assets.forEach(function(asset) {
        compiler.assets.add(asset);
      });

      config.styleSheets.forEach(function(href) {
        compiler.assets.add(href);
      });

      compiler.assets.addInlinePluginScript(
        path.resolve(__dirname, '..', 'ui', 'index.js')
      );

      if (config.compile) {
        config.compile(compiler, liveExampleProcessor.getComponents(), function(err, filePath) {
          if (err) {
            return done(err);
          }

          var fileName = path.basename(filePath);

          assert(fs.existsSync(filePath));

          compiler.assets.add(filePath, path.join('assets', 'react', fileName));

          runtimeConfig.scripts.push(
            compiler.utils.getPublicAssetPath('react', fileName)
          );

          saveRuntimeConfigAndFinish();
        });
      }
      else {
        saveRuntimeConfigAndFinish();
      }

      function saveRuntimeConfigAndFinish() {
        compiler.assets.addPluginRuntimeConfig('react', runtimeConfig);
        done();
      }
    });
  };

  if (config.targets) {
    config.targets.forEach(exports.install);
  }

  return exports;
}


module.exports = createReactPlugin;