import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
// icons at: https://material.io/icons/#ic_map
// https://github.com/callemall/material-ui/blob/master/src/svg-icons/
import MapsMap from 'material-ui/svg-icons/maps/map';

import { blue500 } from 'material-ui/styles/colors';

import { Rating } from 'material-ui-rating';
import { Transition } from 'react-move';

import CardSpot from './components/Card';

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
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
      form2: {
        textAlign: 'center',
        width: '70vw',
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
      city: {
        gridColumn: 1,
        gridRow: 1,
        marginTop: '-24px',
      },
      start_date: {
        gridColumn: 1,
        gridRow: 2,
      },
      end_date: {
        gridColumn: 1,
        gridRow: 3,
      },
      spot: {
        gridColumn: '2 / span 3',
        gridRow: 1,
        width: '100%',
        marginTop: '-24px',
      },
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
      rating: {
        gridColumn: '2 / span 3',
        gridRow: 3,
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
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        margin: '20px 5px 20px 5px',
        gridColumn: '1 / span 4',
        gridRow: 5,
      },
      chip: {
        /*flex: '1 1 auto',*/
        margin: 4,
      },
    };

    let endDate = new Date();
    endDate.setYear(endDate.getUTCFullYear() + 100);

    this.state = {
      spots: [],
      rating: 3,
      city: "",
      value: "",
      disabled: true,
      initialStartDate: new Date(),
      initialEndDate: endDate,
      startDate: null,
      endDate: null,
      loading: false,
      time: [true, false, false, false],
      cities: new Cities(),
    };

    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleToogle = this.handleToogle.bind(this);
    this.handleOnTouchTap = this.handleOnTouchTap.bind(this);
    this.isFormCompleted = this.isFormCompleted.bind(this);
    this.clear = this.clear.bind(this);
  }

  /*componentWillMount() {
    debugger
  }*/

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

  handleRatingChange(value) {
    let spots = this.state.spots
    let time = (this.state.time.indexOf(true) + 1) * 0.5
    let rating = 3
    let newName = this.refs.spot_name.getValue()
    let index = spots.map((item, index) => item.name).indexOf(newName)
    let newSpot = { name: newName, rating: value, duration: time }

    if (index == -1) {
      spots.push(newSpot);
    } else {
      spots[index] = newSpot;
    }
    this.setState({ spots, rating });
    this.clear();
  }

  handleCityChange(value) {
    let state = this.state
    state.city = value
    this.setState(state)
  }

  handleTextChange(event) {
    let state = this.state
    state.disabled = event.target.value == ""
    state.value = event.target.value
    this.setState(state)
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  handleToogle(index) {
    let state = this.state
    state.time = [false, false, false, false]
    state.time[index] = true
    this.setState(state)
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
    let state = this.state
    state.disabled = true
    state.value = ""
    state.time = [true, false, false, false]
    this.setState(state)
  }

  isFormCompleted() {
    let { spots, startDate, endDate, city } = this.state
    return (spots.length > 0 && startDate && endDate && city)
  }

  render() {
    let { spots, initialStartDate, initialEndDate, startDate, endDate, itinerary, loading} = this.state;
    let content;
    const colors = ["red", "green", "blue"]

    if (loading) {
      content = (<Paper style={this.styles.form2} zDepth={3}>
        <img src="static/images/gears.svg" style={{'margin': '50px', 'opacity':'0.6'}}/>
      </Paper>)
    } else if (itinerary) {
      content = (
        <Paper style={this.styles.form} zDepth={3}>
          
          
          <div style={{width: '50px'}}>
            <IconButton
              href={"/map?id=" + this.state.map} 
              tooltip="Show me a map!">
              <MapsMap color={ blue500 } />
            </IconButton>
          </div>

          <Transition
            style={{'margin': '20px 0 20px 0'}}
            data={itinerary}
            getKey={(item, index) => index}
            duration={800}
            // the "update" function returns the items normal state to animate
            update={item => ({
              translate: 1,
              opacity: 1,
              color: 'grey'
            })}
            // the "enter" function returns the items origin state when entering
            enter={item => ({
              translate: 0,
              opacity: 0,
              color: 'blue'
            })}
            // the "leave" function returns the items destination state when leaving
            leave={item => ({
              translate: 2,
              opacity: 0,
              color: 'red'
            })}
            easing='easeQuadIn'
          >
            {data => {
              let acumTime = 0;
              return (
                <span style={{'width': '50vw', 'margin': '20px 0 20px 0'}}>
                  {data.map(item => {
                    let newday;
                    acumTime += item.data.duration
                    if (item.data.duration > 1 || (acumTime * 2) % 2 == 0) {
                      newday = (<div style={{'textAlign': 'right', 'fontSize': '10px'}}>
                        day {parseInt(acumTime)}
                        <hr/>
                      </div>);
                    }
                    return (
                      <span
                        key={item.key}
                        style={{
                          transform: `translateX(${100 * item.state.translate}px)`,
                          opacity: item.state.opacity,
                          color: item.state.color
                        }}
                      >
                        {item.data.spot} - { item.data.duration }
                        <Rating
                          value={item.data.rating}
                          max={item.data.rating}
                        />
                        {newday}
                      </span>
                    )
                  })}
                </span>
              )
            }}
          </Transition>
        </Paper>
      );
    } else {
      const listItems = spots.map((spot, index) =>
        <Chip
          key={spot.name}
          onRequestDelete={() => this.handleDeleteChip(index)}
          style={this.styles.chip}
        >
          {spot.name}
        </Chip>
      );
      const { cities, city } = this.state;
      content = (
        <Paper style={this.styles.form} zDepth={3}>
          <AutoComplete
            ref="city"
            value={this.state.city}
            onUpdateInput={this.handleCityChange}
            dataSource={cities.getCities(city)}
            hintText="Barcelona"
            floatingLabelText="Introduce your destination"
            style={this.styles.city}
          />
          <DatePicker
            hintText="Start Date"
            style={this.styles.start_date}
            minDate={new Date()}
            maxDate={endDate? endDate : initialEndDate}
            onChange={this.handleStartDateChange}
          />
          <DatePicker
            hintText="End Date"
            style={this.styles.end_date}
            minDate={startDate? startDate : initialStartDate}
            onChange={this.handleEndDateChange}
          />
          <TextField
            ref="spot_name"
            value={this.state.value}
            onChange={this.handleTextChange}
            hintText="Rate with stars to add your new spot in your wishlist"
            floatingLabelText="Introduce the name of the spot to visit"
            style={this.styles.spot}
          />
          <div style={this.styles.timeslots}>
            <Toggle
              label="&frac12; day"
              labelPosition="right"
              style={this.styles.toggle}
              toogled={this.state.time[0]}
              defaultToggled={this.state.time[0]}
              style={this.styles.timeslot}
              onToggle={(event, isInputChecked) => this.handleToogle(0)}
            />
            <Toggle
              label="1 day"
              labelPosition="right"
              style={this.styles.toggle}
              toogled={this.state.time[1]}
              defaultToggled={this.state.time[1]}
              style={this.styles.timeslot}
              onToggle={(event, isInputChecked) => this.handleToogle(1)}
            />
            <Toggle
              label="1+&frac12; day"
              labelPosition="right"
              toogled={this.state.time[2]}
              style={this.styles.toggle}
              toogled={this.state.time[2]}
              defaultToggled={this.state.time[2]}
              style={this.styles.timeslot}
              onToggle={(event, isInputChecked) => this.handleToogle(2)}
            />
            <Toggle
              label="2 days"
              labelPosition="right"
              style={this.styles.toggle}
              toogled={this.state.time[3]}
              defaultToggled={this.state.time[3]}
              style={this.styles.timeslot}
              onToggle={(event, isInputChecked) => this.handleToogle(3)}
            />
          </div>
          <Rating
            ref="rating"
            value={this.state.rating}
            max={6}
            onChange={this.handleRatingChange}
            disabled={this.state.disabled}
            style={this.styles.rating}
          />
          <Divider style={this.styles.divider}/>
          <div style={this.styles.chips}>
            {listItems}
          </div>
          <RaisedButton
            label="Plan my trip!"
            primary={true}
            disabled={!this.isFormCompleted()}
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
