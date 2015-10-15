const React = require("react");
const HighlightedText = require('components/HighlightedText');
const Button = require('components/Button');
const ExampleRunner = require('./ExampleRunner');
const IFrameCommunicator = require('./mixins/IFrameCommunicator');
const renderIntoIFrame = require('./utils/renderIntoIFrame');
const $ = require('jQueryUI');
const { debounce } = require('lodash');

const TAB_CODE = 'code';
const TAB_PREVIEW = 'preview';

const { shape, arrayOf, string, oneOf } = React.PropTypes;

const LiveExampleJSXTag = React.createClass({
  mixins: [
    IFrameCommunicator.createMixin(function(message) {
      switch (message.type) {
        case 'ready':
          const { tag } = this.props;

          IFrameCommunicator.postMessage(React.findDOMNode(this.refs.iframe), {
            type: 'render',
            payload: {
              elementName: tag.elementName,
              props: {
                eval: true,
                string: tag.elementProps
              }
            }
          });
          break;

        case 'updated':
          this.setState({ ready: true });
          break;

        case 'resize':
          if (this.props.config.autoResizeFrame) {
            this.setState({
              frameWidth: message.payload.width,
              frameHeight: message.payload.height,
            });
          }

          break;
      }
    })
  ],

  propTypes: {
    config: shape({
      scripts: arrayOf(string),
      styleSheets: arrayOf(string)
    }),

    tag: shape({
      width: string,
      height: string,
      alignment: oneOf([ 'left', 'centered', 'right' ]),

      code: shape({
        source: string.isRequired,
        compiled: string.isRequired,
      })
    }),
  },

  getInitialState() {
    return {
      activeTab: TAB_PREVIEW,
      ready: false,
      frameWidth: this.props.config.frameWidth || null,
      frameHeight: this.props.config.frameHeight || null,
      maximized: false,
    };
  },

  componentDidMount() {
    const { config } = this.props;

    renderIntoIFrame(
      <ExampleRunner
        scripts={config.scripts}
        styleSheets={config.styleSheets}
        messageSource={IFrameCommunicator.getUID(this)}
        origin={IFrameCommunicator.getOrigin()}
        alignment={this.props.tag.alignment || 'left'}
      />,
      React.findDOMNode(this.refs.iframe)
    );

    $(React.findDOMNode(this.refs.iframeContainer))
      .resizable({})
      .on('resize', this.maximizeFrame)
    ;
  },

  componentWillUnmount: function() {
    $(React.findDOMNode(this.refs.iframeContainer)).resizable('destroy');
  },

  render() {
    const { tag } = this.props;
    const { maximized } = this.state;

    return (
      <div className="live-example-tag">
        {this.renderControls()}

        {this.state.activeTab === TAB_CODE && (
          <HighlightedText unsafe>
            <pre>{tag.sourceCode.replace(/^[ ]{4}/gm, '')}</pre>
          </HighlightedText>
        )}

        <div
          ref="iframeContainer"
          className={`
            live-example-tag__iframe-container
            ${this.state.activeTab !== TAB_PREVIEW ?
              'live-example-tag__iframe-container--hidden' :
              ''
            }
          `}
        >
          {!this.state.ready && (
            <span className="loading-indicator">Loading...</span>
          )}

          <iframe
            ref="iframe"
            className="live-example-tag__iframe"
            style={{
              width: maximized ? '100%' : tag.width || this.state.frameWidth,
              height: maximized ? '100%' : tag.height || this.state.frameHeight,
            }}
          />
        </div>
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
  },

  maximizeFrame(e, ui) {
    if (!this.state.maximized) {
      this.setState({ maximized: true });
    }
  },
});

module.exports = LiveExampleJSXTag;