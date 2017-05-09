import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
// icons at: https://material.io/icons/#ic_map
// https://github.com/callemall/material-ui/blob/master/src/svg-icons/
import MapsMap from 'material-ui/svg-icons/maps/map';

import { blue500 } from 'material-ui/styles/colors';

import { Transition } from 'react-move';

import Itinerary from './components/itinerary';
import ItemList from './components/itemlist';
import DateSelector from './components/dateselector';
import TimeSlots from './components/timeslots';
import ItemCreator from './components/itemcreator';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Cities from './cities.js';

injectTapEventPlugin();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      toogle: {
        marginBottom: 16,
      },
      form: {
        display: 'grid',
        width: '70vw',
        opacity: '0.9',
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
      form2: {
        textAlign: 'center',
        width: '70vw',
				opacity: '0.9',
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
      city: {
        gridColumn: 1,
        gridRow: 1,
        marginTop: '-24px',
      },
      button: {
        margin: 12,
        gridColumn: '1 / span 4',
        gridRow: 6,
      },
      divider: {
        margin: '20px 0 20px 0 !important',
        gridColumn: '1 / span 4',
        gridRow: 4,
      },
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

    this.STATES = {
      LOADING: 0,
      WAITING: 1,
      READY: 2
    }

    this.handleUpdateSpots = this.handleUpdateSpots.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleOnTouchTap = this.handleOnTouchTap.bind(this);
    this.formReady = this.formReady.bind(this);
    this.clear = this.clear.bind(this);
  }

  handleStartDateChange(event, x) {
    let state = this.state
    state.startDate = x
    this.setState(state)
  }

  handleEndDateChange(event, x) {
    let state = this.state
    state.endDate = x
    this.setState(state)
  }

  handleUpdateSpots(spots) {
    this.setState({ spots });
  }

  handleCityChange(value) {
    if (value == '') {
      this.setState({
        cities: [],
        city: ''
      });
    } else {
      this.cities.getCities(value, (result) => {
        let state = this.state;
        state.city = value;
        state.cities = result;
        this.setState(state);
      });
    }
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  handleOnTouchTap() {
    let state = this.state;
    let {spots, startDate, endDate, city} = this.state
    let oneDay = 24*60*60*1000;
    endDate.setDate(endDate.getDate() + 1);
    let days = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
    let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    state["loading"] = true;
    this.setState(state)

    axios.create({
      baseURL: '/',
      timeout: 50000,
      headers: {'X-CSRFToken': csrftoken}
    }).post('plan', { spots, days, city }).then(res => {
      let state = this.state;
      state["loading"] = false;
      state["itinerary"] = res.data.itinerary;
      state["map"] = res.data.map;
      this.setState(state);
    });
  }

  clear() {
    let state = this.state;
    state.disabled = true;
    state.value = "";
    state.timeslot = 0;
    this.spots = [];
    this.setState(state);
  }

  formReady() {
    let { spots, startDate, endDate, city } = this.state;
    return (spots.length > 0 && startDate && endDate && city)
  }

  render() {
    let {
      spots,
      startDate,
      endDate,
      itinerary,
      loading
    } = this.state;
    let content;

    if (this.state.loading) {

      content = (
        <Paper style={this.styles.form2} zDepth={3}>
          <img
            src="static/images/gears.svg"
            style={{'margin': '50px', 'opacity':'0.6'}}/>
        </Paper>
      );

    } else if (this.state.itinerary) {
      let {
        map,
        itinerary
      } = this.state;

      content = (
        <Paper style={this.styles.form} zDepth={3}>
          <div style={{width: '50px'}}>
            <IconButton
              href={"/map?id=" + map} 
              tooltip="Show me a map!">
              <MapsMap color={ blue500 } />
            </IconButton>
          </div>
          <Itinerary
            itinerary={itinerary} />
        </Paper>
      );

    } else {

      const {
        city,
        cities,
        spots,
        timeslot
      } = this.state;

      content = (
        <Paper style={this.styles.form} zDepth={3}>
          <AutoComplete
            ref="city"
            value={ city }
            onUpdateInput={ this.handleCityChange }
            dataSource={ cities }
            hintText="Barcelona"
            floatingLabelText="Introduce your destination"
            style={ this.styles.city }
          />

          <DateSelector
            maxDate={ endDate }
            minDate={ startDate }
            handleStartDateChange={ this.handleStartDateChange }
            handleEndDateChange={ this.handleEndDateChange }/>

          <ItemCreator
            spots={ spots }
            handleUpdateSpots={ this.handleUpdateSpots }/>

          <Divider style={this.styles.divider}/>

          <ItemList
            items={spots}
            handleDeleteChip={this.handleDeleteChip} />

          <RaisedButton
            label="Plan my trip!"
            primary={true}
            disabled={!this.formReady()}
            style={this.styles.button}
            onTouchTap={this.handleOnTouchTap}
          />
        </Paper>
      );
    }

    return (
      <MuiThemeProvider>{content}</MuiThemeProvider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('form')
);
