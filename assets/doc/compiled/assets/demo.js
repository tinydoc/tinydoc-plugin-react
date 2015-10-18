/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _componentsCheckbox = __webpack_require__(1);

	var _componentsCheckbox2 = _interopRequireDefault(_componentsCheckbox);

	var _componentsButton = __webpack_require__(2);

	var _componentsButton2 = _interopRequireDefault(_componentsButton);

	window.Checkbox = _componentsCheckbox2["default"];
	window.Button = _componentsButton2["default"];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _React$PropTypes = React.PropTypes;
	var string = _React$PropTypes.string;
	var number = _React$PropTypes.number;
	var bool = _React$PropTypes.bool;
	var func = _React$PropTypes.func;
	var oneOfType = _React$PropTypes.oneOfType;
	var any = _React$PropTypes.any;

	function classSet(set) {
	  return Object.keys(set).reduce(function (classNames, className) {
	    if (!!set[className]) {
	      classNames.push(className);
	    }

	    return classNames;
	  }, []).join(' ');
	}

	/**
	 * A simple controlled checkbox to check.
	 *
	 * @example {jsx}
	 *
	 *     <Checkbox value="1">
	 *       Check me!
	 *     </Checkbox>
	 *
	 * @example {jsx}
	 *
	 *     <Checkbox value="1" checked>
	 *       I'm checked!
	 *     </Checkbox>
	 */
	var Checkbox = React.createClass({
	  displayName: "Checkbox",

	  propTypes: {
	    className: string,

	    /**
	     * @property {String}
	     *
	     * Hex code to use as a background-color for the checkbox.
	     */
	    color: string,

	    checked: bool,
	    value: oneOfType([string, number]),

	    disabled: bool,

	    /**
	     * @property {Function}
	     *
	     * A callback to invoke when the checkbox selection was modified.
	     *
	     * @param {Event} e
	     * @param {Boolean} e.target.checked
	     *        Whether the checkbox is now checked or not.
	     */
	    onChange: func,

	    /**
	     * @property {*}
	     *
	     * The actual textual content that will be checkable.
	     */
	    children: any
	  },

	  getInitialState: function getInitialState() {
	    return {
	      focused: false
	    };
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      checked: false,
	      disabled: false,
	      className: "",
	      color: undefined
	    };
	  },

	  render: function render() {
	    var className = classSet({
	      "checkbox": true,
	      "checkbox--checked": this.props.checked,
	      "checkbox--disabled": this.props.disabled,
	      "checkbox--focused": this.state.focused
	    }) + (" " + (this.props.className || ''));

	    var displayClassName = classSet({
	      "checkbox__display-checkbox": true,
	      "checkbox__display-checkbox--checked": this.props.checked,
	      "checkbox__display-checkbox--disabled": this.props.disabled
	    });

	    var wrapperClassName = classSet({
	      "checkbox__label-wrapper": true,
	      "checkbox__label-wrapper--checked brand-color": this.props.checked
	    });

	    return React.createElement(
	      "label",
	      {
	        onFocus: this.markFocused,
	        onBlur: this.unmarkFocused,
	        className: classSet(className),
	        style: {
	          display: 'block',
	          backgroundColor: this.props.color,
	          padding: '1em'
	        }
	      },
	      React.createElement("span", {
	        className: displayClassName
	      }),
	      React.createElement("input", {
	        type: "checkbox",
	        checked: this.props.checked,
	        onChange: this.props.onChange,
	        value: this.props.value,
	        disabled: this.props.disabled,
	        className: "screenreader-only" }),
	      React.createElement(
	        "span",
	        { className: wrapperClassName },
	        this.props.children
	      )
	    );
	  },

	  markFocused: function markFocused() {
	    this.setState({ focused: true });
	  },

	  unmarkFocused: function unmarkFocused() {
	    this.setState({ focused: false });
	  }
	});

	exports["default"] = Checkbox;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _React$PropTypes = React.PropTypes;
	var func = _React$PropTypes.func;
	var bool = _React$PropTypes.bool;
	var node = _React$PropTypes.node;

	/**
	 * A super button to push!
	 *
	 * @example {jsx}
	 *
	 *     <Button onClick={() => alert('You did not!')}>
	 *       Push me!
	 *     </Button>
	 */
	var Button = React.createClass({
	  displayName: "Button",

	  propTypes: {
	    onClick: func,
	    disabled: bool,
	    children: node
	  },

	  render: function render() {
	    return React.createElement("button", _extends({ type: "button" }, this.props));
	  }
	});

	exports["default"] = Button;
	module.exports = exports["default"];

/***/ }
/******/ ]);