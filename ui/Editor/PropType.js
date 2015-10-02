const React = require('react');
const { string, func, shape, any, bool } = React.PropTypes;
const Registry = require('./Registry');
const MarkdownText = require('components/MarkdownText');

const PropType = React.createClass({
  propTypes: {
    path: string,
    value: any,
    onChange: func.isRequired,
    getValue: func.isRequired,
    getDescription: func.isRequired,
    propType: shape({
      type: string.isRequired
    }).isRequired,

    withHeader: bool
  },

  getDefaultProps: function() {
    return {
      withHeader: true
    };
  },

  render() {
    const { propType } = this.props;
    const Component = Registry.get(propType.type);

    if (!Component) {
      return <span>Unsupported propType "{propType.type}"</span>;
    }

    const path = [ this.props.path, propType.name ].filter(v => !!v).join('.');
    const TagName = Component.containerTagName || 'label';
    const description = this.props.getDescription(path);

    return (
      <TagName key={path} className="react-editor__prop">
        {this.props.withHeader && (
          <div className="react-editor__prop-header">
            <strong>{propType.name}</strong>
            {' '}
            <code className="react-editor__prop-type">
              {propType.type}
            </code>
          </div>
        )}

        {description && (
          <MarkdownText>{description}</MarkdownText>
        )}

        <Component
          path={path}
          onChange={this.props.onChange}
          getValue={this.props.getValue}
          getDescription={this.props.getDescription}
          propType={propType}
          value={this.props.getValue(path)}
        />
      </TagName>
    );
  }
});

module.exports = PropType;
