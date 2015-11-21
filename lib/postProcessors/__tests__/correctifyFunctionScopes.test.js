var assert = require('assert');
var TestUtils = require('../../TestUtils');
var K = require('tinydoc-plugin-js/lib/Parser/constants');
var findWhere = require('lodash').findWhere;

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

  it('should correctify the scope of documented static methods', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    statics: {
      //      /** Foo */
      //      someFunction: function() {}
      //    }
      //  });
    });

    assert.equal(docs.length, 2);

    var doc = findWhere(docs, { name: 'someFunction' });

    assert.equal(doc.ctx.scope, K.SCOPE_UNDEFINED);
  });
});

describe('analyzeReactNode - methods', function() {
  it('should correctify the scope of an instance method', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    /** Do something. */
      //    someMethod() {
      //    }
      //  });
    });

    assert.equal(docs.length, 2);

    var doc = findWhere(docs, { id: 'someMethod' });

    assert.equal(doc.ctx.type, 'function');
    assert.equal(doc.ctx.scope, K.SCOPE_INSTANCE);
  });
});
