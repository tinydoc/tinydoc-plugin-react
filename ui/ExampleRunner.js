const React = require('react');
const { arrayOf, string } = React.PropTypes;

const ExampleRunner = React.createClass({
  propTypes: {
    styleSheets: arrayOf(string),
    scripts: arrayOf(string),
    code: string,
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
        </head>

        <body>
          <p>Loading...</p>

          {this.props.scripts.map(this.renderScript)}

          <script
            dangerouslySetInnerHTML={{
              __html: `React.render(${this.props.code}, document.body);`
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