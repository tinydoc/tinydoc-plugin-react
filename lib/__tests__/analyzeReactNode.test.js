var assert = require('assert');
var analyzeReactNode = require('../analyzeReactNode');
var findWhere = require('lodash').findWhere;
var TestUtils = require('tinydoc/plugins/cjs/Parser/TestUtils');
var K = require('tinydoc/plugins/cjs/Parser/constants');

var parseInline = TestUtils.parseInline;

describe('analyzeReactNode', function() {
  it('should mark a component', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.type, 'component');
  });
});

describe('analyzeReactNode - propTypes', function() {
  it('works with "name: React.PropTypes.string"', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: React.PropTypes.string
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
  });

  it('works with "name: React.PropTypes.string.isRequired"', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: React.PropTypes.string.isRequired
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
    assert.equal(docs[0].ctx.propTypes[0].isRequired, true);
  });

  it('works with "name: string"', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: string
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'string');
  });

  it('works with "name: function() {}"', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: function() {}
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'custom');
  });

  it('works with "name: function someNamedValidator() {}"', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    propTypes: {
      //      name: function someNamedValidator() {}
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);
    assert.equal(docs[0].ctx.propTypes.length, 1);
    assert.equal(docs[0].ctx.propTypes[0].name, 'name');
    assert.equal(docs[0].ctx.propTypes[0].type, 'someNamedValidator');
  });
});

describe.skip('analyzeReactNode - statics', function() {
  it('should mark a component', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    statics: {
      //      someFunction: function() {}
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 1);

    assert.equal(docs[0].ctx.statics.length, 1);
  });
});

describe.skip('analyzeReactNode - methods', function() {
  it('should mark a component', function() {
    var docs = parseInline(function() {
      // /** @module Some component. */
      //  var Something = React.createClass({
      //    /** Do something. */
      //    someMethod() {
      //    }
      //  });
    }, {
      nodeAnalyzers: [ analyzeReactNode ]
    });

    assert.equal(docs.length, 2);

    var doc = findWhere(docs, { id: 'someMethod' });

    assert.equal(doc.ctx.type, 'function');
    assert.equal(doc.ctx.scope, K.SCOPE_INSTANCE);
  });
});
