import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  componentDidMount() {
    console.log('Process Speech');
    this.processTranscript();
  }

  componentDidUpdate(prevProps) {
    console.log(`componenetDidUpdate(${prevProps.step});`);
    if (prevProps.step !== this.props.step) {
      this.processTranscript();
    }
  }

  processTranscript() {
    const { step } = this.props;
    console.log(step);
    switch (step) {
      case 1:
        this.processInitialReport();
        break;
      case 2:
        this.processSecondaryReport();
        break;
      case 3:
        this.processArrivals();
        break;
      default:
        break;
    }
  }
  ////////STEP 1////////////
  dispatchInfo() {
    
  }

  repeatDispatchInfo(){

  }
  /////////STEP 1////////////

  /////////STEP 2/////////////
  processInitialReport() {
    console.log('Process Initial');
    this.processReport();
  }
  /////////STEP 2/////////////

  ////////STEP 3//////////////
  processSecondaryReport() {
    console.log('Secondary Report');
    this.processReport();
  }
  ////////STEP 3//////////////

  processArrivals() {
    console.log('Process Arrival');
    const { firstAlarm } = this.props;
    const phrase = `${firstAlarm[0]} staged and awaiting assignment.`;
    //this.props.handleSpeak(phrase);
    this.props.handleSpeak(phrase, 'enUS_Female', 5000);
  }

  processReport() {
    //const { step } = this.props;
    //const updatedStep = step + 1;
    const phrase = this.dispatchCenterCopies();
    this.props.handleSpeak(phrase);
    //this.props.handleStepUpdate(updatedStep);
    this.props.handleTranscriptReset();
  }

  dispatchCenterCopies() {
    const { transcript, dispatchCenter } = this.props;;
    return `${dispatchCenter} copies ${transcript}`;
  }

  render() {
    return <div />;
  }
}
