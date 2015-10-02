const React = require('react');
const PTNumber = React.createClass({
  render() {
    return (
      <input
        type="number"
        className="form-input"
        onChange={this.emitChange}
        value={this.props.value}
      />
    );
  },

  emitChange(e) {
    this.props.onChange(this.props.path, e.target.value);
  }
});

module.exports = PTNumber;
