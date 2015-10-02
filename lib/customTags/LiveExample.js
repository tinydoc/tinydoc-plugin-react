var path = require('path');
var babel = require('babel-core');

//
// var Config = Struct({
//   resolveComponentName: Struct.types.function
// });
//
module.exports = function(config) {
  var exports = {};
  var components = [];

  function trackComponent(filePath) {
    var fileName;

    if (config.resolveComponentName) {
      fileName = config.resolveComponentName(filePath);
    }
    else {
      fileName = path.basename(filePath, '.js');

      // components/Something/index.js => "Something"
      if (fileName === 'index') {
        fileName = path.basename(path.dirname(filePath));
      }
    }

    var isAlreadyTracked = components.some(function(entry) {
      return entry.filePath === filePath;
    });

    if (!isAlreadyTracked) {
      components.push({ name: fileName, filePath: filePath });
    }
  }

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

      trackComponent(filePath);
    }
  };

  exports.getComponents = function() {
    return components;
  };

  return exports;
};