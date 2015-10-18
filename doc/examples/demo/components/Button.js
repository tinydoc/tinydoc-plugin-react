const { func, bool, node } = React.PropTypes;

/**
 * A super button to push!
 *
 * @example {jsx}
 *
 *     <Button onClick={() => alert('You did not!')}>
 *       Push me!
 *     </Button>
 */
const Button = React.createClass({
  propTypes: {
    onClick: func,
    disabled: bool,
    children: node,
  },

  render() {
    return (
      <button type="button" {...this.props} />
    );
  }
});

export default Button;