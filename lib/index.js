var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var babel = require('babel-core');
var assert = require('assert');

var entryTmpl = _.template(
  fs.readFileSync(path.resolve(__dirname, 'styleguide.tmpl.js'), 'utf-8')
);

var defaults = {
  fileName: 'styleguide.js',
  assets: [],
  styleSheets: [],
};

function createReactPlugin(userConfig) {
  var exports = { name: 'ReactPlugin' };
  var entries = [];
  var config = _.extend({}, defaults, userConfig);

  function compileSampleCode(code) {
    return babel.transform(code, {
      ast: false,
      comments: false,
      blacklist: ["useStrict"]
    }).code.replace(/;$/, '');
  }

  function addComponent(filePath) {
    var fileName = path.basename(filePath, '.js');

    // components/Something/index.js => "Something"
    if (fileName === 'index') {
      fileName = path.basename(path.dirname(filePath));
    }

    var alreadyAdded = entries.some(function(entry) {
      return entry.filePath === filePath;
    });

    if (!alreadyAdded) {
      entries.push({
        name: fileName,
        filePath: filePath
      });
    }
  }

  exports.install = function(cjsPlugin) {
    assert(!!cjsPlugin && cjsPlugin.defineCustomTag instanceof Function,
      "You must pass an instance of the CJS plugin to extend with " +
      "@live_example support."
    );

    cjsPlugin.addNodeAnalyzer(require('./analyzeReactNode'));

    cjsPlugin.addDocstringProcessor(function(docstring) {

    });

    cjsPlugin.defineCustomTag('live_example', {
      withTypeInfo: true,
      attributes: [ 'exampleType', 'width', 'height', 'code' ],

      process: function(tag, filePath) {
        var lines = tag.string.split('\n');
        var firstLine = lines[0];
        var rawCode = lines.slice(1).filter(function(line) {
          return line.substr(0,4) === '    ';
        }).join('\n');

        tag.setCustomAttribute('exampleType', tag.typeInfo.types[0]);

        if (firstLine.match(/\s(\d+)x(\d+)\s/)) {
          tag.setCustomAttribute('width', RegExp.$1);
          tag.setCustomAttribute('height', RegExp.$2);
        }

        tag.setCustomAttribute('code', {
          source: rawCode,
          compiled: compileSampleCode(rawCode)
        });

        addComponent(filePath);
      }
    });
  };

  exports.run = function(compiler) {
    var utils = compiler.utils;

    compiler.on('write', function(done) {
      var ctx = {
        compiler: compiler,

        entries: entries,
        entryFilePath: utils.writeTmpFile(entryTmpl({ components: entries })),

        outputDir: utils.getOutputPath('plugins'),
        outputFileName: 'styleguide.js',

        globalName: 'Styleguide',
      };

      config.assets.forEach(function(asset) {
        compiler.assets.add(asset);
      });

      config.styleSheets.forEach(function(path) {
        compiler.assets.add(path);
      });

      compiler.assets.addInlinePluginScript(
        path.resolve(__dirname, '..', 'ui', 'index.js')
      );

      compiler.assets.addPluginRuntimeConfig('react', {
        scripts: [
          '/plugins/' + ctx.outputFileName
        ],

        styleSheets: config.styleSheets.map(function(href) {
          return utils.getPublicAssetPath(href);
        })
      });

      config.compile(ctx, function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });
  };

  if (config.targets) {
    config.targets.forEach(exports.install);
  }

  return exports;
}

module.exports = createReactPlugin;