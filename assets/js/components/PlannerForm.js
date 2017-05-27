import React from 'react';
import ReactDOM from 'react-dom';

import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import ItemList from './plannerForm/ItemList';
import DateSelector from './plannerForm/DateSelector';
import ItemCreator from './plannerForm/ItemCreator';

import Cities from '../cities';

export default class PlannerForm extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      city: {
        marginTop: '-24px',
      },
      button: {
        width: '100%',
      },
      flex: {
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
      },
      flex1: {
        flex: 1,
        minWidth: '200px',
        margin: '5px 25px 35px 5px',
      },
      flex2: {
        flex: 2,
        margin: '5px 5px 15px 5px',
      }
    };

    this.state = {
      spots: [],
      rating: 3,
      city: "",
      cities: [],
      value: "",
      disabled: true,
      startDate: null,
      endDate: null,
      loading: false,
      timeslot: 0,
    };

    this.cities = new Cities();

    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleOnTouchTap = this.handleOnTouchTap.bind(this);
    this.formReady = this.formReady.bind(this);
    this.clear = this.clear.bind(this);
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  handleCityChange(value) {
    if (value == '') {
      this.setState({
        cities: [],
        city: ''
      });
    } else {
      this.cities.getCities(value, (result) => {
        this.setState({
          cities: result,
          city: value,
        });
      });
    }
  }

  handleOnTouchTap() {
    let {
      spots,
      startDate,
      endDate,
      city,
    } = this.state
    
    this.props.onConfirmPlan(spots, startDate, endDate, city);
  }

  clear() {
    this.setState({
      disabled: true,
      value: "",
      timeslot: 0,
      spots: [],
    });
  }

  formReady() {
    const { spots, startDate, endDate, city } = this.state;
    return (spots.length > 0 && startDate && endDate && city)
  }

  render() {
    const {
      cities,
      startDate,
      endDate,
      spots,
    } = this.state;

    return (
      <section>
        <div style={this.styles.flex}>
          <div style={this.styles.flex1}>
            <AutoComplete
              ref="city"
              open={ true }
              onUpdateInput={ this.handleCityChange }
              dataSource={ cities }
              fullWidth={ true }
              filter={ AutoComplete.caseInsensitiveFilter }
              hintText="Enter city or country"
              floatingLabelText="Introduce your destination"
              style={ this.styles.city }
            />
            <DateSelector
              maxDate={ endDate }
              minDate={ startDate }
              handleStartDateChange={ (ev, startDate) => this.setState({ startDate }) }
              handleEndDateChange={ (ev, endDate) => this.setState({ endDate }) }
            />
          </div>

          <div style={this.styles.flex2}>
            <ItemCreator
              spots={ spots }
              handleUpdateSpots={ (spots) => this.setState({ spots }) }
            />
          </div>
        </div>

        <ItemList
          items={spots}
          handleDeleteChip={this.handleDeleteChip}
        />
        <RaisedButton
          label="Plan my trip!"
          primary={ true }
          disabled={ !this.formReady() }
          style={ this.styles.button }
          onTouchTap={ this.handleOnTouchTap }
        />
      </section>
    );
  }
}
