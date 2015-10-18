function assign(src, target) {
  return Object.keys(src).concat(Object.keys(target)).reduce(function(out, key) {
    out[key] = target[key] || src[key];
    return out;
  }, {});
}

var Button = React.createClass({
  render: function() {
    return (
      React.createElement('button', assign({
        type: "button"
      }, this.props))
    );
  }
});

/**
 * @module
 * @example {jsx}
 *
 *     <Root />
 */
var Root = React.createClass({
  render: function() {
    return (
      React.createElement('div', {
        children: (
          React.createElement(Button, {
            onClick: this.alertWasClicked,
            children: 'Click me!'
          })
        )
      })
    );
  },

  alertWasClicked: function() {
    alert("you didn't!");
  }
});

window.Button = Button;
window.Root = Root;