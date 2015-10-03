const React = require('react');
const { string, arrayOf, shape } = React.PropTypes;
const PropType = require('../PropType');
const Radio = require('components/Radio');

const PTOneOf = React.createClass({
  statics: {
    containerTagName: 'div',
  },

  propTypes: {
    propType: shape({
      name: string,
      type: string,
      values: arrayOf(shape({
        type: string,
        value: string
      }))
    })
  },

  render() {
    return (
      <div className="react-editor__prop--oneOfType">
        {this.props.propType.values.map(this.renderEnumValue)}
      </div>
    );
  },

  renderEnumValue(propType) {
    return (
      <Radio
        key={propType.value}
        type="radio"
        onChange={this.choose}
        value={propType.value}
        checked={this.props.value === propType.value}
      >
        <code>{propType.value}</code>
      </Radio>
    );
  },

  choose(e) {
    this.props.onChange(this.props.path, e.target.value, {
      shouldReload: true
    });
  }
});

module.exports = PTOneOf;
