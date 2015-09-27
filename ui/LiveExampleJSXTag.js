const React = require("react");
const MarkdownText = require('components/MarkdownText');
const Button = require('components/Button');
const ExampleRunner = require('./ExampleRunner');

const TAB_CODE = 'code';
const TAB_PREVIEW = 'preview';

const { shape, arrayOf, string } = React.PropTypes;

const LiveExampleJSXTag = React.createClass({
  propTypes: {
    config: shape({
      scripts: arrayOf(string),
      styleSheets: arrayOf(string)
    }),

    tag: shape({
      width: string,
      height: string,

      code: shape({
        source: string.isRequired,
        compiled: string.isRequired,
      })
    }),
  },

  getInitialState: function() {
    return {
      activeTab: TAB_PREVIEW
    };
  },

  componentDidMount: function() {
    const { config } = this.props;
    const iframe = React.findDOMNode(this.refs.iframe);
    const { document } = iframe.contentWindow;

    // this could be made better if we want an interactive session
    document.open();
    document.write(
      React.renderToStaticMarkup(
        <ExampleRunner
          scripts={config.scripts}
          styleSheets={config.styleSheets}
          code={this.props.tag.code.compiled}
        />
      )
    );
    document.close();
  },

  render() {
    const { tag } = this.props;

    return (
      <div className="live-example-tag">
        {this.renderControls()}

        {this.state.activeTab === TAB_CODE && (
          <MarkdownText>
            {[
              '```js',
              tag.code.source.replace(/[ ]{4}/g, ''),
              '```'
            ].join('\n')}
          </MarkdownText>
        )}

        <iframe
          ref="iframe"
          className="live-example-tag__iframe"
          style={{
            display: this.state.activeTab === TAB_PREVIEW ? 'block' : 'none',
            width: tag.width || 'auto',
            height: tag.height || 'auto',
          }}
        />
      </div>
    );
  },

  renderControls() {
    const { activeTab } = this.state;

    return (
      <div className="live-example-tag__controls">
        <Button
          onClick={() => this.setState({ activeTab: TAB_CODE })}
          disabled={activeTab === TAB_CODE}
          className={activeTab === TAB_CODE ? 'active' : undefined}
          children="View Code"
        />

        {' '}

        <Button
          onClick={() => this.setState({ activeTab: TAB_PREVIEW })}
          disabled={activeTab === TAB_PREVIEW}
          className={activeTab === TAB_PREVIEW ? 'active' : undefined}
          children="Run"
        />
      </div>
    );
  }
});

module.exports = LiveExampleJSXTag;