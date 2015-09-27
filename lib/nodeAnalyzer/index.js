var parsePropTypes = require('./parsePropTypes');
var parseStatics = require('./parseStatics');

function analyzeReactNode(n, node, path, nodeInfo) {
  if (n.VariableDeclaration.check(node)) {
    var decl = node.declarations[0];

    if (n.CallExpression.check(decl.init) && n.MemberExpression.check(decl.init.callee)) {
      var callee = decl.init.callee;

      if (callee.object.name === 'React' && callee.property.name === 'createClass') {
        var componentTypeDefinition = node.declarations[0].init.arguments[0];

        nodeInfo.setContext({
          type: 'component',
          propTypes: parsePropTypes(componentTypeDefinition),
          statics: parseStatics(componentTypeDefinition)
        });
      }
    }
  }
}

module.exports = analyzeReactNode;