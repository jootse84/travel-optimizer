import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';

class ItineraryCard extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
      card: {
        transform: `translateX(${100 * props.item.state.translate}px)`,
        opacity: props.item.state.opacity,
        color: props.item.state.color
      },
    }
  }
  render() {
    const { item, acumTime } = this.props;
    let newday;
    if (item.data.duration > 1 || (acumTime * 2) % 2 == 0) {
      newday = (
        <div style={{'textAlign': 'right', 'fontSize': '10px'}}>
          day {parseInt(acumTime)}
          <hr/>
        </div>
      );
    }
    return (
      <span
        key={item.key}
        style={this.styles.card} >
        {item.data.spot} - { item.data.duration }
        <Rating
          value={item.data.rating}
          max={item.data.rating}
        />
        {newday}
      </span>
    );
  }
}


export default class Itinerary extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
    }
  }
  render() {
    return (
      <Transition
        style={{'margin': '20px 0 20px 0'}}
        data={this.props.itinerary}
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
                acumTime += item.data.duration
                return (
                  <ItineraryCard
                    acumTime={acumTime}
                    item={item} />
                )
              })}
            </span>
          )
        }}
      </Transition>
    );
  }
}

