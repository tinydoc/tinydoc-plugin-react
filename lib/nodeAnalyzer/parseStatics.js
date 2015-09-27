var recast = require('recast');
var n = recast.types.namedTypes;

function parseStatics(node) {
  var statics = [];

  var staticsNode = node.properties.filter(function(propNode) {
    return (
      n.Property.check(propNode) &&
      n.Identifier.check(propNode.key) &&
      propNode.key.name === 'statics'
    );
  })[0];

  if (staticsNode) {
    if (n.ObjectExpression.check(staticsNode.value)) {
      staticsNode.value.properties.forEach(function(staticNode) {
        statics.push(staticNode.key.name);
      })
    }
  }

  return statics;
}

module.exports = parseStatics;