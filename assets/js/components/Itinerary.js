import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';

import { Transition } from 'react-move'
import { Rating } from 'material-ui-rating';

class ItineraryCard extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      image: {
        maxHeight: '500px'
      },
      progress: {
        margin: '50px 0 50px 0',
        textAlign: 'center',
      },
    };

    this.state = {
      image: null,
      content: "",
      url: "",
      ready: false,
    };

    this.durations = {
      '0.5': 'half-day',
      '1': 'full day',
      '1.5': 'day and a half',
      '2': '2 days'
    }
  }

  componentWillMount() {
    let { spot, city } = this.props.item;

    axios.create({
      baseURL: '/cities/',
      timeout: 10000,
      headers: { 'X-CSRFToken': this.props.csrftoken }
    }).get(`${city}/attractions/${spot}/`, {}).then(res => {
      this.setState({
        image: res.data.images[0],
        content: res.data.summary,
        url: res.data.url,
        ready: true,
      });
    });
  }

  render() {
    let { content, image, url, ready } = this.state;
    const { item, acumTime, style } = this.props;
    let { duration, spot, rating, city } = item; // content, image

    spot = spot.replace(/\b\w/g, l => l.toUpperCase()); // capitalize
    content = content.split(' ').slice(0, 100).join(' ') + '...'; // first 100 words
    const cardTitle = (
      <CardTitle title={ spot } subtitle={ city } />
    );

    if (ready) {
      return (
        <Card style={ style } className="card">
          <CardHeader
            title={ `Day ${ Math.ceil(acumTime) }` }
            subtitle={ this.durations[duration.toString()] }
            avatar={ image }
          />
          <CardMedia overlay={ cardTitle }>
            <img src={ image } style={ this.styles.image } />
          </CardMedia>
          <CardText>
            { content } 
          </CardText>
          <CardActions>
            <FlatButton
              label="See More"
              href={ url }
            />
            <FlatButton label="Remove" />
          </CardActions>
        </Card>
      );
    } else {
      return (
        <Card style={ style } className="card">
          <CardMedia overlay={ cardTitle }>
            <CircularProgress
              style={ this.styles.progress }
              size={ 80 }
              thickness={ 5 }
            /> 
          </CardMedia>
        </Card>
      );
    }
  }
}


export default class Itinerary extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
      transition: {
        'margin': '20px 0 20px 0'
      },
      flex: { //{'width': '50vw', 'margin': '20px 0 20px 0'}
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
      },
      child: {
        flexGrow: '1',
        margin: '10px 0 0 2%',
        minWidth: '275px',
        padding: '15px',
        width: 'calc(100% * (1/4) - 10px - 1px)',
      }
    }
  }
  render() {
    let acumTime = 0;
    let csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    return (
      <div style={ this.styles.flex }>
        {this.props.itinerary.map(item => {
          acumTime += item.duration;
          return (
            <ItineraryCard
              style={ this.styles.child }
              key={ item.spot }
              acumTime={ acumTime }
              item={ item }
              csrftoken={ csrftoken }
            />
          );
        })}
      </div>
    );
  }
}

