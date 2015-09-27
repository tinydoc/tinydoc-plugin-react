var recast = require('recast');
var n = recast.types.namedTypes;

function parsePropTypes(node) {
  var propTypes = [];
  var propTypesNode = node.properties.filter(function(propNode) {
    return (
      n.Property.check(propNode) &&
      n.Identifier.check(propNode.key) &&
      propNode.key.name === 'propTypes'
    );
  })[0];

  if (propTypesNode) {
    if (n.ObjectExpression.check(propTypesNode.value)) {
      propTypesNode.value.properties.forEach(function(propNode) {
        var propType = extractPropTypeValidator(propNode);

        propTypes.push({
          name: propNode.key.name,
          type: propType.type,
          isRequired: Boolean(propType.isRequired)
        });
      })
    }
  }

  return propTypes;
}

function extractPropTypeValidator(node) {
  var value = node.value;

  if (n.MemberExpression.check(node.value)) {
    //     propTypes: {
    //       name: React.PropTypes.string.isRequired
    //       ^^^^                  ^^^^^^ ^^^^^^^^^^
    //     }
    if (n.MemberExpression.check(value.object) && n.Identifier.check(value.property) && value.property.name === 'isRequired') {
      return { type: value.object.property.name, isRequired: true };
    }

    //    propTypes: {
    //      name: React.PropTypes.string
    //      ^^^^                  ^^^^^^
    //    }
    else {
      return { type: node.value.property.name };
    }
  }

  //    propTypes: {
  //      name: string
  //      ^^^^^ ^^^^^^
  //    }
  else if (n.Identifier.check(node.value)) {
    return { type: node.value.name };
  }
  //    propTypes: {
  //      name: function() {}
  //      ^^^^
  //    }
  else if (n.FunctionExpression.check(node.value)) {
    //    propTypes: {
    //      name: function someNamedProp() {}
    //      ^^^^           ^^^^^^^^^^^^^
    //    }
    if (n.Identifier.check(node.value.id)) {
      return { type: node.value.id.name };
    }
    else {
      return { type: 'custom' };
    }
  }
}

module.exports = parsePropTypes;
