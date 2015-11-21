# tinydoc-plugin-react

This plugin extends [tinydoc's JS plugin](https://github.com/tinydoc/tinydoc-plugin-js) with support for [React](http://facebook.github.io/react) components both during the analysis phase and in the UI.

A demo can be [seen here](http://tinydoc.github.io/tinydoc-plugin-react/). Make sure you try out the real-time editor by clicking on the `Try it!` link for component modules.

## Features

UI stuff:

- a real-time editor for previewing components and trying them out
- display pre-defined examples of your components that will be viewable at run-time in the UI by others, highlighting how to use the component and how it will look like.

Core/analysis stuff:

- all `React.createClass` components will be marked as modules
- in-depth analysis of `propTypes`
- understands `statics` so that tinydoc will be able to properly differentiate between instance and static methods in the UI

## Installation

```
npm install tinydoc tinydoc-plugin-js tinydoc-plugin-react
```

## Usage

This plugin expects to be installed onto a tinydoc JS plugin so that it provides its sources with the React support:

```javascript
// @file tinydoc.conf.js

var jsPlugin = require('tinydoc-plugins-js')({
  routeName: 'js',
  source: [ 'lib/components/**/*.js' ]
});

var reactPlugin = require('tinydoc-plugin-react')({
  routeName: 'js' // <- this must match the JS plugin's
});

config.plugins.push(jsPlugin);
config.plugins.push(reactPlugin);
```

This gives you the flexibility to, for example, run this plugin only on a subset of JS files (your component files) and leave the rest of the codebase.

Unfortunately, a bit more setup is required to make the examples show up. Please refer to the [Config config]() page for more on tuning the plugin.

There are examples under `doc/examples` that show how to use a transformer if you need one (like webpack, browserify, etc.)

### Compiling your component files

If you need to pre-process your sources or produce a built file so that your components can be renderable at run-time, define the `compile` hook to do the work necessary. See the examples below for guidance.

#### Example: using Webpack as a compiler

We'll write a lodash (or Handlebars, or whatever) template file that will require the component files and export them to the global with the correct names.

The template receives a single parameter as described above:

- `components` - `Array<{ name: String, filePath: String }>`

The template might look something like this:

```javascript
window.React = require('react');

<% _.forEach(components, function(component) { %>
  window['<%- component.name %>'] = require('<%- component.filePath %>');
<% }); %>
```

Now for configuring the plugin, we'll need to run webpack using its [node api](http://webpack.github.io/docs/node.js-api.html) and give the **absolute file path** of the compiled bundle back to the plugin so it knows what to include at run-time.

```javascript
var _ = require('lodash');
var webpack = require('webpack');

// our template file from above
var entryFileTemplate = _.template(
  fs.readFileSync(path.resolve(__dirname,  'reactPlugin.tmpl.js'), 'utf-8')
);

var reactPlugin = require('tinydoc-plugin-react')({
  compile: function(compiler, components, done) {
    var entryFileContents = entryFileTemplate({
      components: components
    });

    // write it a temp file and we'll feed it to webpack as an entry
    var entryFilePath = compiler.utils.writeTmpFile(entryFileContents);

    // this is where webpack will write its stuff
    var outputDir = compiler.utils.getTmpDir();
    var outputFileName = 'my-react-components.js';

    var webpackConfig = {
      entry: entryFilePath,
      output: {
        path: outputDir,
        filename: outputFileName,
      }
    };

    webpack(webpackConfig, function(fatalError, stats) {
      if (fatalError) {
        return done(fatalError);
      }

      var jsonStats = stats.toJson();

      if (jsonStats.errors.length > 0) {
        return done(jsonStats.errors);
      }

      done(null, path.join(outputDir, outputFileName));
    });
  }
});
```