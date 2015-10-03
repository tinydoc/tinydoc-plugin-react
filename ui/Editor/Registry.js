let typeRenderers = {};

exports.setRenderers = function(renderers) {
  typeRenderers = renderers;
};

exports.get = function(propTypeType) {
  return typeRenderers[propTypeType] || typeRenderers['*'];
};