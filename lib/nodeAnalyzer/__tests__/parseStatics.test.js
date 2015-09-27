var assert = require('assert');
var TestUtils = require('../../TestUtils');

describe('analyzeReactNode - statics', function() {
  it('should find and track a static property', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    statics: {
      //      someFunction: function() {}
      //    }
      //  });
    });

    assert.equal(docs.length, 1);

    assert.equal(docs[0].ctx.statics.length, 1);
    assert.equal(docs[0].ctx.statics[0], 'someFunction');
  });
});
