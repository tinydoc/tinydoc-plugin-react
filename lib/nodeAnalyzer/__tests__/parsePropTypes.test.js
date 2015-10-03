var assert = require('assert');
var TestUtils = require('../../TestUtils');

describe('analyzeReactNode - propTypes', function() {
  describe('string and primitives', function() {
    it('works with "name: React.PropTypes.string"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
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
        // /** @module */
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
        // /** @module */
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

    it('works with "name: string.isRequired"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: string.isRequired
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'string');
    });
  });

  describe('custom validators', function() {
    it('works with "name: function() {}"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
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

    it('works with "name: () => {}"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: () => {}
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
        // /** @module */
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

  describe('oneOfType', function() {
    it('works with "name: oneOfType([ string, number ])"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: React.PropTypes.oneOfType([
        //        React.PropTypes.number,
        //        React.PropTypes.string
        //      ])
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'oneOfType');
      assert.deepEqual(docs[0].ctx.propTypes[0].types, [
        { type: 'number' },
        { type: 'string' },
      ]);
    });

    it('works with "name: oneOfType([ string, number ]).isRequired"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: oneOfType([
        //        number,
        //        string
        //      ]).isRequired
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'oneOfType');
      assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
      assert.deepEqual(docs[0].ctx.propTypes[0].types, [
        { type: 'number' },
        { type: 'string' },
      ]);
    });
  });

  describe('oneOf', function() {
    it('works with "oneOf([ "a", 1 ])"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: React.PropTypes.oneOf([
        //        "a",
        //        1
        //      ])
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'oneOf');
      assert.equal(docs[0].ctx.propTypes[0].values[0].value, 'a');
      assert.equal(docs[0].ctx.propTypes[0].values[1].value, 1);
    });

    it('works with "oneOf([ "a", 1 ]).isRequired"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: oneOf([ "a", 1 ]).isRequired
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'oneOf');
      assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
    });
  });

  describe('shape', function() {
    it('works with "object: shape({ name: string, age: number })"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      object: shape({
        //        name: string,
        //        age: number
        //      })
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'object');
      assert.equal(docs[0].ctx.propTypes[0].type, 'shape');
      assert.equal(docs[0].ctx.propTypes[0].properties.length, 2);
      assert.equal(docs[0].ctx.propTypes[0].properties[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].properties[0].type, 'string');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].name, 'age');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].type, 'number');
    });

    it('works with nested shapes', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      person: React.PropTypes.shape({
        //        name: string,
        //        locale: shape({
        //          country: string,
        //          isoCode: React.PropTypes.string,
        //        })
        //      })
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'person');
      assert.equal(docs[0].ctx.propTypes[0].type, 'shape');
      assert.equal(docs[0].ctx.propTypes[0].properties.length, 2);
      assert.equal(docs[0].ctx.propTypes[0].properties[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].properties[0].type, 'string');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].name, 'locale');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].type, 'shape');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].properties.length, 2);
      assert.equal(docs[0].ctx.propTypes[0].properties[1].properties[0].name, 'country');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].properties[0].type, 'string');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].properties[1].name, 'isoCode');
      assert.equal(docs[0].ctx.propTypes[0].properties[1].properties[1].type, 'string');
    });
  });

  describe('arrayOf', function() {
    it('works with "arrayOf(string)"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: arrayOf(string)
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'arrayOf');
      assert.equal(docs[0].ctx.propTypes[0].types.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].types[0].type, 'string');
    });

    it('works with "arrayOf(string).isRequired"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: arrayOf(string).isRequired
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'arrayOf');
      assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
    });
  });

  describe('instanceOf', function() {
    it('works with "instanceOf(Date)"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: React.PropTypes.instanceOf(Date)
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'instanceOf');
      assert.equal(docs[0].ctx.propTypes[0].target.type, 'Date');
    });

    it('works with "instanceOf(Date).isRequired"', function() {
      var docs = TestUtils.parse(function() {
        // /** @module */
        //  var Something = React.createClass({
        //    propTypes: {
        //      name: instanceOf(Date).isRequired
        //    }
        //  });
      });

      assert.equal(docs.length, 1);
      assert.equal(docs[0].ctx.propTypes.length, 1);
      assert.equal(docs[0].ctx.propTypes[0].name, 'name');
      assert.equal(docs[0].ctx.propTypes[0].type, 'instanceOf');
      assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
    });
  });

});