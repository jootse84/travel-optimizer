import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';

import { Transition } from 'react-move'
import { Rating } from 'material-ui-rating';

import moment from 'moment'

class ItineraryCard extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      image: {
        height: '200px'
      },
      progress: {
        margin: '50px 0 50px 0',
        textAlign: 'center',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: '40% 60%',
        gridTemplateAreas: '"image text"',
        gridGap: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        borderRadius: '2px',
        // flexbox
        flexGrow: '1',
        margin: '10px 0 0 2%',
        minWidth: '275px',
        padding: '15px',
      },
      flex: {
        // just flexbox
        flexGrow: '1',
        margin: '10px 0 0 2%',
        minWidth: '275px',
        padding: '15px',
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

    this.state = {
      image: null,
      content: "",
      url: "",
      ready: false,
      responsive: (window.innerWidth < 550),
    };

    this.durations = {
      '0.5': 'half-day',
      '1': 'full day',
      '1.5': 'day and a half',
      '2': '2 days'
    }
  }

  componentWillMount() {
    let { city } = this.props;
    let { spot } = this.props.item;

    axios.create({
      baseURL: '/cities/',
      timeout: 50000,
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
    const { item, city } = this.props;
    let { duration, spot, rating } = item; // content, image

    spot = spot.replace(/\b\w/g, l => l.toUpperCase()); // capitalize
    content = content.split(' ').slice(0, 75).join(' ') + '...'; // first 75 words
    const cardTitle = (
      <CardTitle title={ spot } subtitle={ city } />
    );

    if (ready) {
      if (!this.state.responsive) {
        return (
          <div style={this.styles.grid} className="card">
            <Card style={ this.styles.gridImage }>
              <CardHeader
                title={ spot }
                subtitle={ this.durations[duration.toString()] }
                avatar={ image }
              />
              <CardMedia overlay={ cardTitle }>
                <img src={ image } style={ this.styles.image } />
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
          <Card style={ this.styles.flex }>
            <CardHeader
              title={ spot }
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
              <div style={ this.styles.buttons }> 
                <FlatButton
                  label="See More"
                  href={ url }
                />
              </div>
            </CardActions>
          </Card>
        );
      }
    } else {
      let style = this.state.responsive? this.styles.flex: this.styles.grid;
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

/*
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
        //width: 'calc(100% * (1/4) - 10px - 1px)',
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
*/

export default class Itinerary extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
      itinerary: {
        margin: '20px',
      },
      transition: {
        'margin': '20px 0 20px 0'
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

