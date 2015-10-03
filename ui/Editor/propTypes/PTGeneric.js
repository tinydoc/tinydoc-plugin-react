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
    const value = this.props.value || {};

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
    this.emitChange(e.target.value, this.getEval());
  },

  emitChange(text, shouldEval) {
    if (!text || !text.length) {
      this.props.onChange(this.props.path, undefined);
    }
    else {
      this.props.onChange(this.props.path, {
        eval: shouldEval,
        code: text
      });
    }
  },

  emitChangeOfEval(e) {
    this.emitChange(this.getCode(), e.target.checked);
  },

  getCode() {
    return this.props.value && this.props.value.code;
  },

  getEval() {
    return this.props.value && this.props.value.eval;
  }
});

module.exports = PTGeneric;
