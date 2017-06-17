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




import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';


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
      image: {
        width: '100%',
        height: '100%',
        filter: 'contrast(1)',
        WebkitFilter: 'contrast(1)',
        MozFilter: 'contrast(1)',
        OFilter: 'contrast(1)',
        MsFilter: 'contrast(1)',
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
        const totalDays = itinerary.length;

        if (totalDays > 0) {
          const halfDayRows = 4;
          const rowHeight = 56;

          let layouts = {
            lg: [],
            md: [],
            sm: [],
            xs: [],
            xxs: [],
          };
          let cards = [];

          let indices = 0;
          for (let day of itinerary.keys()) {
            const {
              attractions,
              label,
            } = itinerary[day];

            // Day static card
            let layout = {
              i: indices.toString(),
              x: day,
              y: 0,
              w: 1,
              h: 1,
              static: true
            };
            for (let key of Object.keys(layouts)) {
              layouts[key].push(layout);
            }

            cards.push(
              <div key={ indices }>
                <Toolbar
                  style={{ backgroundColor: 'rgb(212, 55, 28)', color: 'white' }}
                >
                  <ToolbarGroup>
                    <ToolbarTitle
                      text={ label }
                      style={{ color: 'white' }}
                    />
                    <ToolbarSeparator />
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <IconMenu
                      iconButtonElement={
                        <IconButton touch={true}>
                          <NavigationExpandMoreIcon />
                        </IconButton>
                      }
                    >
                      <MenuItem primaryText="Find me restaurant for lunch!" />
                      <MenuItem primaryText="Find me restaurant for dinner!" />
                    </IconMenu>
                  </ToolbarGroup>
                </Toolbar> 
              </div>
            );
            indices ++;

            let yPos = 1;
            for (let attr of attractions) {
              let duration = halfDayRows * 2 * attr.duration;
              let layout = {
                i: indices.toString(),
                x: day,
                y: yPos,
                w: 1,
                h: duration,
                isDraggable: false,
                isResizable: false
              };
              for (let key of Object.keys(layouts)) {
                layouts[key].push(layout);
              }

              if (attr.images) {
                cards.push(
                  <div key={ indices.toString() }>
                    <Card style={{ cursor: 'pointer' }}>
                      <CardMedia overlay={<CardTitle
                        title={ <div> {attr.spot}</div> }
                        subtitle={ attr.city }
                      />}>
                        <img
                          src={ attr.images[0] }
                          style={ this.styles.image }
                        />
                      </CardMedia>
                    </Card>
                  </div>
                );
              } else {
                cards.push(
                  <div
                    style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}
                    key={ indices.toString() }
                  >
                    <CircularProgress
                      size={150}
                      thickness={ 2 }
                    />
                  </div>
                );
              }
              yPos += duration;
              indices++;
            }
          }

          const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
          let columns = {
            lg: totalDays,
            md: Math.min(totalDays, 4),
            sm: Math.min(totalDays, 2),
            xs: 1, xxs: 1
          };

          console.log(layouts);
          console.log(columns);

          return (
            <ResponsiveReactGridLayout
              className="layout"
              layouts={ layouts }
              rowHeight={ rowHeight }
              breakpoints={ breakpoints }
              cols={ columns }
            >
              {cards}
            </ResponsiveReactGridLayout>
          );
        }
        return <div/>;
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
        { this.renderContent() }
      </div>
    );
  }
}

