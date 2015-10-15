var recast = require('recast');
var babel = require('babel-core');
var b = recast.types.builders;
var n = recast.types.namedTypes;

module.exports = function(srcCode) {
  var compiled = babel.transform(srcCode, {
    comments: false,
    code: false,
    ast: true,
    blacklist: ["useStrict"],
  });

  // args are what's passed to React.createElement():
  //
  // 1. {string} name
  // 2. {object} props
  // 3. {any} [children]
  //
  //     React.createElement(Button, { title: 'foo' }, 'Click me');
  var args = compiled.ast.program.body[0].expression.arguments;

  var propNodes = [].concat(args[1].properties || []);

  if (args.length > 2) {
    var children = args.slice(2);

    propNodes.push(
      b.property(
        'init',
        b.identifier('children'),
        children.length === 1 ? children[0] : b.arrayExpression(children)
      )
    );
  }

  var propsExpr = b.objectExpression(propNodes);
  var name;

  if (n.Identifier.check(args[0])) {
    name = args[0].name;
  }
  else if (n.Literal.check(args[0])) {
    name = args[0].value;
  }

  return {
    name: name,
    props: recast.print(propsExpr).code
  };
};