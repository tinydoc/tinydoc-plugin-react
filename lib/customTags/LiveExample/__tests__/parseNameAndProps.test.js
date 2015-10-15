var assert = require('assert');
var parseProps = require('../parseNameAndProps');
var TestUtils = require('tinydoc/lib/TestUtils');

function parse(strGenerator) {
  return parseProps(TestUtils.getInlineString(strGenerator));
}

describe('LiveExample::parseNameAndProps', function() {
  it('works with no props', function() {
    var info = parse(function() {
      // <Button />
    });

    assert.equal(info.name, 'Button');
    assert.equal(info.props, '{}');
  });

  it('works with a regular React.DOM component', function() {
    var info = parse(function() {
      // <div />
    });

    assert.equal(info.name, 'div');
    assert.equal(info.props, '{}');
  });

  it('works with a prop', function() {
    var info = parse(function() {
      // <Button title="Click me" />
    });


    assert.equal(info.name, 'Button');
    assert.ok(info.props.match('title: "Click me"'));
  });

  it('works with children', function() {
    var info = parse(function() {
      // <Button>Click me</Button>
    });

    assert.equal(info.name, 'Button');
    assert.ok(info.props.match('children: "Click me"'));
  });

  it('works with multiple children', function() {
    var info = parse(function() {
      // <Button>
      //   <span>Click</span>
      //   <span>me</span>
      // </Button>
    });

    assert.equal(info.name, 'Button');
    assert.ok(info.props.match('children: \\[\\s+React.createElement\\("span"'));
  });

  it('works with a function prop', function() {
    var info = parse(function() {
      // <Button onChange={() => console.log("hi")} />
    });

    assert.equal(info.name, 'Button');
    assert.ok(info.props.match('onChange: function'));
  });
});