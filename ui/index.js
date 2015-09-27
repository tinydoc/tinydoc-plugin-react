const React = require('react');

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
          return <span>Component</span>;
        }
      })
    });
  });
});
