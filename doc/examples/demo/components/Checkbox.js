const { string, number, bool, func, oneOfType, any } = React.PropTypes;

function classSet(set) {
  return Object.keys(set).reduce(function(classNames, className) {
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
const Checkbox = React.createClass({
  propTypes: {
    className: string,

    /**
     * @property {String}
     *
     * Hex code to use as a background-color for the checkbox.
     */
    color: string,

    checked: bool,
    value: oneOfType([ string, number ]),

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

  getInitialState: function() {
    return {
      focused: false
    };
  },

  getDefaultProps: function() {
    return {
      checked: false,
      disabled: false,
      className: "",
      color: undefined
    };
  },

  render: function() {
    const className = classSet({
      "checkbox": true,
      "checkbox--checked": this.props.checked,
      "checkbox--disabled": this.props.disabled,
      "checkbox--focused": this.state.focused
    }) + ` ${this.props.className || ''}`;

    const displayClassName = classSet({
      "checkbox__display-checkbox": true,
      "checkbox__display-checkbox--checked": this.props.checked,
      "checkbox__display-checkbox--disabled": this.props.disabled
    });

    const wrapperClassName = classSet({
      "checkbox__label-wrapper": true,
      "checkbox__label-wrapper--checked brand-color": this.props.checked
    });

    return (
      <label
        onFocus={this.markFocused}
        onBlur={this.unmarkFocused}
        className={classSet(className)}
        style={{
          display: 'block',
          backgroundColor: this.props.color,
          padding: '1em'
        }}
      >
        <span
          className={displayClassName}
        />

        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
          value={this.props.value}
          disabled={this.props.disabled}
          className="screenreader-only" />

        <span className={wrapperClassName}>
          {this.props.children}
        </span>
      </label>
    );
  },

  markFocused: function() {
    this.setState({ focused: true });
  },

  unmarkFocused: function() {
    this.setState({ focused: false });
  }
});

export default Checkbox;