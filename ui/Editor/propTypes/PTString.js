const React = require('react');
const PTString = React.createClass({
  render() {
    return (
      <input
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

module.exports = PTString;
