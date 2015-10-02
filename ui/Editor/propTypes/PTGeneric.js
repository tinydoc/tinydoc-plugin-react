const React = require('react');
const Checkbox = require('components/Checkbox');

const PTGeneric = React.createClass({
  statics: {
    containerTagName: 'div'
  },

  getDefaultProps() {
    return {
      value: { code: '', eval: false }
    };
  },

  render() {
    const { value } = this.props;

    return (
      <div>
        <textarea
          ref="inputWidget"
          className="form-input"
          onChange={this.emitChangeOfText}
          value={value.code}
        />

        <Checkbox
          value="string"
          checked={!!value.eval}
          children="Evaluate as JavaScript"
          onChange={this.emitChangeOfEval}
        />
      </div>
    );
  },

  emitChangeOfText(e) {
    this.emitChange(e.target.value, this.props.value.eval);
  },

  emitChange(text, shouldEval) {
    this.props.onChange(this.props.path, {
      eval: shouldEval,
      code: text
    });
  },

  emitChangeOfEval(e) {
    this.emitChange(this.props.value.code, e.target.checked);
  }
});

module.exports = PTGeneric;
