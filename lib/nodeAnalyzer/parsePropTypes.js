var recast = require('recast');
var n = recast.types.namedTypes;

function parsePropTypes(node, filePath) {
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
        var typeInfo = extractPropInfo(propNode);

        if (!typeInfo.type) {
          console.warn('Unrecognized propType node of type "%s" (source: %s)',
            propNode.value ? propNode.value.type : propNode.node.type,
            filePath + ':' + propNode.loc.start.line
          );
        }

        typeInfo.name = propNode.key.name;

        propTypes.push(typeInfo);
      })
    }
  }

  return propTypes;
}

function extractPropInfo(node) {
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
    else if (n.Identifier.check(value.object) && n.Identifier.check(value.property)) {
      if (value.property.name === 'isRequired') {
        return { type: value.object.name, isRequired: true };
      }
      else {
        return { type: node.value.property.name };
      }
    }
    //    propTypes: {
    //      id: oneOfType([ number, string ]).isRequired
    //          ^^^^^^^^^                     ^^^^^^^^^^
    //    }
    else if (n.CallExpression.check(value.object) && n.Identifier.check(value.property)) {
      var typeInfo = parseCallExpression(value.object)

      if (value.property.name === 'isRequired') {
        typeInfo.isRequired = true;
      }

      return typeInfo;
    }
    else {
      return { type: node.value.property.name };
    }
  }
  // { name: React.PropTypes.oneOfType }
  else if (n.MemberExpression.check(node)) {
    return { type: node.property.name }; // TODO: isRequired support?
  }
  //    propTypes: {
  //      name: string
  //      ^^^^^ ^^^^^^
  //    }
  else if (n.Identifier.check(node.value)) {
    return { type: node.value.name };
  }
  //    propTypes: {
  //      name: oneOf()
  //            ^^^^^
  //    }
  else if (n.Identifier.check(node)) {
    return { type: node.name };
  }
  //    propTypes: {
  //      age: oneOf([ 1, 2 ])
  //                   ^
  //    }
  else if (n.Literal.check(node)) {
    return { type: 'literal', value: node.value };
  }
  //    propTypes: {
  //      name: function someNamedProp() {}
  //      ^^^^           ^^^^^^^^^^^^^
  //    }
  else if (n.FunctionExpression.check(node.value) && n.Identifier.check(node.value.id)) {
    return { type: node.value.id.name };
  }
  //    propTypes: {
  //      name: function() {}
  //      ^^^^
  //    }
  else if (n.FunctionExpression.check(node.value) || n.ArrowFunctionExpression.check(node.value)) {
    return { type: 'custom' };
  }
  //    propTypes: {
  //      count: oneOfType([ number, string ])
  //      // or
  //      count: shape({})
  //      // etc.
  //    }
  else if (n.CallExpression.check(node.value)) {
    return parseCallExpression(node.value);
  }
  else if (n.ArrayExpression.check(node)) {
    return node.elements.map(extractPropInfo);
  }
  else if (n.ObjectExpression.check(node)) {
    return node.properties.map(function(propNode) {
      var info = extractPropInfo(propNode);
      info.name = propNode.key.name;
      return info;
    });
  }

  return {};
}

function parseCallExpression(expr) {
  var modifier = extractPropInfo(expr.callee);
  var elements = expr.arguments.map(extractPropInfo);

  if (modifier.type === 'shape') {
    return {
      type: modifier.type,
      properties: elements[0]
    };
  }
  else if (modifier.type === 'instanceOf') {
    return {
      type: modifier.type,
      target: elements[0]
    };
  }
  else if (modifier.type === 'oneOfType') {
    return {
      type: modifier.type,
      types: elements[0],
    };
  }
  else if (modifier.type === 'arrayOf') {
    return {
      type: modifier.type,
      types: elements,
    };
  }
  else if (modifier.type === 'oneOf') {
    return {
      type: modifier.type,
      values: elements[0]
    }
  }
  else {
    return {};
  }
}

module.exports = parsePropTypes;
