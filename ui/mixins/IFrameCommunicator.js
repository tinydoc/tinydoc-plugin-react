let communicatorUID = 0;

const origin = (function() {
  const { location } = window;

  // see https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  if (location.protocol === 'file:') {
    return '*';
  }
  else if (location.origin) {
    return location.origin;
  }
  else if (location.port) {
    return `${location.protocol}//${location.hostname}:${location.port}`;
  }
  else {
    return `${location.protocol}//${location.hostname}`;
  }
}());

function validateAndPropagateMessage(uid, onMessage, e) {
  const message = e.data;

  if (!e.origin === origin) {
    console.warn('Ignoring potentially suspicious message from a foreign origin:', e.origin);
  }
  if (!message) {
    console.warn('Suspicious message; expected to contain some JSON data.');
  }
  else if (message.source !== uid) {
    // console.debug('Ignoring message from unknown source "%s".', message.source)
  }
  else if (typeof message.type !== 'string') {
    console.warn('Bad message; expected to contain a "type" field.');
    console.log(message);
  }
  else {
    onMessage(message);
  }
}


exports.createMixin = function(handleMessage) {
  let onMessage;
  let mixin = {
    componentDidMount() {
      const uid = this.__communicatorUID__ = `comm-${++communicatorUID}`;

      onMessage = validateAndPropagateMessage.bind(
        null, uid, handleMessage.bind(this)
      );

      window.addEventListener('message', onMessage, false);
    },

    componentWillUnmount() {
      window.removeEventListener('message', onMessage, false);
    },
  };

  return mixin;
};

exports.postMessage = function(iframe, payload) {
  iframe.contentWindow.postMessage(payload, origin);
};

exports.getUID = function(component) {
  return component.__communicatorUID__;
};

exports.getOrigin = function() {
  return origin;
};
