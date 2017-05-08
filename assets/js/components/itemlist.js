import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';

export default class ItemList extends React.Component  {
  constructor(props) {
    super(props);
    this.styles = {
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        margin: '20px 5px 20px 5px',
        gridColumn: '1 / span 4',
        gridRow: 5,
      },
      chip: {
        margin: 4,
      },
    }
  }
  render() {
    return (
      <div style={this.styles.chips}>
      {this.props.items.map((spot, index) =>
        <Chip
          key={spot.name}
          onRequestDelete={() => this.props.handleDeleteChip(index)}
          style={this.styles.chip} >
          {spot.name}
        </Chip>
      )}
      </div>
    );
  }
}

