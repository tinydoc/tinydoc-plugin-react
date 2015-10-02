var contentBox;
var origin = "<%- origin %>";

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
window.addEventListener('message', function(e) {
  if (e.origin !== origin) {
    return;
  }

  render(window[e.data.elementName], e.data.props);
}, false);

window.addEventListener('DOMContentLoaded', function() {
  contentBox = document.querySelector('<%- contentBoxSelector %>');

  <% if (code) { %>
    React.render(<%= code %>, contentBox);
  <% } %>

  postMessageToParent('ready');
  postMessageToParent('resize', {
    width: calculateWidth(),
    height: calculateHeight(),
  });
}, false);

// ----------------------------------------------------------------------------
// Main routines
// ----------------------------------------------------------------------------
function render(type, newProps) {
  console.log('Rendering "%s" with props:', type.displayName, newProps);

  var invalid = false;
  var props = Object.keys(newProps).reduce(function(_props, key) {
    if (invalid) {
      return _props;
    }

    if (typeof newProps[key] === 'object' && newProps[key].eval) {
      var code = '_props[key] = ' + String(newProps[key].code);

      try {
        eval(code);
      }
      catch (e) {
        console.log('Eval failed:', code);

        postMessageToParent('error', {
          message: e.message,
          context: 'eval',
          propName: key,
          propValue: newProps[key].value,
        });

        invalid = true;
      }
    }
    else {
      _props[key] = newProps[key];
    }

    return _props;
  }, {});

  if (!invalid) {
    try {
      React.render(React.createElement(type, props), contentBox, function() {
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
