var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');
var createLiveExampleTagProcessor = require('./customTags/LiveExample');
var correctifyFunctionScopes = require('./postProcessors/correctifyFunctionScopes');
var trackComponentsWithoutLiveExamples = require('./postProcessors/trackComponentsWithoutLiveExamples');

/**
 * @module Config
 */
var defaults = {
  /**
   * @property {String[]|Object[]}
   *
   * Convenience property for adding assets that will be picked up by tinydoc's
   * compiler. You should specfy any assets that your components and examples
   * need in order to render correctly.
   */
  assets: [],

  /**
   * @property {String[]}
   *
   * Stylesheets to inject into the iframe.
   */
  styleSheets: [],

  /**
   * Scripts to inject into the `<iframe />` that will run your examples.
   */
  scripts: [],

  /**
   * @method compile
   *
   * A callback to invoke when we have generated the list of components. This
   * hook gives you the chance to build a bundle, for example, based on that
   * component list (files).
   *
   * You need to use this if you pre-process your JavaScripts, like through
   * webpack or browserify etc.
   *
   * @param {Array<Object>} components
   *        A list of all the components that have been scanned.
   *
   * @param {String} components[].filePath
   *        The absolute file path in which the component was defined.
   *
   * @param {String} components[].name
   *        The name of the component module; what might have been specified
   *        in `displayName`, or as the variable name the component class was
   *        assigned to, or even what the @module tag (if any) had specified.
   *
   * @param {Function} done
   *        The callback you should invoke when you're done compiling.
   *        This function accepts two parameters.
   *
   * @param {Error|String} done.err
   *        If the compilation failed, pass the error as the first argument to
   *        done.
   *
   * @param {String} done.filePath
   *        The **absolute** file path to the compiled script we should include
   *        at run-time.
   *
   */
  compile: null,

  frameWidth: null,
  frameHeight: null,

  /**
   * @property {Boolean}
   *           Whether the example IFrame should be automatically resized based
   *           on the dimensions of the component being rendered.
   */
  autoResizeFrame: true,
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
    cjsPlugin.addPostProcessor(function(database) {
      correctifyFunctionScopes(database);
      trackComponentsWithoutLiveExamples(database, liveExampleProcessor.trackComponent);
    });

    cjsPlugin.addTagProcessor(liveExampleProcessor.process);
  };

  exports.run = function(compiler) {
    var utils = compiler.utils;
    var runtimeConfig = {
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,

      scripts: config.scripts.map(function(path) {
        return compiler.utils.getPublicAssetPath(path);
      }),

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

      config.scripts.forEach(function(path) {
        compiler.assets.add(path);
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

          runtimeConfig.scripts.unshift(
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