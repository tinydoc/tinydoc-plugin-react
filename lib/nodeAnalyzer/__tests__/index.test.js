var assert = require('assert');
var TestUtils = require('../../TestUtils');

describe('analyzeReactNode', function() {
  it('should mark a component', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.type, 'component');
  });
});
