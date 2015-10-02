const React = require('react');
const LiveExampleJSXTag = require('./LiveExampleTag');

module.exports = function createLiveExamples(config) {
  return React.createClass({
    displayName: 'LiveExamples',

    render() {
      const tags = this.props.tags.filter(function(tag) {
        return tag.type === 'live_example' && tag.exampleType === 'jsx';
      });

      if (!tags.length) {
        return null
      }

      return (
        <div>
          {tags.map(this.renderTag)}
        </div>
      );
    },

    renderTag(tag) {
      return (
        <LiveExampleJSXTag key={tag.string} config={config} tag={tag} />
      );
    }
  });
};
