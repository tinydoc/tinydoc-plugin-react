const React = require('react');

module.exports = function(component, iframe) {
  const { document } = iframe.contentWindow;

  document.open();
  document.write(React.renderToStaticMarkup(component));
  document.close();
};