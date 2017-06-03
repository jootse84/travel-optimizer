import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';

import moment from 'moment'

class ItineraryCard extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      image: {
        minHeight: '150px',
      },
      progress: {
        margin: '50px 0 50px 0',
        textAlign: 'center',
      },
      gridImage: {
        width: '100%',
        gridArea: 'image',
        boxShadow: 'none',
      },
      gridText: {
        width: '100%',
        height: '100%',
        gridArea: 'text',
        boxShadow: 'none',
      },
      buttons: {
        position: 'absolute',
        bottom: '40px',
        right: 0,
      },
    };

    this.durations = {
      '0.5': 'half-day',
      '1': 'full day',
      '1.5': 'day and a half',
      '2': '2 days'
    }
  }

  render() {
    const { item, city } = this.props;
    let {
      content,
      images,
      url,
      ready,
      duration,
      spot,
      rating
    } = item;

    spot = spot.replace(/\b\w/g, l => l.toUpperCase()); // capitalize
    const cardTitle = (
      <CardTitle
        title={ spot }
        subtitle={ city }
      />
    );

    if (ready) {
      // first 75 words
      content = content.split(' ').slice(0, 75).join(' ') + '...'; 
      return (
        <div className="card">
          <Card style={ this.styles.gridImage }>
            <CardHeader
              title={ spot }
              subtitle={ this.durations[duration.toString()] }
              avatar={ images[0] }
            />
            <CardMedia overlay={ cardTitle }>
              <img
                src={ images[1] ? images[1] : images[0] }
                style={ this.styles.image }
              />
            </CardMedia>
          </Card>
          <Card
            style={ this.styles.gridText }
            containerStyle={{ height: '100%' }}
          >
            <CardText>
              { content } 
            </CardText>
            <CardActions>
              <FlatButton
                label="See More"
                href={ url }
              />
            </CardActions>
          </Card>
        </div>
      );
    } else {
      return (
        <Card
          className="card-progress"
        >
          <CircularProgress
            style={ this.styles.progress }
            size={ 80 }
            thickness={ 5 }
          /> 
        </Card>
      );
    }
  }
}

export default class DayItinerary extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
      itinerary: {
        margin: '20px',
      },
      flex: { //{'width': '50vw', 'margin': '20px 0 20px 0'}
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
      },
      title: {
        textAlign: 'center',
      },
    }
  }
  render() {
    const { day, city, startDate } = this.props;
    let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    return (
      <div style={ this.styles.itinerary }>
        <h1 style={ this.styles.title }>
          { moment(startDate).add(day.day, 'days').format('LL') }
        </h1>
        <hr/>
        <div style={ this.styles.flex }>
          {day.attractions.map(item => {
            return (
              <ItineraryCard
                city={ city }
                key={ item.spot }
                item={ item }
                csrftoken={ csrftoken }
              />
            );
          })}
        </div>
      </div>
    );
  }
}

