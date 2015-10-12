var recast = require('recast');
var babel = require('babel-core');
var b = recast.types.builders;

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
  var childrenNode = args[2];

  if (childrenNode) {
    propNodes.push(b.property('init', b.identifier('children'), childrenNode));
  }

  var propsExpr = b.objectExpression(propNodes);

  return {
    name: args[0].name,
    props: recast.print(propsExpr).code
  };
};