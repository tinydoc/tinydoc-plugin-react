const Button = React.createClass({
  render() {
    return (
      <button type="button" {...this.props} />
    );
  }
});

/**
 * @module
 * @example {jsx}
 *
 *     <Root />
 */
const Root = React.createClass({
  render() {
    return (
      <div>
        <Button onClick={this.alertWasClicked}>Click me!</Button>
      </div>
    );
  },

  alertWasClicked() {
    alert("you didn't!");
  }
});

window.Button = Button;
window.Root = Root;