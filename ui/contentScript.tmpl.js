var contentBox;
var origin = "<%- origin %>";

var defaultHooks = {
  start: function(container, done) {
    done();
  },

  render: function(type, props, container, done) {
    React.render(React.createElement(type, props), container, done);
  },

  stop: function(container) {
    React.unmountComponentAtNode(container);
  }
};

var isInFileMode = origin === '*' && window.location.protocol === 'file:';

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
function onMessage(e) {
  if (e.origin !== origin && !isInFileMode) {
    console.warn('Rejecting message from unknown origin:', e.origin);
    return;
  }

  switch(e.data.type) {
    case 'render':
      var payload = e.data.payload;
      var type = window[payload.elementName];

      if (!type && React.DOM.hasOwnProperty(payload.elementName)) {
        type = payload.elementName;
      }

      if (type) {
        render(type, payload.props);
      }
      else {
        postMessageToParent('error', {
          message: (
            'Component with the name "' + payload.elementName + '" does not exist! ' +
            'This probably means the component was not exported correctly.'
          )
        });
      }
    break;
  }
}

function onDOMContentLoaded() {
  contentBox = document.querySelector('<%- contentBoxSelector %>');

  runHook('start', contentBox, function() {
    postMessageToParent('ready');
    postMessageToParent('resize', {
      width: calculateWidth(),
      height: calculateHeight(),
    });
  });
}

function onUnload() {
  console.debug('Tearing down (source: <%- messageSource %>)...');

  try {
    runHook('stop', contentBox);
  }
  catch(e) {
    console.error('An error occured while running the "stop" hook.')
    console.error(e);
  }
  finally {
    window.removeEventListener('unload', onUnload, false);
    window.removeEventListener('DOMContentLoaded', onDOMContentLoaded, false);
    window.removeEventListener('message', onMessage, false);
  }

  // we ALWAYS want to try to unmount whatever could be mounted on the
  // contentBox, in case the user forgot to do this
  try {
    React.unmountComponentAtNode(contentBox);
  }
  catch(e) {}

  console.debug('Tear-down complete (source: <%- messageSource %>).');
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
window.addEventListener('unload', onUnload, false);
window.addEventListener('message', onMessage, false);

// ----------------------------------------------------------------------------
// Main routines
// ----------------------------------------------------------------------------
function render(type, newProps) {
  if (newProps.eval) {
    try {
      eval('newProps = ' + newProps.string + ';');
    }
    catch(e) {
      console.error('Unable to evaluate preset props!', e.message);

      postMessageToParent('error', {
        message: e.message,
        context: 'eval',
        propName: '[preset props]',
        propValue: newProps.string
      });

      return;
    }
  }

  var displayName = type.displayName || (typeof type === 'string' && type);

  console.log('Rendering "%s" with props:', displayName, newProps);

  var invalid = false;
  var props = Object.keys(newProps).reduce(function(_props, key) {
    var value = newProps[key];

    if (invalid) {
      return _props;
    }

    if (!!value && typeof value === 'object' && value.eval) {
      var code = '_props[key] = ' + String(value.code);

      try {
        eval(code);
      }
      catch (e) {
        console.log('Eval failed:', code);

        postMessageToParent('error', {
          message: e.message,
          context: 'eval',
          propName: key,
          propValue: value.value,
        });

        invalid = true;
      }
    }
    else if (!!value && typeof value === 'object' && value.code) {
      _props[key] = value.code;
    }
    else {
      _props[key] = value;
    }

    return _props;
  }, {});

  if (!invalid) {
    try {
      runHook('render', type, props, contentBox, function() {
        postMessageToParent('updated');
        postMessageToParent('resize', {
          width: calculateWidth(),
          height: calculateHeight()
        });
      });
    }
    catch(e) {
      postMessageToParent('error', {
        message: e.message,
        stack: e.stack,
        context: 'react#render'
      });
    }
  }
}

function calculateWidth() {
  var widths = [].slice.call(contentBox.querySelectorAll('*'))
    .concat([contentBox])
    .map(function(el) {
      return el.offsetWidth;
    })
  ;

  return Math.max.apply(Math, widths);
}

function calculateHeight() {
  var heights = [].slice.call(contentBox.querySelectorAll('*'))
    .concat([contentBox])
    .map(function(el) {
      return el.offsetHeight;
    })
  ;

  return Math.max.apply(Math, heights);
}

// ----------------------------------------------------------------------------
// INTERNAL
// ----------------------------------------------------------------------------
function postMessageToParent(type, payload) {
  window.parent.postMessage({
    type: type,
    source: '<%- messageSource %>',
    payload: payload
  }, origin);
}

function runHook() {
  var args = [].slice.call(arguments);
  var name = args.shift();
  var hook = (window.ReactBrowser || {})[name] || defaultHooks[name];

  hook.apply(null, args);
}