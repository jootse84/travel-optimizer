import React from 'react';
import ReactDOM from 'react-dom';

import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import ItemList from './plannerForm/ItemList';
import DateSelector from './plannerForm/DateSelector';
import ItemCreator from './plannerForm/ItemCreator';
import FlatButton from 'material-ui/FlatButton';

import Cities from '../cities';

import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';


export default class PlannerForm extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      stepIndex: 0,
      spots: [],
      city: "",
      startDate: null,
      endDate: null,
      vertical: $(window).width() < 900,
    };

    this.styles = {
      button: {
        width: '100%',
        margin: '20px 0',
      },
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.formReady = this.formReady.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.updateVertical = this.updateVertical.bind(this);
  }

  updateVertical() {
    this.setState({ vertical: $(window).width() < 900 });
  }
  componentWillMount() {
    this.updateVertical();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateVertical);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateVertical);
  }

  handleNext() {
    const { stepIndex } = this.state;
    if (stepIndex < 3) {
      this.setState({
        stepIndex: stepIndex + 1
      });
    }
  }

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1
      });
    }
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  formReady() {
    const { spots, startDate, endDate, city } = this.state;
    return (spots.length > 0 && startDate && endDate && city);
  }

  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0', textAlign: 'center'}}>
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
        )}
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
        />
      </div>
    );
  }

  getStepContent() {
    const {
      stepIndex,
      spots,
      startDate,
      endDate,
      vertical,
    } = this.state;

    switch (stepIndex) {
      case 0:
        return (
          <div>
            <CitySelector
              onCityChanged={ (city) => this.setState({ city }) }
            />
            { this.renderStepActions(0) }
          </div>
        );
      case 1:
        return (
          <div>
            <DateSelector
              maxDate={ endDate }
              minDate={ startDate }
              handleStartDateChange={ (ev, startDate) => this.setState({ startDate }) }
              handleEndDateChange={ (ev, endDate) => this.setState({ endDate }) }
            />
            { this.renderStepActions(1) }
          </div>
        );
      case 2:
        return (
          <div>
            <ItemCreator
              spots={ spots }
              handleUpdateSpots={ (spots) => this.setState({ spots }) }
            />
            <ItemList
              items={ spots }
              handleDeleteChip={this.handleDeleteChip}
            />
            { this.renderStepActions(2) }
          </div>
        );
      case 3:
        return (
          <div>
            <RaisedButton
              label="Plan my trip!"
              primary={ true }
              disabled={ !this.formReady() }
              style={ this.styles.button }
              onTouchTap={ this.handleOnTouchTap }
            />
          </div>
        );
    }
  }

  render() {
    const {
      stepIndex,
      spots,
      startDate,
      endDate,
      vertical,
    } = this.state;

    if (vertical) {
      return (
        <Stepper
          activeStep={ stepIndex }
          linear={ false }
          orientation="vertical"
        >
          <Step>
            <StepButton
              onTouchTap={() => this.setState({ stepIndex: 0 })}
            >
              Your destination 
            </StepButton>
            <StepContent>
              <CitySelector
                onCityChanged={ (city) => this.setState({ city }) }
              />
              { this.renderStepActions(0) }
            </StepContent>
          </Step>
          <Step>
            <StepButton
              onTouchTap={ () => this.setState({ stepIndex: 1 }) }
            >
              Your dates
            </StepButton>
            <StepContent>
              <DateSelector
                maxDate={ endDate }
                minDate={ startDate }
                handleStartDateChange={ (ev, startDate) => this.setState({ startDate }) }
                handleEndDateChange={ (ev, endDate) => this.setState({ endDate }) }
              />
              { this.renderStepActions(1) }
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={ () => this.setState({ stepIndex: 2 }) }>
              Introduce your spots to visit 
            </StepButton>
            <StepContent>
              <ItemCreator
                spots={ spots }
                handleUpdateSpots={ (spots) => this.setState({ spots }) }
              />
              <ItemList
                items={ spots }
                handleDeleteChip={this.handleDeleteChip}
              />
              { this.renderStepActions(2) }
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 3})}>
              Confirm the information 
            </StepButton>
            <StepContent>
              <RaisedButton
                label="Plan my trip!"
                primary={ true }
                disabled={ !this.formReady() }
                style={ this.styles.button }
                onTouchTap={ this.handleOnTouchTap }
              />
            </StepContent>
          </Step>
        </Stepper>
      );
    } else {
      return (
        <section>
          <Stepper
            activeStep={ stepIndex }
            linear={ false }
          >
            <Step>
              <StepButton
                onTouchTap={() => this.setState({ stepIndex: 0 })}
              >
                Your destination 
              </StepButton>
            </Step>
            <Step>
              <StepButton
                onTouchTap={ () => this.setState({ stepIndex: 1 }) }
              >
                Your dates
              </StepButton>
            </Step>
            <Step>
              <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
                Introduce your spots to visit 
              </StepButton>
            </Step>
            <Step>
              <StepButton onTouchTap={() => this.setState({stepIndex: 3})}>
                Confirm the information 
              </StepButton>
            </Step>
          </Stepper>
          <div style={{ margin: '0 5vw' }}>
            { this.getStepContent() }
          </div>
        </section>
      );
    }
  }
}


