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

    this.styles = {
      data_selector: {
        gridColumn: 1,
        gridRow: '2 / span 4',
      }
    }
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
      <div style={this.styles.data_selector}>
        <DatePicker
          hintText="Start Date"
          minDate={ new Date() }
          maxDate={ maxDate? maxDate : initialEndDate}
          onChange={ handleStartDateChange }
        />
        <DatePicker
          hintText="End Date"
          minDate={ minDate? minDate : initialStartDate}
          onChange={ handleEndDateChange }
        />
      </div>
    );
  }
}

