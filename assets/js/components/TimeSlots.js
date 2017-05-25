import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

import Toggle from 'material-ui/Toggle';

export default class TimeSlots extends React.Component  {

  constructor(props) {
    super(props);

    if (window.innerWidth < 700) {
      this.labels = [
        <span>&frac12;</span>,
        <span>1</span>,
        <span>1+&frac12;</span>,
        <span>2</span>
      ];
    } else {
      this.labels = [
        <span>&frac12; day</span>,
        <span>1 day</span>,
        <span>1+&frac12; day</span>,
        <span>2 days</span>
      ];
    }

    this.styles = {
      timeslots: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        height: '35px',
      },
      timeslot: {
        flex: '1 1 auto',
        display: 'inline-flex',
      },
      label: {
        color: 'rgba(0, 0, 0, 0.7)',
        //fontSize: 'small',
      },
    };

    this.handleOnToogle = this.handleOnToogle.bind(this);
  }

  handleOnToogle(event, isInputChecked) {
    const {
      handleToogle,
      timeslot
    } = this.props

    // TO_DO
    // check if we click same toogle, then event preventdefault
  }

  render() {
    const {
      handleToogle,
      timeslot
    } = this.props

    return (
      <div>
      <p><b>2.</b> How much time are you planning to spend there? (in days)</p>
      <div style={ this.styles.timeslots }>
        <Toggle
          label={ this.labels[0] }
          labelPosition="right"
          labelStyle={ this.styles.label }
          toggled={ timeslot == 0 }
          defaultToggled={ true }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(0) }
        />
        <Toggle
          label={ this.labels[1] }
          labelPosition="right"
          labelStyle={ this.styles.label }
          toggled={ timeslot == 1 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(1) }
        />
        <Toggle
          label={ this.labels[2] }
          labelPosition="right"
          labelStyle={ this.styles.label }
          toggled={ timeslot == 2 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(2) }
        />
        <Toggle
          label={ this.labels[3] }
          labelPosition="right"
          labelStyle={ this.styles.label }
          toggled={ timeslot == 3 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(3) }
        />
      </div>
      </div>
    );
  }
}

