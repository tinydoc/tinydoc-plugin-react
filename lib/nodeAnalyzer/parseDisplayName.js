var n = require('recast').types.namedTypes;

module.exports = function(node) {
  var displayNameNode = node.properties.filter(function(p) {
    return n.Identifier.check(p.key) && p.key.name === 'displayName';
  })[0];


  if (displayNameNode && n.Literal.check(displayNameNode.value)) {
    return displayNameNode.value.value;
  }
}