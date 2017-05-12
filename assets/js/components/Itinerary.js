import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { Transition } from 'react-move'
import { Rating } from 'material-ui-rating';

class ItineraryCard extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      image: {
        maxHeight: '500px'
      }
    };

    this.durations = {
      '0.5': 'half-day',
      '1': 'full day',
      '1.5': 'day and a half',
      '2': '2 days'
    }
  }

  render() {
    const { item, acumTime, style } = this.props;
    let { image, duration, spot, rating, content, city } = item;
    spot = spot.replace(/\b\w/g, l => l.toUpperCase()); // capitalize
    content = content.substring(0, 200);

    const cardTitle = (
      <CardTitle title={ spot } subtitle={ city } />
    );

    return (
      <Card style={ style }>
        <CardHeader
          title={ `Day ${ Math.ceil(acumTime) }` }
          subtitle={ this.durations[duration.toString()] }
          avatar={ image } />
        <CardMedia overlay={ cardTitle }>
          <img src={ image } style={ this.styles.image } />
        </CardMedia>
        <CardText>
          { content } 
        </CardText>
        <CardActions>
          <FlatButton label="See More" />
          <FlatButton label="Remove" />
        </CardActions>
      </Card>
    );
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
        minWidth: '175px',
        width: 'calc(100% * (1/4) - 10px - 1px)',
      }
    }
  }
  render() {
    let acumTime = 0;
    return (
      <div style={ this.styles.flex }>
        {this.props.itinerary.map(item => {
          acumTime += item.duration;
          return (
            <ItineraryCard
              style={ this.styles.child }
              key={ item.spot }
              acumTime={ acumTime }
              item={ item } />
          );
        })}
      </div>
    );
  }
}