class CitySelector extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      city: {
        // marginTop: '-24px',
      }
    };

    this.state = {
      city: "",
      cities: [],
    };

    this.cities = new Cities();
    this.handleCityChange = this.handleCityChange.bind(this);
  }

  handleCityChange(value) {
    const { onCityChanged } = this.props;

    if (value == '') {
      this.setState({
        cities: [],
        city: ''
      });
      if (onCityChanged) {
        onCityChanged('');
      }
    } else {
      this.cities.getCities(value, (result) => {
        this.setState({
          cities: result,
          city: value,
        });
        if (onCityChanged) {
          onCityChanged(value);
        }
      });
    }
  }

  render() {
    const {
      cities,
    } = this.state;

    return (
      <AutoComplete
        ref="city"
        open={ true }
        onUpdateInput={ this.handleCityChange }
        dataSource={ cities }
        fullWidth={ true }
        filter={ AutoComplete.caseInsensitiveFilter }
        hintText="Enter city or country"
        floatingLabelText="Introduce your destination"
        style={ this.styles.city }
      />
    );
  }
}

class PlannerForm2 extends React.Component {
//export default class PlannerForm2 extends React.Component {

  constructor(props) {
    super(props);
    this.styles = {
      button: {
        width: '100%',
      },
      flex: {
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
      },
      flex1: {
        flex: 1,
        minWidth: '200px',
        margin: '5px 25px 35px 5px',
      },
      flex2: {
        flex: 2,
        margin: '5px 5px 15px 5px',
      }
    };

    this.state = {
      spots: [],
      rating: 3,
      city: "",
      value: "",
      disabled: true,
      startDate: null,
      endDate: null,
      loading: false,
      timeslot: 0,
    };

    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleOnTouchTap = this.handleOnTouchTap.bind(this);
    this.formReady = this.formReady.bind(this);
    this.clear = this.clear.bind(this);
  }

  handleDeleteChip(index) {
    let state = this.state
    state.spots.splice(index, 1);
    this.setState({ state });
  }

  handleOnTouchTap() {
    let {
      spots,
      startDate,
      endDate,
      city,
    } = this.state
    
    this.props.onConfirmPlan(spots, startDate, endDate, city);
  }

  clear() {
    this.setState({
      disabled: true,
      value: "",
      timeslot: 0,
      spots: [],
    });
  }

  formReady() {
    const { spots, startDate, endDate, city } = this.state;
    return (spots.length > 0 && startDate && endDate && city)
  }

  render() {
    const {
      startDate,
      endDate,
      spots,
    } = this.state;

    return (
      <section>
        <div style={this.styles.flex}>
          <div style={this.styles.flex1}>
            <CitySelector
              onCityChanged={ (city) => this.setState({ city }) }
            />
            <DateSelector
              maxDate={ endDate }
              minDate={ startDate }
              handleStartDateChange={ (ev, startDate) => this.setState({ startDate }) }
              handleEndDateChange={ (ev, endDate) => this.setState({ endDate }) }
            />
          </div>

          <div style={this.styles.flex2}>
            <ItemCreator
              spots={ spots }
              handleUpdateSpots={ (spots) => this.setState({ spots }) }
            />
          </div>
        </div>

        <ItemList
          items={spots}
          handleDeleteChip={this.handleDeleteChip}
        />
        <RaisedButton
          label="Plan my trip!"
          primary={ true }
          disabled={ !this.formReady() }
          style={ this.styles.button }
          onTouchTap={ this.handleOnTouchTap }
        />
      </section>
    );
  }
}
