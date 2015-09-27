var Styleguide = {};

function expose(name, module) {
  Styleguide[name] = window[name] = module;
}

expose('React', require('react'));

<% _.forEach(components, function(script) { %>
  expose('<%- script.name %>', require('<%- script.filePath %>'));
<% }); %>

module.exports = Styleguide;