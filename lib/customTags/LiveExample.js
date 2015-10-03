var path = require('path');
var babel = require('babel-core');

/**
 * @param {Object} config
 *
 * @param {Function} config.resolveComponentName
 *        Callback to invoke when naming a component from its filepath. This
 *        name is what will be used at runtime to instantiate the component
 *        (and should be exposed to the global component registry.)
 *
 * @param {String} config.resolveComponentName.filePath
 *        The path of the file the component was defined in.
 *
 * @param {String} config.resolveComponentName.name
 *        The original name of the component that was parsed from the analyzer.
 *
 * @return {String} config.resolveComponentName
 *         The name to use instead.
 */
module.exports = function createLiveExampleTagProcessor(config) {
  var exports = {};
  var components = [];

  function compileSampleCode(code) {
    return babel.transform(code, {
      ast: false,
      comments: false,
      blacklist: ["useStrict"]
    }).code.replace(/;$/, '');
  }

  exports.definition = {
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
    }
  };

  exports.getComponents = function() {
    return components;
  };

  exports.trackComponent = function(filePath, componentName) {
    var name;

    if (config.resolveComponentName) {
      name = config.resolveComponentName(filePath, componentName);
    }
    else if (componentName) {
      name = componentName;
    }
    else {
      name = path.basename(filePath, '.js');

      // components/Something/index.js => "Something"
      if (name === 'index') {
        name = path.basename(path.dirname(filePath));
      }
    }

    components.push({ name: name, filePath: filePath });
  };

  return exports;
};