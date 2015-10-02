const React = require('react');
const Router = require('core/Router');
const Editor = require('./Editor');

require('./css/index.less');

tinydoc.use(function ReactPlugin(api) {
  tinydoc.getRuntimeConfigs('react').forEach(function(config) {
    api.registerOutletElement('CJS::Tag', {
      component: require('./LiveExamples')(config),
      position: {
        after: 'CJS::ExampleTags'
      }
    });

    api.registerOutletElement('CJS::ModuleHeader::Type', {
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

    api.registerOutletElement('CJS::ContentPanel', {
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
