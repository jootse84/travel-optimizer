import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';

export default class DateSelector extends React.Component  {
  constructor(props) {
    super(props);
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

    return (
      <div style={this.styles.data_selector}>
        <DatePicker
          hintText="Start Date"
          minDate={ new Date() }
          maxDate={ maxDate }
          onChange={ handleStartDateChange }
        />
        <DatePicker
          hintText="End Date"
          minDate={ minDate }
          onChange={ handleEndDateChange }
        />
      </div>
    );
  }
}

