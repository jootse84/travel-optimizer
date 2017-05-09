import React from 'react';
import ReactDOM from 'react-dom';
//import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
//import FlagIconFactory from 'react-flag-icon-css';
import axios from 'axios';

//const FlagIcon = FlagIconFactory(React)

export default class Cities {

  constructor () {
    this.api = axios.create({
      baseURL: '/',
      headers: {
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
      }
    });
  }

  getCities (filter, fn) {
    this.api.get(`cities/${filter}/`, {}).then(res => {
      fn(res.data.map(function (city) {
        if (city.isCountry) {
          return {
            text: city.name,
            value: (
              <MenuItem
                primaryText={city.name}
                secondaryText="&#9786;"
              />
            ),
          };
        } else {
          return {
            text: city.name,
            value: (
              <MenuItem
                primaryText={city.name}
                secondaryText={`(${city.country})`}
                //rightIcon={<FlagIcon code="it" size={'50px'} />}
              />
            ),
          };
        }
      }));
    });
  }
};
