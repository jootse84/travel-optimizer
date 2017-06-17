import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

// icons at: https://material.io/icons/#ic_map
// https://github.com/callemall/material-ui/blob/master/src/svg-icons/
import PlannerForm from './components/PlannerForm';
import Itinerary from './components/Itinerary';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const states = {
  MAIN: 0,
  LOADING: 1,
  ITINERARY: 2,
}

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
        marginBottom: '50px',
      },
      formLoading: {
        textAlign: 'center',
        width: '70vw',
        opacity: '0.9',
        margin: '20px 15vw 10px 15vw',
        padding: '20px 20px 10px 20px',
        gridTemplateColumns: '1fr 2fr',
      },
    };

    this.state = {
      state: states['MAIN'],
      loading: false,
      // remove!!
      city: "Barcelona",
      /*itinerary: [{
        "day": 0,
        "label": "Day 1",
        "attractions": [
          {"rating": 6, "duration": 0.5, "spot": "sagrada familia"},
          {"rating": 6, "duration": 1.0, "spot": "montjuic"}
        ]
      }, {
        "day": 1,
        "label": "Day 2",
        "attractions": [
          {"rating": 6, "duration": 1.0, "spot": "montjuic"},
          {"rating": 6, "duration": 0.5, "spot": "parc guell"}
        ]
      }],*/
    };

    this.onConfirmPlan = this.onConfirmPlan.bind(this);
  }

  componentDidMount() {
    this.setState({
      csrftoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
      // remove!!
      // state: states['ITINERARY'],
    });
  }

  onConfirmPlan(spots, startDate, endDate, city) {
    let { csrftoken } = this.state;

    let oneDay = 24*60*60*1000;
    endDate.setDate(endDate.getDate() + 1);
    let days = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));

    this.setState({
      state: states['LOADING'],
    });

    axios.create({
      baseURL: '/',
      timeout: 150000,
      headers: { 'X-CSRFToken': csrftoken }
    }).post('plan', { spots, days, city }).then(res => {
      this.setState({
        loading: false,
        itinerary: res.data.itinerary,
        startDate,
        city,
        state: states['ITINERARY'],
      });
    });
  }

  renderHeader() {
    return(
      <ul className="title">
        <li><img src="/static/logo.png" width="200px"/></li>
        <li><hr/></li>
        <li><b>A good trip always starts with a great planning</b>.</li>
      </ul>
    );
  }

  render() {

    switch (this.state.state) {

      case states.LOADING:
        return (
          <MuiThemeProvider>
            <span>
              { this.renderHeader() }
              <Paper style={this.styles.formLoading} zDepth={3}>
                <img
                  src="static/images/gears.svg"
                  style={ { 'margin': '50px', 'opacity': '0.6' } }
                />
              </Paper>
            </span>
          </MuiThemeProvider>
        );
        break;

      case states.ITINERARY:
        let {
          csrftoken,
          itinerary,
          startDate,
          city,
        } = this.state;

        return (
          <MuiThemeProvider>
            <Paper
              className="paper"
              style={ this.styles.form2 }
              zDepth={ 3 }
            >
              <Itinerary
                city={ city }
                itinerary={ itinerary }
                startDate={ startDate }
                csrftoken={ csrftoken }
                goBack={() => this.setState({ state: 0 }) }
              />
            </Paper>
          </MuiThemeProvider>
        );
        break;

      default:
        return (
          <MuiThemeProvider>
            <span>
              { this.renderHeader() }
              <Paper
                className="paper"
                style={ this.styles.form }
                zDepth={ 3 }
              >
                <PlannerForm
                  onConfirmPlan={ this.onConfirmPlan }
                />
              </Paper>
            </span>
          </MuiThemeProvider>
        );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('form')
);
