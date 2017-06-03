import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import { Tabs, Tab } from 'material-ui/Tabs';
// icons
import MapsMap from 'material-ui/svg-icons/maps/map';
import ActionList from 'material-ui/svg-icons/action/list';
import ImagePictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import HardwareKeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-backspace';
import SocialShare from 'material-ui/svg-icons/social/share';
import CircularProgress from 'material-ui/CircularProgress';

import DayItinerary from './itinerary/DayItinerary';

const STATUS = {
  ITINERARY: 0,
  MAP: 2,
}

export default class Itinerary extends React.Component {
  constructor(props) {
    super(props);

    this.styles = {
      nav: {
        boxShadow: `rgba(0, 0, 0, 0.12) 0px 1px 6px,
          rgba(0, 0, 0, 0.12) 0px 1px 4px`,
      },
      tabs: {
        height: '100%',
        width: '100%',
      },
    };

    this.state = {
      mapReady: false,
      itinerary: props.itinerary,
      selected: STATUS.ITINERARY,
    }

    this.renderContent = this.renderContent.bind(this);
  }

  componentWillMount() {
    const {
      itinerary,
      csrftoken,
      city
    } = this.props;

    let api = axios.create({
      baseURL: '/',
      timeout: 150000,
      headers: {'X-CSRFToken': csrftoken}
    });

    // create map
    api.post('map', { itinerary, city }).then(res => {
      this.setState({
        map_id: res.data.id,
        mapReady: true,
      });
    });

    // retrieve attractions info
    let attractions = new Set();
    let positions = {}; // dictionary of spots with saved positions in itinerary
    itinerary.forEach((day, index) => {
      for (let key in day.attractions) {
        let attr = day.attractions[key];
        attractions.add(attr.spot);
        if (positions[attr.spot]) {
          positions[attr.spot].push({
            key,
            index,
          });
        } else {
          positions[attr.spot] = [{
            key,
            index,
          }];
        }
      }
    });

    attractions.forEach((spot) => {
      api.get(`/cities/${city}/attractions/${spot}/`, {}).then(res => {
        const { images, summary, url } = res.data;
        let { itinerary } = this.state;

        positions[spot].forEach((obj) => {
          let { key, index } = obj;
          itinerary[index].attractions[key]["images"] = images;
          itinerary[index].attractions[key]["content"] = summary;
          itinerary[index].attractions[key]["url"] = url;
          itinerary[index].attractions[key]["ready"] = true;
        });
        this.setState({ itinerary });
      });
    });
  }

  renderContent() {
    switch(this.state.selected) {

      case STATUS.MAP:
        const { map_id } = this.state;
        return (
          <iframe
            src={`/renderMap?id=${map_id}`}
            className="map"
          />
        );

      default:
        const { itinerary } = this.state;
        return (
          <Tabs style={ this.styles.tabs }>
            {itinerary ? itinerary.map((day) =>
              <Tab
                label={day.label}
                key={day.label}
              >
                <DayItinerary
                  day={ day }
                  {...this.props}
                />
              </Tab>
            ) : (
              <div> no attractions </div>
            )}
          </Tabs>
        );
    }
  }

  render() {
    const {
      mapReady,
      selected,
      itinerary,
    } = this.state;

    return (
      <div>
        { this.renderContent() }
        <BottomNavigation
          style={ this.styles.nav }
          selectedIndex={ selected }
        >
          <BottomNavigationItem
            label="Itinerary"
            icon={ <ActionList /> }
            onTouchTap={() => this.setState({ selected: 0 })}
          />
          <BottomNavigationItem
            label="Save as PDF"
            icon={ <ImagePictureAsPdf /> }
            onTouchTap={() => this.setState({ selected: 1 })}
          />
          { mapReady ? (
            <BottomNavigationItem
              label="Map"
              icon={ <MapsMap /> }
              onTouchTap={() => this.setState({ selected: 2 })}
            />
          ):(
            <BottomNavigationItem
              label="...loading map"
              icon={ <CircularProgress size={25} thickness={ 2 } /> }
            />
          )}
          <BottomNavigationItem
            label="Share"
            icon={ <SocialShare /> }
            onTouchTap={() => this.setState({ selected: 3 })}
          />
        </BottomNavigation>
      </div>
    );
  }
}

