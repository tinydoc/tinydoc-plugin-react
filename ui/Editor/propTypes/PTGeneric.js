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
    return (
      <div>
        <textarea
          ref="inputWidget"
          className="form-input"
          onChange={this.emitChangeOfText}
          value={this.getCode()}
        />

        <Checkbox
          value="string"
          checked={this.getEval()}
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
    const { value } = this.props;

    if (value && typeof value === 'object') {
      return value.code;
    }
    else {
      return value;
    }
  },

  getEval() {
    const { value } = this.props;

    if (value && typeof value === 'object') {
      return value.eval;
    }
    else {
      return false;
    }
  }
});

module.exports = PTGeneric;
