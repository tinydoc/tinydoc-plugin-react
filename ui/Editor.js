const React = require('react');
const ExampleRunner = require('./ExampleRunner');
const get = require('lodash/object/get');
const set = require('lodash/object/set');
const { merge } = require('lodash');
const Button = require('components/Button');
const Checkbox = require('components/Checkbox');
const IFrameCommunicator = require('./mixins/IFrameCommunicator');
const renderIntoIFrame = require('./utils/renderIntoIFrame');
const PropType = require('./Editor/PropType');
const Registry = require('./Editor/Registry');

Registry.setRenderers(require('./Editor/propTypes'));

const Editor = React.createClass({
  mixins: [
    IFrameCommunicator.createMixin(function acceptChildMessage(message) {
      switch (message.type) {
        case 'ready':
          this.reloadExampleWithCurrentProps();
          break;

        case 'updated':
          this.dismissError();
          break;

        case 'error':
          this.displayError(message.payload);
          break;
      }
    })
  ],

  getInitialState: function() {
    return {
      props: {},
      frameWidth: '100%',
      frameHeight: '100%'
    };
  },

  componentDidMount() {
    renderIntoIFrame(
      <ExampleRunner
        scripts={this.props.config.scripts}
        styleSheets={this.props.config.styleSheets}
        messageSource={IFrameCommunicator.getUID(this)}
        origin={IFrameCommunicator.getOrigin()}
      />,
      React.findDOMNode(this.refs.iframe)
    );
  },

  render() {
    const moduleDoc = this.getModuleDoc();

    return (
      <div className="react-editor">
        <h2 className="react-editor__title">
          {moduleDoc.name}
        </h2>

        <Button
          onClick={this.props.onClose}
          className="react-editor__close-btn"
          children={"Close"}
        />

        <div className="react-editor__content">
          <div className="react-editor__component">
            {this.state.lastError && (
              this.renderError(this.state.lastError)
            )}

            <iframe
              ref="iframe"
              hidden={Boolean(this.state.lastError)}
              style={{
                height: this.state.frameHeight,
                width: this.state.frameWidth,
              }}
            />
          </div>

          {this.renderPropControls()}
        </div>
      </div>
    );
  },

  renderError(error) {
    return (
      <div className="react-editor__error-box">
        <header className="react-editor__error-header">
          Error
        </header>

        {error.context === 'react#render' && (
          <p>The following error was raised while rendering the component:</p>
        )}

        {error.context === 'eval' && (
          <p>
            An error was raised while evaluating the code you entered for the
            {' '}<code>{error.propName}</code> prop.
          </p>
        )}

        <pre className="react-editor__error-message">
          {error.message}
          {this.state.withStackTrace && error.stack}
        </pre>

        {!this.state.withStackTrace && error.stack && (
          <p>
            <a onClick={this.showStack}>Show stack trace</a>
          </p>
        )}

        <a onClick={this.dismissError}>Dismiss</a>
      </div>
    )
  },

  renderPropControls() {
    return (
      <form onSubmit={this.reloadExampleWithCurrentProps} className="react-editor__props">
        <fieldset>
          {false && <legend>Props</legend>}

          {this.getPropTypes().map((propType) => this.renderPropControl(propType))}
        </fieldset>

        <div>
          <input
            type="submit"
            className="btn react-editor__save-props-btn"
            onClick={this.reloadExampleWithCurrentProps}
            value="Update"
          />
        </div>
      </form>
    );
  },

  renderPropControl(propType) {
    return (
      <PropType
        propType={propType}
        onChange={this.setExampleProp}
        getValue={this.getExampleProp}
        getDescription={this.getPropDescription}
      />
    )
  },

  getModuleDoc() {
    return this.props.database.getModule(this.props.params.moduleId);
  },

  getPropTypes() {
    return this.getModuleDoc().ctx.propTypes;
  },

  updateStringProp(path, e) {
    this.setExampleProp(path, e.target.value);
  },

  updateBoolProp(path, e) {
    this.setExampleProp(path, e.target.checked);
    this.reloadExampleWithCurrentProps();
  },

  getExampleProp(path) {
    return get(this.state.props, path);
  },

  getPropDescription(path) {
    const moduleDocs = this.props.database.getModuleEntities(this.props.params.moduleId);
    const entityDoc = moduleDocs.filter(d => d.id === path)[0];

    if (entityDoc) {
      return entityDoc.description;
    }
  },

  setExampleProp(path, value, options = {}) {
    let newProps = {};

    set(newProps, path, value);

    this.setState({
      props: merge({}, this.state.props, newProps)
    }, () => {
      if (options.shouldReload) {
        this.reloadExampleWithCurrentProps();
      }
    });
  },

  reloadExampleWithCurrentProps(e) {
    if (e) {
      e.preventDefault();
    }

    IFrameCommunicator.postMessage(React.findDOMNode(this.refs.iframe), {
      elementName: this.getModuleDoc().name,
      props: this.state.props,
    });
  },

  displayError(error) {
    this.setState({
      lastError: error
    });
  },

  dismissError() {
    this.setState({ lastError: null, withStackTrace: false });
  },

  showStack() {
    this.setState({ withStackTrace: true });
  }
});

module.exports = Editor;
