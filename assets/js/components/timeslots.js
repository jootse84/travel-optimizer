import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

import Toggle from 'material-ui/Toggle';

export default class TimeSlots extends React.Component  {

  constructor(props) {
    super(props);

    this.styles = {
      timeslots: {
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        gridColumn: '2 / span 3',
        gridRow: 2,
      },
      timeslot: {
        flex: '1 1 auto',
        display: 'inline-flex',
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
      <div style={ this.styles.timeslots }>
        <Toggle
          label="&frac12; day"
          labelPosition="right"
          style={ this.styles.toggle }
          toggled={ timeslot == 0 }
          defaultToggled={ true }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(0) }
        />
        <Toggle
          label="1 day"
          labelPosition="right"
          style={ this.styles.toggle}
          toggled={ timeslot == 1 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(1) }
        />
        <Toggle
          label="1+&frac12; day"
          labelPosition="right"
          style={ this.styles.toggle }
          toggled={ timeslot == 2 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(2) }
        />
        <Toggle
          label="2 days"
          labelPosition="right"
          style={ this.styles.toggle }
          toggled={ timeslot == 3 }
          defaultToggled={ false }
          style={ this.styles.timeslot }
          onToggle={ (event, isInputChecked) => handleToogle(3) }
        />
      </div>
    );
  }
}

