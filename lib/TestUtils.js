var TestUtils = require('tinydoc/plugins/cjs/Parser/TestUtils');
var nodeAnalyzer = require('./nodeAnalyzer');
var correctifyFunctionScopes = require('./postProcessors/correctifyFunctionScopes');

exports.parse = function(strGenerator) {
  return TestUtils.parseInline(strGenerator, {
    nodeAnalyzers: [ nodeAnalyzer ],
    postProcessors: [ correctifyFunctionScopes ],
  });
};