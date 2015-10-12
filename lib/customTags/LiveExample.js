var path = require('path');
var parseNameAndProps = require('./LiveExample/parseNameAndProps')

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

  exports.process = function(tag, filePath) {
    if (tag.typeInfo.types[0] !== 'jsx') {
      return;
    }

    var lines = tag.string.split('\n');
    var sourceCode = lines.filter(function(line) {
      return line.match(/[ ]{4,}/);
    }).join('\n');

    if (tag.typeInfo.name && tag.typeInfo.name.match(/(\d+)x(\d+)/)) {
      tag.width = RegExp.$1;
      tag.height = RegExp.$2;
    }

    var elementInfo = parseNameAndProps(sourceCode);

    tag.sourceCode = sourceCode;
    tag.elementName = elementInfo.name;
    tag.elementProps = elementInfo.props;
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