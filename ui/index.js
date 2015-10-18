const React = require('react');
const Router = require('core/Router');
const Editor = require('./Editor');
const LiveExampleTag = require('./LiveExampleTag');
const OutletManager = require('core/OutletManager');

tinydoc.use(function ReactPlugin(api) {
  tinydoc.getRuntimeConfigs('react').forEach(function(config) {
    OutletManager.add('CJS::ExampleTag', {
      key: 'jsx-example-tag',

      match: function(tag) {
        return tag.typeInfo.types[0] === 'jsx';
      },

      component: React.createClass({
        render() {
          return <LiveExampleTag tag={this.props} config={config} />;
        }
      })
    });

    OutletManager.add('CJS::ModuleHeader::Type', {
      key: 'react-component-type',

      match: function(props) {
        return props.doc.ctx.type === 'component';
      },

      component: React.createClass({
        render() {
          return (
            <span>
              <span>Component</span>
              {' '}
              <a onClick={this.toggleEditor}>Try it!</a>
            </span>
          );
        },

        toggleEditor() {
          Router.updateQuery({
            editing: Router.getQueryItem('editing') ? null : 1
          });
        }
      })
    });

    OutletManager.add('CJS::ModuleBody', {
      key: 'jsx-editor',

      component: React.createClass({
        render() {
          if (this.props.query.editing) {
            return (
              <Editor
                config={config}
                onClose={this.close}
                {...this.props}
              />
            );
          }
          else {
            return null;
          }
        },

        close() {
          Router.updateQuery({ editing: null });
        }
      })
    });
  });
});
