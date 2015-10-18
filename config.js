window.CONFIG={"assetRoot":"/home/kandie/Workspace/Projects/tinydoc-plugin-react","title":"tinydoc React","metaDescription":"A documentation parser and generator.","motto":null,"favicon":null,"readme":{"filePath":"README.md","source":{"html":"<h1 class=\"markdown-text__heading anchorable-heading\" id=\"/readme\">\n  <span class=\"markdown-text__heading-title\">tinydoc-plugin-react</span>\n  <a href=\"#/readme\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h1><p>This plugin extends the core tinydoc&#39;s JS plugin with support for <a href=\"http://facebook.github.io/react\" target=\"_blank\">React</a> components both during the analysis phase and in the UI.</p>\n<h2 class=\"markdown-text__heading anchorable-heading\" id=\"/readme/features\">\n  <span class=\"markdown-text__heading-title\">Features</span>\n  <a href=\"#/readme/features\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h2><p>UI stuff:</p>\n<ul>\n<li>a real-time editor for previewing components and trying them out</li>\n<li>display pre-defined examples of your components that will be viewable at run-time in the UI by others, highlighting how to use the component and how it will look like.</li>\n</ul>\n<p>Core/analysis stuff:</p>\n<ul>\n<li>all <code>React.createClass</code> components will be marked as modules</li>\n<li>in-depth analysis of <code>propTypes</code></li>\n<li>understands <code>statics</code> so that tinydoc will be able to properly differentiate between instance and static methods in the UI</li>\n</ul>\n<h2 class=\"markdown-text__heading anchorable-heading\" id=\"/readme/installation\">\n  <span class=\"markdown-text__heading-title\">Installation</span>\n  <a href=\"#/readme/installation\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h2><pre><code>npm install -g tinydoc-plugin-react\n</code></pre><h2 class=\"markdown-text__heading anchorable-heading\" id=\"/readme/usage\">\n  <span class=\"markdown-text__heading-title\">Usage</span>\n  <a href=\"#/readme/usage\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h2><p>This plugin expects to be installed onto a tinydoc JS plugin so that it provides its sources with the React support:</p>\n<pre><code class=\"lang-javascript\">// @file tinydoc.conf.js\n\nvar jsPlugin = require(&#39;tinydoc/plugins/cjs&#39;)({\n  routeName: &#39;js&#39;,\n  source: [ &#39;lib/components/**/*.js&#39; ]\n});\n\nvar reactPlugin = require(&#39;tinydoc-plugin-react&#39;)({\n  routeName: &#39;js&#39; // &lt;- this must match the JS plugin&#39;s\n});\n\nconfig.plugins.push(jsPlugin);\nconfig.plugins.push(reactPlugin);\n</code></pre>\n<p>This gives you the flexibility to, for example, run this plugin only on a subset of JS files (your component files) and leave the rest of the codebase.</p>\n<p>Unfortunately, a bit more setup is required to make the examples show up. Please refer to the <a href=\"#/js/modules/Config\">config</a> page for more on tuning the plugin.</p>\n<h3 class=\"markdown-text__heading anchorable-heading\" id=\"/readme/compiling-your-component-files\">\n  <span class=\"markdown-text__heading-title\">Compiling your component files</span>\n  <a href=\"#/readme/compiling-your-component-files\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h3><p>If you need to pre-process your sources or produce a built file so that your components can be renderable at run-time, define the <code>compile</code> hook to do the work necessary. See the examples below for guidance.</p>\n<h4 class=\"markdown-text__heading anchorable-heading\" id=\"/readme/example-using-webpack-as-a-compiler\">\n  <span class=\"markdown-text__heading-title\">Example: using Webpack as a compiler</span>\n  <a href=\"#/readme/example-using-webpack-as-a-compiler\" class=\"markdown-text__heading-anchor icon icon-link\"></a>\n</h4><p>We&#39;ll write a lodash (or Handlebars, or whatever) template file that will require the component files and export them to the global with the correct names.</p>\n<p>The template receives a single parameter as described above:</p>\n<ul>\n<li><code>components</code> - <code>Array&lt;{ name: String, filePath: String }&gt;</code></li>\n</ul>\n<p>The template might look something like this:</p>\n<pre><code class=\"lang-javascript\">window.React = require(&#39;react&#39;);\n\n&lt;% _.forEach(components, function(component) { %&gt;\n  window[&#39;&lt;%- component.name %&gt;&#39;] = require(&#39;&lt;%- component.filePath %&gt;&#39;);\n&lt;% }); %&gt;\n</code></pre>\n<p>Now for configuring the plugin, we&#39;ll need to run webpack using its <a href=\"http://webpack.github.io/docs/node.js-api.html\" target=\"_blank\">node api</a> and give the <strong>absolute file path</strong> of the compiled bundle back to the plugin so it knows what to include at run-time.</p>\n<pre><code class=\"lang-javascript\">var _ = require(&#39;lodash&#39;);\nvar webpack = require(&#39;webpack&#39;);\n\n// our template file from above\nvar entryFileTemplate = _.template(\n  fs.readFileSync(path.resolve(__dirname,  &#39;reactPlugin.tmpl.js&#39;), &#39;utf-8&#39;)\n);\n\nvar reactPlugin = require(&#39;tinydoc-plugin-react&#39;)({\n  compile: function(compiler, components, done) {\n    var entryFileContents = entryFileTemplate({\n      components: components\n    });\n\n    // write it a temp file and we&#39;ll feed it to webpack as an entry\n    var entryFilePath = compiler.utils.writeTmpFile(entryFileContents);\n\n    // this is where webpack will write its stuff\n    var outputDir = compiler.utils.getTmpDir();\n    var outputFileName = &#39;my-react-components.js&#39;;\n\n    var webpackConfig = {\n      entry: entryFilePath,\n      output: {\n        path: outputDir,\n        filename: outputFileName,\n      }\n    };\n\n    webpack(webpackConfig, function(fatalError, stats) {\n      if (fatalError) {\n        return done(fatalError);\n      }\n\n      var jsonStats = stats.toJson();\n\n      if (jsonStats.errors.length &gt; 0) {\n        return done(jsonStats.errors);\n      }\n\n      done(null, path.join(outputDir, outputFileName));\n    });\n  }\n});\n</code></pre>\n","toc":[{"id":"/readme","scopedId":"tinydoc-plugin-react","level":1,"html":"tinydoc-plugin-react","text":"tinydoc-plugin-react"},{"id":"/readme/features","scopedId":"features","level":2,"html":"Features","text":"Features"},{"id":"/readme/installation","scopedId":"installation","level":2,"html":"Installation","text":"Installation"},{"id":"/readme/usage","scopedId":"usage","level":2,"html":"Usage","text":"Usage"},{"id":"/readme/compiling-your-component-files","scopedId":"compiling-your-component-files","level":3,"html":"Compiling your component files","text":"Compiling your component files"},{"id":"/readme/example-using-webpack-as-a-compiler","scopedId":"example-using-webpack-as-a-compiler","level":4,"html":"Example: using Webpack as a compiler","text":"Example: using Webpack as a compiler"}]}},"useHashLocation":true,"publicPath":"./","stylesheet":"doc/style.less","styleOverrides":null,"gitStats":false,"footer":"<p>Made with &#9829; using <a href=\"https://github.com/tinydoc\" target=\"_blank\">tinydoc</a>.</p>\n","hotness":{"count":1,"interval":"weeks"},"disqus":false,"launchExternalLinksInNewTabs":true,"showSettingsLinkInBanner":true,"layout":"single-page","tmpDir":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/.tinydoc","gitRepository":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/.git","pluginConfigs":{"cjs":[{"routeName":"js","navigationLabel":"API","source":["lib/**/*.js","ui/**/*.js"],"exclude":[{},{}],"gitStats":false,"useDirAsNamespace":true,"inferModuleIdFromFileName":true,"analyzeNode":null,"customTags":{},"showSourcePaths":false,"sortModulesAlphabetically":true,"database":[{"id":"assets","description":"","tags":[{"type":"property","string":"{String[]|Object[]}\n\nConvenience property for adding assets that will be picked up by tinydoc's\ncompiler. You should specfy any assets that your components and examples\nneed in order to render correctly.","typeInfo":{"types":["Array&lt;String&gt;","Array&lt;Object&gt;"],"name":"assets","description":"<p>Convenience property for adding assets that will be picked up by tinydoc&#39;s\ncompiler. You should specfy any assets that your components and examples\nneed in order to render correctly.</p>\n"}}],"ctx":{"type":"array","values":[],"symbol":"@"},"receiver":"Config","loc":{"start":{"line":21,"column":2},"end":{"line":21,"column":12}},"name":"assets","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@assets"},{"id":"styleSheets","description":"","tags":[{"type":"property","string":"{String[]}\n\nStylesheets to inject into the iframe.","typeInfo":{"types":["Array&lt;String&gt;"],"name":"styleSheets","description":"<p>Stylesheets to inject into the iframe.</p>\n"}}],"ctx":{"type":"array","values":[],"symbol":"@"},"receiver":"Config","loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":17}},"name":"styleSheets","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@styleSheets"},{"id":"scripts","description":"","tags":[{"type":"property","string":"{String[]}\n\nScripts to inject into the `<iframe />` that will run your examples.","typeInfo":{"types":["Array&lt;String&gt;"],"name":"scripts","description":"<p>Scripts to inject into the <code>&lt;iframe /&gt;</code> that will run your examples.</p>\n"}}],"ctx":{"type":"array","values":[],"symbol":"@"},"receiver":"Config","loc":{"start":{"line":35,"column":2},"end":{"line":35,"column":13}},"name":"scripts","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@scripts"},{"id":"compile","description":"","tags":[{"type":"property","string":"{Function}\n\nA callback to invoke when we have generated the list of components. This\nhook gives you the chance to build a bundle, for example, based on that\ncomponent list (files).\n\nYou need to use this if you pre-process your JavaScripts, like through\nwebpack or browserify etc.\n","typeInfo":{"types":["Function"],"name":"compile","description":"<p>A callback to invoke when we have generated the list of components. This\nhook gives you the chance to build a bundle, for example, based on that\ncomponent list (files).</p>\n<p>You need to use this if you pre-process your JavaScripts, like through\nwebpack or browserify etc.</p>\n"}},{"type":"param","string":"{Array<Object>} components\n       A list of all the components that have been scanned.\n","typeInfo":{"types":["Array&lt;Object&gt;"],"name":"components","description":"<p>A list of all the components that have been scanned.</p>\n"}},{"type":"param","string":"{String} components[].filePath\n       The absolute file path in which the component was defined.\n","typeInfo":{"isOptional":true,"types":["String"],"name":"components.filePath","description":"<p>The absolute file path in which the component was defined.</p>\n"}},{"type":"param","string":"{String} components[].name\n       The name of the component module; what might have been specified\n       in `displayName`, or as the variable name the component class was\n       assigned to, or even what the @module tag (if any) had specified.\n","typeInfo":{"isOptional":true,"types":["String"],"name":"components.name","description":"<p>The name of the component module; what might have been specified\nin <code>displayName</code>, or as the variable name the component class was\nassigned to, or even what the @module tag (if any) had specified.</p>\n"}},{"type":"param","string":"{Function} done\n       The callback you should invoke when you're done compiling.\n       This function accepts two parameters.\n","typeInfo":{"types":["Function"],"name":"done","description":"<p>The callback you should invoke when you&#39;re done compiling.\nThis function accepts two parameters.</p>\n"}},{"type":"param","string":"{Error|String} done.err\n       If the compilation failed, pass the error as the first argument to\n       done.","typeInfo":{"types":["Error","String"],"name":"done.err","description":"<p>If the compilation failed, pass the error as the first argument to\ndone.</p>\n"}}],"ctx":{"type":"literal","value":null,"symbol":"@"},"receiver":"Config","loc":{"start":{"line":67,"column":2},"end":{"line":67,"column":15}},"name":"compile","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@compile"},{"id":"frameWidth","description":"","tags":[{"type":"property","string":"{String|Number}\n\nHow wide in pixels the live-example iframe should be.\n\n> **NOTE**\n>\n> This can be overridden by the user if they manually resize the frame,\n> or if the @example tag has specified exact dimensions.","typeInfo":{"types":["String","Number"],"name":"frameWidth","description":"<p>How wide in pixels the live-example iframe should be.</p>\n<blockquote>\n<p><strong>NOTE</strong></p>\n<p>This can be overridden by the user if they manually resize the frame,\nor if the @example tag has specified exact dimensions.</p>\n</blockquote>\n"}}],"ctx":{"type":"literal","value":null,"symbol":"@"},"receiver":"Config","loc":{"start":{"line":79,"column":2},"end":{"line":79,"column":18}},"name":"frameWidth","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@frameWidth"},{"id":"frameHeight","description":"","tags":[{"type":"property","string":"{String|Number}\n\nHow high in pixels the live-example iframe should be.\n\n> **NOTE**\n>\n> This can be overridden by the user if they manually resize the frame,\n> or if the @example tag has specified exact dimensions.","typeInfo":{"types":["String","Number"],"name":"frameHeight","description":"<p>How high in pixels the live-example iframe should be.</p>\n<blockquote>\n<p><strong>NOTE</strong></p>\n<p>This can be overridden by the user if they manually resize the frame,\nor if the @example tag has specified exact dimensions.</p>\n</blockquote>\n"}}],"ctx":{"type":"literal","value":null,"symbol":"@"},"receiver":"Config","loc":{"start":{"line":91,"column":2},"end":{"line":91,"column":19}},"name":"frameHeight","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@frameHeight"},{"id":"autoResizeFrame","description":"","tags":[{"type":"property","string":"{Boolean}\n          Whether the example IFrame should be automatically resized based\n          on the dimensions of the component being rendered.","typeInfo":{"types":["Boolean"],"name":"autoResizeFrame","description":"<p>Whether the example IFrame should be automatically resized based\non the dimensions of the component being rendered.</p>\n"}}],"ctx":{"type":"literal","value":true,"symbol":"@"},"receiver":"Config","loc":{"start":{"line":98,"column":2},"end":{"line":98,"column":23}},"name":"autoResizeFrame","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":false,"aliases":[],"path":"Config@autoResizeFrame"},{"id":"Config","description":"","tags":[{"type":"module","string":"Config","typeInfo":{"name":null,"description":null,"isOptional":null,"defaultValue":null,"types":[]}},{"type":"preserveOrder","string":"","typeInfo":{"name":null,"description":null,"isOptional":null,"defaultValue":null,"types":[]}}],"ctx":{"type":"object","properties":[]},"loc":{"start":{"line":13,"column":0},"end":{"line":99,"column":2}},"name":"Config","filePath":"lib/index.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/lib/index.js","isModule":true,"aliases":[],"path":"Config"}]},{"routeName":"demo","navigationLabel":"Demo","source":["doc/examples/demo/components/*.js"],"exclude":null,"gitStats":false,"useDirAsNamespace":true,"inferModuleIdFromFileName":true,"analyzeNode":null,"customTags":{},"showSourcePaths":true,"sortModulesAlphabetically":true,"database":[{"id":"Button","description":"<p>A super button to push!</p>\n","tags":[{"type":"example","string":"<p>{jsx} \n    &lt;Button onClick={() =&gt; alert(&#39;You did not!&#39;)}&gt;\n      Push me!\n    &lt;/Button&gt;</p>\n","typeInfo":{"types":["jsx"],"name":null,"description":"<pre><code>&lt;Button onClick={() =&gt; alert(&#39;You did not!&#39;)}&gt;\n  Push me!\n&lt;/Button&gt;\n</code></pre>"},"alignment":"left","sourceCode":"    <Button onClick={() => alert('You did not!')}>\n      Push me!\n    </Button>","elementName":"Button","elementProps":"{\n    onClick: function() {\n        return alert(\"You did not!\");\n    },\n\n    children: \"Push me!\"\n}"}],"ctx":{"type":"component","propTypes":[{"type":"func","name":"onClick"},{"type":"bool","name":"disabled"},{"type":"node","name":"children"}],"statics":[]},"loc":{"start":{"line":12,"column":0},"end":{"line":24,"column":3}},"name":"Button","filePath":"Button.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/doc/examples/demo/components/Button.js","isModule":true,"aliases":[],"path":"Button","summary":"A super button to push!\n"},{"id":"color","description":"","tags":[{"type":"property","string":"{String}\n\nHex code to use as a background-color for the checkbox.","typeInfo":{"types":["String"],"name":"color","description":"<p>Hex code to use as a background-color for the checkbox.</p>\n"}}],"ctx":{"type":"unknown","symbol":"@"},"receiver":"Checkbox","loc":{"start":{"line":37,"column":4},"end":{"line":37,"column":17}},"name":"color","filePath":"Checkbox.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/doc/examples/demo/components/Checkbox.js","isModule":false,"aliases":[],"path":"Checkbox@color"},{"id":"onChange","description":"","tags":[{"type":"property","string":"{Function}\n\nA callback to invoke when the checkbox selection was modified.\n","typeInfo":{"types":["Function"],"name":"onChange","description":"<p>A callback to invoke when the checkbox selection was modified.</p>\n"}},{"type":"param","string":"{Event} e","typeInfo":{"types":["Event"],"name":"e","description":null}},{"type":"param","string":"{Boolean} e.target.checked\n       Whether the checkbox is now checked or not.","typeInfo":{"types":["Boolean"],"name":"e.target.checked","description":"<p>Whether the checkbox is now checked or not.</p>\n"}}],"ctx":{"type":"unknown","symbol":"@"},"receiver":"Checkbox","loc":{"start":{"line":53,"column":4},"end":{"line":53,"column":18}},"name":"onChange","filePath":"Checkbox.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/doc/examples/demo/components/Checkbox.js","isModule":false,"aliases":[],"path":"Checkbox@onChange"},{"id":"children","description":"","tags":[{"type":"property","string":"{*}\n\nThe actual textual content that will be checkable.","typeInfo":{"types":["*"],"name":"children","description":"<p>The actual textual content that will be checkable.</p>\n"}}],"ctx":{"type":"unknown","symbol":"@"},"receiver":"Checkbox","loc":{"start":{"line":60,"column":4},"end":{"line":60,"column":17}},"name":"children","filePath":"Checkbox.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/doc/examples/demo/components/Checkbox.js","isModule":false,"aliases":[],"path":"Checkbox@children"},{"id":"Checkbox","description":"<p>A simple controlled checkbox to check.</p>\n","tags":[{"type":"example","string":"<p>{jsx} \n    &lt;Checkbox value=&quot;1&quot;&gt;\n      Check me!\n    &lt;/Checkbox&gt;</p>\n","typeInfo":{"types":["jsx"],"name":null,"description":"<pre><code>&lt;Checkbox value=&quot;1&quot;&gt;\n  Check me!\n&lt;/Checkbox&gt;\n</code></pre>"},"alignment":"left","sourceCode":"    <Checkbox value=\"1\">\n      Check me!\n    </Checkbox>","elementName":"Checkbox","elementProps":"{\n    value: \"1\",\n    children: \"Check me!\"\n}"},{"type":"example","string":"<p>{jsx} \n    &lt;Checkbox value=&quot;1&quot; checked&gt;\n      I&#39;m checked!\n    &lt;/Checkbox&gt;</p>\n","typeInfo":{"types":["jsx"],"name":null,"description":"<pre><code>&lt;Checkbox value=&quot;1&quot; checked&gt;\n  I&#39;m checked!\n&lt;/Checkbox&gt;\n</code></pre>"},"alignment":"left","sourceCode":"    <Checkbox value=\"1\" checked>\n      I'm checked!\n    </Checkbox>","elementName":"Checkbox","elementProps":"{\n    value: \"1\",\n    checked: true,\n    children: \"I'm checked!\"\n}"}],"ctx":{"type":"component","propTypes":[{"type":"string","name":"className"},{"type":"string","name":"color"},{"type":"bool","name":"checked"},{"type":"oneOfType","types":[{"type":"string"},{"type":"number"}],"name":"value"},{"type":"bool","name":"disabled"},{"type":"func","name":"onChange"},{"type":"any","name":"children"}],"statics":[]},"loc":{"start":{"line":28,"column":0},"end":{"line":134,"column":3}},"name":"Checkbox","filePath":"Checkbox.js","absoluteFilePath":"/home/kandie/Workspace/Projects/tinydoc-plugin-react/doc/examples/demo/components/Checkbox.js","isModule":true,"aliases":[],"path":"Checkbox","summary":"A simple controlled checkbox to check.\n"}]}],"react":[{"routeName":"demo","frameWidth":null,"frameHeight":null,"autoResizeFrame":true,"scripts":["assets/node_modules/react/dist/react.min.js","assets/doc/compiled/assets/demo.js"],"styleSheets":[]}]},"pluginCount":2};