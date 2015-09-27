var TestUtils = require('tinydoc/plugins/cjs/Parser/TestUtils');
var nodeAnalyzer = require('./nodeAnalyzer');
var postProcessor = require('./postProcessor');

exports.parse = function(strGenerator) {
  return TestUtils.parseInline(strGenerator, {
    nodeAnalyzers: [ nodeAnalyzer ],
    postProcessors: [ postProcessor ],
  });
};