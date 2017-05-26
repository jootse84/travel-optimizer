import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import {Tabs, Tab} from 'material-ui/Tabs';

// icons at: https://material.io/icons/#ic_map
// https://github.com/callemall/material-ui/blob/master/src/svg-icons/
import MapsMap from 'material-ui/svg-icons/maps/map';
import ImagePictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import HardwareKeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import SocialShare from 'material-ui/svg-icons/social/share';
import CircularProgress from 'material-ui/CircularProgress';

import { blue500 } from 'material-ui/styles/colors';


import Itinerary from './components/Itinerary';
import ItemList from './components/ItemList';
import DateSelector from './components/DateSelector';
import ItemCreator from './components/ItemCreator';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Cities from './cities.js';

injectTapEventPlugin();

class DayItinerary extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      nav: {
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
      },
    };

    this.state = {
      map: false,
      ready: false,
    }

    this.select = this.select.bind(this);
  }

  componentDidMount() {
    let { itinerary, csrftoken, city } = this.props;
    axios.create({
      baseURL: '/',
      timeout: 150000,
      headers: {'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value}
    }).post('map', { itinerary, city }).then(res => {
      this.setState({
        map_id: res.data.id,
        ready: true,
      });
    });
  }

  select(id) {
    switch(id) {
      case 0:
        this.props.goBack();
        break;
      case 1:
        // not yet
        break;
      case 2:
        let { map } = this.state;
        this.setState({
          map: !map,
          selected: map ? null : 2,
        });
        break;
      case 3:
        break;
      case 4:
        break;
    }
  }

  render() {
    const { map, map_id, ready, selected } = this.state;

    return (
      <div>
        { map ? (
          <iframe
            src={`/renderMap?id=${map_id}`}
            className="map"
          />
        ):(
          <Itinerary {...this.props} />
        )}
        <BottomNavigation
          style={ this.styles.nav }
          selectedIndex={ selected }
        >
          <BottomNavigationItem
            label="Back"
            icon={ <HardwareKeyboardBackspace /> }
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Save as PDF"
            icon={ <ImagePictureAsPdf /> }
            onTouchTap={() => this.select(1)}
          />
          { ready ? (
            <BottomNavigationItem
              label="Map"
              icon={ <MapsMap /> }
              onTouchTap={() => this.select(2)}
            />
          ):(
            <BottomNavigationItem
              label="...loading map"
              icon={ <CircularProgress size={25} thickness={ 2 } /> }
            />
          )}
          <BottomNavigationItem
            label="Share"
            icon={ <SocialShare /> }
            onTouchTap={() => this.select(3)}
          />
        </BottomNavigation>
      </div>
    );
  }
}

class DayTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { itinerary } = this.props;
    return (
      <Tabs>
        {itinerary ? itinerary.map((day) =>
          <Tab
            label={day.label}
            key={day.label}
          >
            <DayItinerary
              day={ day }
              {...this.props}
            />
          </Tab>
        ) : (
          <div> no attractions </div>
        )}
      </Tabs>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      form: {
        display: 'table',
        gridTemplateColumns: '1fr 2fr',
        padding: '20px 20px 10px 20px',
      },
      form2: {
        display: 'table',
        gridTemplateColumns: '1fr 2fr',
      },
      formLoading: {
        textAlign: 'center',
        width: '70vw',
        opacity: '0.9',
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
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

  componentDidMount() {
    this.setState({
      csrftoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
    });
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
        this.setState({
          cities: result,
          city: value,
        });
      });
    }
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  handleOnTouchTap() {
    let {
      spots,
      startDate,
      endDate,
      city,
      csrftoken,
    } = this.state
    let oneDay = 24*60*60*1000;
    endDate.setDate(endDate.getDate() + 1);
    let days = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));

    this.setState({ loading: true });
    axios.create({
      baseURL: '/',
      timeout: 150000,
      headers: { 'X-CSRFToken': csrftoken }
    }).post('plan', { spots, days, city }).then(res => {
      this.setState({
        loading: false,
        itinerary: res.data.itinerary,
        map: res.data.map,
      });
    });
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
    let { spots, startDate, endDate, city } = this.state;
    return (spots.length > 0 && startDate && endDate && city)
  }

  render() {
    let {
      spots,
      startDate,
      endDate,
      itinerary,
      loading,
      city,
      csrftoken,
    } = this.state;

    let content;
    const loadingImg = (
      <img
        src="static/images/gears.svg"
        style={ { 'margin': '50px', 'opacity': '0.6' } }/>
    );

    if (this.state.loading) {

      content = (
        <Paper style={this.styles.formLoading} zDepth={3}>
          { loadingImg }
        </Paper>
      );

    } else if (this.state.itinerary) {
    //} else if (true) {
      let {
        itinerary
      } = this.state;
      //itinerary = [{"attractions": [{"rating": 5, "spot": "las ramblas", "duration": 0.5}], "day": 0, "label": "Day 1"}];
      //city = "Barcelona";

      content = (
        <Paper
          className="paper"
          style={ this.styles.form2 }
          zDepth={ 3 }
        >
          <DayTabs
            city={ city }
            itinerary={ itinerary }
            startDate={ startDate }
            csrftoken={ csrftoken }
            goBack={() => this.setState({ state: 0 }) }
          />
        </Paper>
      );

    } else {

      const {
        city,
        cities,
        spots,
        timeslot,
      } = this.state;

      content = (
        <Paper
          className="paper"
          style={ this.styles.form }
          zDepth={ 3 }
        >
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
                handleStartDateChange={ this.handleStartDateChange }
                handleEndDateChange={ this.handleEndDateChange }
              />
            </div>

            <div style={this.styles.flex2}>
              <ItemCreator
                spots={ spots }
                handleUpdateSpots={ this.handleUpdateSpots }
              />
            </div>
          </div>

          <ItemList
            items={spots}
            handleDeleteChip={this.handleDeleteChip}
          />
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
      <MuiThemeProvider>
        {content}
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('form')
);
