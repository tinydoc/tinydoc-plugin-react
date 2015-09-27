var Utils = require('tinydoc/plugins/cjs/Parser/Utils');
var recast = require('recast');
var n = recast.types.namedTypes;

function analyzeReactNode(n, node, path, nodeInfo) {
  var expr = node.expression;

  console.log(node.type)
  if (n.VariableDeclaration.check(node)) {
    var decl = node.declarations[0];

    if (n.CallExpression.check(decl.init) && n.MemberExpression.check(decl.init.callee)) {
      var callee = decl.init.callee;

      if (callee.object.name === 'React' && callee.property.name === 'createClass') {
        var propTypes = parsePropTypes(node.declarations[0].init.arguments[0]);

        nodeInfo.setContext({
          type: 'component',
          propTypes: propTypes
        });
      }
    }
  }
  else if (isPropTypes(node)) {
    console.log('Found propTypes:', propTypesScope);
  }
}

function isPropTypes(node) {
  console.log(node.type)
  return (
    n.MemberExpression.check(node) &&
    n.Identifier.check(node.left) &&
    node.left.id === 'propTypes'
  );
}

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
        // console.log(propNode)
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
    console.log(node.value)

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

module.exports = analyzeReactNode;