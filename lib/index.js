var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var assert = require('assert');
var createLiveExampleTagProcessor = require('./customTags/LiveExample');
var correctifyFunctionScopes = require('./postProcessors/correctifyFunctionScopes');
var trackComponentsWithoutLiveExamples = require('./postProcessors/trackComponentsWithoutLiveExamples');

/**
 * @module Config
 * @preserveOrder
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
   * @property {String[]}
   *
   * Scripts to inject into the `<iframe />` that will run your examples.
   */
  scripts: [],

  /**
   * @property {Function}
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
   */
  compile: null,

  /**
   * @property {String|Number}
   *
   * How wide in pixels the live-example iframe should be.
   *
   * > **NOTE**
   * >
   * > This can be overridden by the user if they manually resize the frame,
   * > or if the @example tag has specified exact dimensions.
   */
  frameWidth: null,

  /**
   * @property {String|Number}
   *
   * How high in pixels the live-example iframe should be.
   *
   * > **NOTE**
   * >
   * > This can be overridden by the user if they manually resize the frame,
   * > or if the @example tag has specified exact dimensions.
   */
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
  var routeName = config.routeName;

  var liveExampleProcessor = createLiveExampleTagProcessor({
    resolveComponentName: config.resolveComponentName
  });

  assert(typeof config.routeName === 'string');

  function install(cjsPlugin) {
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
  }

  exports.run = function(compiler) {
    var utils = compiler.utils;
    var cjsPlugin = compiler.config.plugins.filter(function(plugin) {
      return plugin.routeName === routeName;
    })[0];

    assert(cjsPlugin);

    install(cjsPlugin);

    var runtimeConfig = {
      routeName: routeName,

      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
      autoResizeFrame: config.autoResizeFrame,

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

      compiler.assets.addPluginScript(
        path.resolve(__dirname, '..', 'dist', 'tinydoc-plugin-react-ui.js')
      );

      compiler.assets.addStyleSheet(
        path.resolve(__dirname, '..', 'ui', 'css', 'index.less')
      );

      if (config.compile) {
        config.compile(compiler, liveExampleProcessor.getComponents(), function(err, filePath) {
          if (err) {
            return done(err);
          }

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

  return exports;
}


module.exports = createReactPlugin;