import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  componentDidMount() {
    const {step, transcript} = this.props;
    console.log('STEP IS '+ step);
    console.log('TRANSCCRIPT IS'+ transcript);
    console.log('Process Speech');
    this.processTranscript();
  }

  componentDidUpdate(prevProps) {
    const {transcript} = this.props;
    console.log(`componenetDidUpdate(${prevProps.step});`);
    if (prevProps.step !== this.props.step) {
      this.processTranscript();
      console.log(transcript);
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
    var { firstAlarm, calling_units, calling_units_length, step4_index, step, transcript } = this.props;
    // if(step4_index < calling_units_length){
      console.log('Process Arrival');
      const phrase = `${firstAlarm[step4_index]} staged and awaiting assignment.`;
      step4_index++;
      //this.props.handleSpeak(phrase);
      this.props.speechCallback(firstAlarm, calling_units, calling_units_length, step4_index);
      console.log('Transcript is '+ transcript);
      console.log('STEP in SPEECH IS '+ step);
      console.log('STEP 4 INDEX IS '+ step4_index);
      if(step===3){
        this.decisionOnSpeech(transcript, step4_index);
        this.props.handleSpeak(transcript, 'enUS_Female', 5000);
        //this.props.handleTranscriptReset();
      }
      else{
        this.props.handleSpeak(transcript, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
    } 
      // this.props.handleSpeak(phrase, 'enUS_Female', 5000);
    // } 
  }

  processReport() {
    const { transcript } = this.props;
    //const updatedStep = step + 1;
    const phrase = this.dispatchCenterCopies();
    this.props.handleSpeak(phrase);
    //this.props.handleStepUpdate(updatedStep);
    this.props.handleTranscriptReset();
      
  }

  dispatchCenterCopies() {
    const { transcript, dispatchCenter } = this.props;
    return `${dispatchCenter} copies ${transcript}`;
  }

  render() {
    return <div />;
  }

  
  decisionOnSpeech = (user_speech, index) => {
    var { checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2KeywordDictionary,
      alarm2_called } = this.props;
    console.log('decision on speech is caalled');
    console.log(user_speech);
    console.log(alarm2KeywordDictionary);
    
    checkUserSpeech = 0;    //if it is matched
    assignKeyword = 0;      //Check if assigned keyword is detected
    parDetected = 0;        //Check if PAR keyword is detected
    nameDetected = 0;       //Check if some name is called
    var nameIndex = 0;      //Index on which it is found
    assigned = 0;           //Check if any group is assigned
    simpleAssignment = 0;   //Simple assignment response
    ///////DETECTING USER SPEECH KEYWORDS///////////////////////
    //var user_speech = user_speech.toLowerCase();
    var i = 0;
    var goAssignment = 0;
    var assignKeywordFound = 0;

    // ====================== ALARM 2 ====================== //
    if(!checkUserSpeech){
      alarm2KeywordDictionary.forEach(function (elem) {
        console.log('Element is '+ elem);
            var re = new RegExp(elem, "gi");
            if (user_speech.match(re)) {
              console.log('Alarm 2 detected');
                checkUserSpeech = 1;
            }
        });

        if(checkUserSpeech && !alarm2_called){
            console.log('Calling alarm 2');
            //onCallingAlarm();
        }
    }
    // ====================== ALARM 2 ====================== //
  }
  // calling_units_length, Alarm2
  // onCallingAlarm = () => {
  //   var { checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2KeywordDictionary,
  //     alarm2_called } = this.props;
  //   alarm2_called = 1;      //Don't add alarm 2 units again to calling_unit array
  //   calling_units_length = calling_units_length + alarm2_units.length;  //for step 4
  //   var alarm2_index = calling_units.length;
  //   // alert(step4_index);
  //   // step4_index--;
  //   repeat = 1;
  //   alarm2_names = "";
  //   alarm2_units.forEach(unit2 => {             //Adding alarm 2 units to calling unit
  //       alarm2_names += unit2.name + ", ";
  //       calling_units[alarm2_index] = [];
  //       calling_units[alarm2_index].name = unit2.name;
  //       calling_units[alarm2_index].voice = getRandomInt(max);
  //       alarm2_index++;
  //   });
  //   console.log('Alarm has been added to calling units');
  //   console.log(alarm2_names);
  //   var bingClientTTS = new BingSpeech.TTSClient(key);
  //   bingClientTTS.synthesize("Dispatch Copies: " + alarm2_names, BingSpeech.SupportedLocales.enUS_Female,
  //   () => {
  //       speakUp();
  //   });
  //   fullTranscript();
  // }
}
