var assert = require('assert');
var TestUtils = require('../../TestUtils');

describe('analyzeReactNode - propTypes', function() {
  it('works with "name: React.PropTypes.string"', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: React.PropTypes.string
      //    }
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
  });

  it('works with "name: React.PropTypes.string.isRequired"', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: React.PropTypes.string.isRequired
      //    }
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
    assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
  });

  it('works with "name: string"', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: string
      //    }
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
  });

  it('works with "name: function() {}"', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: function() {}
      //    }
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'custom');
  });

  it('works with "name: function someNamedValidator() {}"', function() {
    var docs = TestUtils.parse(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: function someNamedValidator() {}
      //    }
      //  });
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'someNamedValidator');
  });
});