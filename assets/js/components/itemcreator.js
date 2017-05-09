import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';
import { Rating } from 'material-ui-rating';

import TimeSlots from './timeslots';

export default class ItemCreator extends React.Component  {

  constructor(props) {
    super(props);

    this.styles = {
      item_creator: {
        width: '100%',
      },
      spot: {
        marginTop: '-24px',
      },
      rating: {
        height: '35px',
      },
    };

    this.state = {
      rating: 3,
      value: "",
      disabled: true,
      timeslot: 0
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleToogle = this.handleToogle.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear() {
    this.setState({
      rating: 3,
      value: "",
      disable: true,
      timeslot: 0
    });
  }

  handleTextChange(event) {
    let state = this.state;
    state.disabled = event.target.value == "";
    state.value = event.target.value;
    this.setState(state);
  }

  handleToogle(index) {
    let state = this.state;
    state.timeslot = index;
    this.setState(state);
  }

  handleRatingChange(value) {
    let { timeslot } = this.state;
    let { spots } = this.props;

    let newName = this.refs.spot_name.getValue();
    let index = spots.map((item, index) => item.name).indexOf(newName);
    let spot = {
      name: newName,
      rating: value,
      duration: (timeslot + 1) * 0.5
    };

    if (index == -1) {
      spots.push(spot);
    } else {
      spots[index] = spot;
    }

    this.clear();
    this.props.handleUpdateSpots(spots);
  }

  render() {
    const text1 = "Rate with stars to add your new spot in your wishlist";
    const text2 = "Introduce the name of the spot to visit";
    const maxRate = 6;

    const {
      value,
      rating,
      disabled,
      timeslot
    } = this.state;

    return (
      <div style={ this.styles.item_creator }>
        <TextField
          ref="spot_name"
          value={ value }
          onChange={ this.handleTextChange }
          hintText={ text1 }
          fullWidth={ true }
          floatingLabelText={ text2 }
          style={ this.styles.spot } />

        <TimeSlots
          handleToogle={ this.handleToogle }
          timeslot={ timeslot } />

        <Rating
          ref="rating"
          value={ rating }
          max={ maxRate }
          onChange={ this.handleRatingChange }
          disabled={ disabled }
          style={ this.styles.rating } />
      </div>
    );
  }
}
