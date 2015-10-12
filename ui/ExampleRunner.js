const React = require('react');
const { template } = require('lodash');
const contentScript = template(require('raw!./contentScript.tmpl.js'));
const { arrayOf, string } = React.PropTypes;

const ExampleRunner = React.createClass({
  propTypes: {
    styleSheets: arrayOf(string),
    scripts: arrayOf(string),
    code: string,
    messageSource: string,
  },

  componentDidMount() {
    console.assert(window.top !== window,
      "ExampleRunner must run inside an <iframe />"
    );
  },

  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />

          {this.props.styleSheets.map(this.renderStyleSheet)}

          <script
            dangerouslySetInnerHTML={{
              __html: 'window.ReactBrowser = {};'
            }}
          />

          {this.props.scripts.map(this.renderScript)}
        </head>

        <body>
          <div id="example" style={{ padding: '1em' }} />

          <script
            dangerouslySetInnerHTML={{
              __html: contentScript({
                origin: this.props.origin,
                code: this.props.code,
                contentBoxSelector: '#example',
                messageSource: this.props.messageSource,
              })
            }}
          />
        </body>
      </html>
    )
  },

  renderStyleSheet(href) {
    return <link key={href} rel="stylesheet" href={href} />;
  },

  renderScript(src) {
    return <script key={src} src={src} />
  },
});

module.exports = ExampleRunner;