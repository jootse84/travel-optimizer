import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';

export default class DateSelector extends React.Component  {
  constructor(props) {
    super(props);

    let endDate = new Date();
    endDate.setYear(endDate.getUTCFullYear() + 100);
    this.state = {
      initialStartDate: new Date(),
      initialEndDate: endDate,
    };

    this.style = {
      date: {
        width: '100%',
      }
    };
  }
  render() {
    const {
      handleStartDateChange,
      handleEndDateChange,
      maxDate,
      minDate
    } = this.props

    const {
      initialStartDate,
      initialEndDate
    } = this.state

    return (
      <div>
        <DatePicker
          hintText="Start Date"
          style={ this.style.date }
          fullWidth={ true }
          minDate={ new Date() }
          maxDate={ maxDate? maxDate : initialEndDate}
          onChange={ handleStartDateChange }
        />
        <DatePicker
          hintText="End Date"
          style={ this.style.date }
          fullWidth={ true }
          minDate={ minDate? minDate : initialStartDate}
          onChange={ handleEndDateChange }
        />
      </div>
    );
  }
}

