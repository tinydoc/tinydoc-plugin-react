const React = require('react');
const { string, arrayOf, shape } = React.PropTypes;
const PropType = require('../PropType');
const Radio = require('components/Radio');

const PTOneOfType = React.createClass({
  statics: {
    containerTagName: 'div',
  },

  propTypes: {
    propType: shape({
      name: string,
      type: string,
      types: arrayOf(shape({
        name: string,
        type: string
      }))
    })
  },

  getInitialState: function() {
    return {
      activeType: null
    };
  },

  render() {
    const { activeType } = this.state;
    const { propType } = this.props;

    return (
      <div className="react-editor__prop--oneOfType">
        {propType.types.map(this.renderPropTypeOption)}
        {activeType && (
          this.renderPropType(
            propType.types.filter(propType => propType.type === activeType)[0]
          )
        )}
      </div>
    );
  },

  renderPropTypeOption(propType) {
    return (
      <Radio
        key={propType.type}
        type="radio"
        onChange={this.chooseType}
        value={propType.type}
        checked={this.state.activeType === propType.type}
      >
        <code>{propType.type}</code>
      </Radio>
    );
  },

  renderPropType(propType) {
    return (
      <PropType
        key={propType.name}
        path={this.props.path}
        getValue={this.props.getValue}
        getDescription={this.props.getDescription}
        onChange={this.props.onChange}
        propType={propType}
        withHeader={false}
      />
    );
  },

  chooseType(e) {
    this.setState({ activeType: e.target.value });
  }
});

module.exports = PTOneOfType;
