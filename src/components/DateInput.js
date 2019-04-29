import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format, parse, isValid, isEqual } from 'date-fns';

class DateInput extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      invalid: false,
      changed: false,
      value: this.formatDate(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (!isEqual(value, nextProps.value)) {
      this.setState({ value: this.formatDate(nextProps) });
    }
  }

  formatDate({ value, dateDisplayFormat, dateOptions }) {
    if (value && isValid(value)) {
      return format(value, dateDisplayFormat, dateOptions);
    }
    return '';
  }

  update(value) {
    const { invalid, changed } = this.state;

    if (invalid || !changed || !value) {
      return;
    }

    const { onChange, dateDisplayFormat, dateOptions } = this.props;
    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);

    if (isValid(parsed)) {
      this.setState({ changed: false }, () => onChange(parsed));
    } else {
      this.setState({ invalid: true });
    }
  }

  onKeyDown(e) {
    const { value } = this.state;

    if (e.key === 'Enter') {
      this.update(value);
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value, changed: true, invalid: false });
  }

  onBlur() {
    const { value } = this.state;
    this.update(value);
  }

  render() {
    const { className, readOnly, placeholder, disabled, onFocus } = this.props;
    const { value, invalid } = this.state;

    return (
      <span className={classnames('rdrDateInput', className)}>
        <input
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={onFocus}
        />
        {invalid && <span className="rdrWarning">&#9888;</span>}
      </span>
    );
  }
}

DateInput.propTypes = {
  value: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  dateOptions: PropTypes.object,
  dateDisplayFormat: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY',
};

export default DateInput;