const React = require('react');
const PropType = require('../PropType');

const PTShape = React.createClass({
  statics: {
    containerTagName: 'div',
  },

  render() {
    return (
      <div className="react-editor__prop--shape">
        {this.props.propType.properties.map((propType) => {
          return (
            <PropType
              key={propType.name}
              path={this.props.path}
              onChange={this.props.onChange}
              getValue={this.props.getValue}
              getDescription={this.props.getDescription}
              propType={propType}
            />
          );
        })}
      </div>
    );
  }
});

module.exports = PTShape;
