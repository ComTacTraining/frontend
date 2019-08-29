import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  componentDidMount() {
    this.processTranscript();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.childProps.transcript !== this.props.childProps.transcript) {
      this.processTranscript();
    }
  }

  processTranscript() {
    const { initialReportComplete, threeSixtyComplete } = this.props.childProps;
    if (this.includesAnyText(['2nd alarm', 'second alarm'])) {
      this.processSecondAlarm();
    } else if (!initialReportComplete) {
      this.processInitialReport();
    } else if (!threeSixtyComplete) {
      this.processThreeSixtyAssessment();
    } else if (this.includesText('face')) {
      this.processFaceToFace();
    }
  }

  processInitialReport() {
    const { transcript, dispatchCenter } = this.props.childProps;
    const phrase = `${dispatchCenter} copies ${transcript}`;
    this.props.childProps.handleSpeak(phrase);
    const updates = { initialReportComplete: true, transcript: '' };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  processThreeSixtyAssessment() {
    const { transcript, dispatchCenter } = this.props.childProps;
    const phrase = `${dispatchCenter} copies ${transcript}`;
    this.props.childProps.handleSpeak(phrase);
    const updates = { threeSixtyComplete: true, transcript: '' };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  processSecondAlarm() {
    const { incidentCommander, dispatchCenter, alarms } = this.props.childProps;
    const phrase = `${incidentCommander} from ${dispatchCenter}, your second alarm units are: ${alarms.alarm2}`;
    this.props.childProps.handleSpeak(phrase);
    this.props.childProps.handleProcessSpeechComplete({ transcript: '' });
  }

  processFaceToFace() {
    const { transcript, dispatchCenter } = this.props.childProps;
    const phrase = `${dispatchCenter} copies ${transcript}`;
    this.props.childProps.handleSpeak(phrase);
    const updates = { faceToFaceComplete: true, transcript: '' };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  includesText(text) {
    const { transcript } = this.props.childProps;
    return transcript.toUpperCase().includes(text.toUpperCase());
  }

  includesAnyText(texts) {
    let foundAny = false;
    texts.forEach(text => {
      if (this.includesText(text)) {
        foundAny = true;
      }
    });
    return foundAny;
  }

  includesAllText(texts) {
    let foundAll = true;
    texts.forEach(text => {
      if (!this.includesText(text)) {
        foundAll = false;
      }
    });
    return foundAll;
  }

  render() {
    return <div />;
  }
  /*
  
  decisionOnSpeech = (user_speech, index) => {
    var {userSpeechChanged} = this.state;
    //Changing variables
    //checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2_called, assignmentCheck
    //parDetected, parKeyword, parSpeech, parSpeechIndex, repeat, calling_units
    var { checkUserSpeech, assignKeyword, nameDetected, assigned, simpleAssignment,
      alarm2_called, firstAlarm, calling_units, calling_units_length, step4_index, secondAlarm, assignmentCheck,
      groups, repeat,
      alarm2KeywordDictionary,assignKeywordDictionary,parKeywordDictionary,fireAttackDictionary,exposureGroupDictionary,ventGroupDictionary,rickGroupDictionary,
      parDetected, parKeyword, parSpeech, parSpeechIndex  } = this.props;
    console.log('decision on speech is called');
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
            var re = new RegExp(elem, "gi");
            if (user_speech.match(re)) {
              console.log('Alarm 2 detected');
                checkUserSpeech = 1;
            }
        });

        if(checkUserSpeech && !alarm2_called){
          var phrase= 'Dispatch copies ';
          secondAlarm.forEach((elem)=>{
            phrase += elem + '';
          });
          this.props.handleSpeak(phrase, 'enUS_Female', 5000);
          assignmentCheck = 1;
          this.props.speechCallback(firstAlarm, calling_units, calling_units_length, step4_index, assignmentCheck, assignKeyword, parKeyword, parDetected, parSpeech, parSpeechIndex);

        }
    }
    // ====================== ALARM 2 ====================== //

    // ====================== ASSIGN ====================== //
    if(!checkUserSpeech){
      assignKeywordDictionary.forEach(function (elem) {
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              checkUserSpeech = 0;    //Because not to break condition if found
              assignKeyword = 1;
          }
      });
      if(assignKeyword) {
          console.log('Assign keyword detected');
      }
    }
    // ====================== ASSIGN ====================== //

    // ====================== PAR REPORT ====================== //
    if(!checkUserSpeech){
      parKeywordDictionary.forEach(function (elem) {
          console.log('Inside PAR');
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              console.log('PAR SEARCHING')
              checkUserSpeech = 0;
              parDetected = 1;
              parKeyword = 1;
              parSpeech[parSpeechIndex] = user_speech;
              parSpeechIndex++;
          }
          console.log('PAR DETECTED : ' + parDetected);
      });
      if(parDetected)   //Check if it is not already assigned to someone
      {
          console.log('PAR keyword detected');
      }
    }
    // ====================== PAR REPORT ====================== //

    // ====================== FIRE ATTACK ====================== //
    if(!checkUserSpeech){
      console.log('In fire attack');
      fireAttackDictionary.forEach(function (elem) {
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              checkUserSpeech = 1;
              console.log('Fire attack matched');
          }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
          if(!groups[0].assigned && !parDetected){    // Simple assignment
              repeat = 0;
              calling_units[index].group = 'Fire attack';
              groups[0].assigned_to.push(calling_units[index].name);
              groups[0].assigned = 1;
              // userAssignTranscript();
              simpleAssignment = 1;
              this.changeKeywords(user_speech);
              user_speech = userSpeechChanged;
              console.log('Fire attack assigned to ' + calling_units[step4_index]);
              this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
          }

          else {      // IF PAR AND ALREADY ASSIGNED
              if(!parDetected){   //If assigned
                  if(groups[0].assigned && !assignKeyword){
                      console.log('Assigned keyword and calling response');
                      groups[0].response = 1;
                      repeat = 1;
                      this.giveResponse(0, assignKeyword, parDetected);
                      step4_index--;
                  }
                  else {      // IF ASSIGNED
                      console.log('Fire attack assigned with assign keyword')
                      repeat = 0;
                      groups[0].assigned_to.push(calling_units[index].name);
                      groups[0].assigned = 1;
                      this.giveResponse(0, assignKeyword, parDetected);
                      // userAssignTranscript();
                  }
              }

              else {  //FIRE ATTACK PAR
                  console.log('I am in par function to call response');
                  repeat = 1;
                  this.giveResponse(0, assignKeyword, parDetected);
                  step4_index--;
              }
          }
      }
    }
    // ====================== FIRE ATTACK ====================== //

    // ====================== EXPOSURE GROUP ====================== //
    if(!checkUserSpeech){
      console.log('in exposure');
      exposureGroupDictionary.forEach(function (elem) {
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              checkUserSpeech = 1;
          }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
          if(!groups[1].assigned && !parDetected){    // Simple assignment
              repeat = 0;
              calling_units[index].group = 'Exposure';
              groups[1].assigned_to.push(calling_units[index].name);
              groups[1].assigned = 1;
              // userAssignTranscript();
              simpleAssignment = 1;
              this.changeKeywords(user_speech);
              user_speech = userSpeechChanged;
              console.log('Exposure group has been assigned to ' + calling_units[step4_index]);
              this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);

          }

          else {      //else give response
              if(!parDetected){
                  if(groups[1].assigned && !assignKeyword){
                      repeat = 1;
                      groups[1].response = 1;
                      this.giveResponse(1, assignKeyword, parDetected);
                      step4_index--;
                  }
                  else {
                      repeat = 0;
                      groups[1].assigned_to.push(calling_units[index].name);
                      groups[1].assigned = 1;
                      this.giveResponse(1, assignKeyword, parDetected);
                      // userAssignTranscript();
                  }
              }

              else {
                  console.log('I am in par fnction to call response')
                  repeat = 1;
                  this.giveResponse(1, assignKeyword, parDetected);
                  step4_index--;
              }
          }
      }
    }
    // ====================== EXPOSURE GROUP ====================== //

    // ====================== VENTILATION GROUP ====================== //
    if(!checkUserSpeech){
      console.log('In vent');

      ventGroupDictionary.forEach(function (elem) {
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              checkUserSpeech = 1;
          }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
          if(!groups[2].assigned && !parDetected){
              repeat = 0;
              calling_units[index].group = 'Vent';
              groups[2].assigned_to.push(calling_units[index].name);
              groups[2].assigned = 1;
              // userAssignTranscript();
              simpleAssignment = 1;
              this.changeKeywords(user_speech);
              user_speech = userSpeechChanged;
              console.log('Vent group has been assigned to ' + calling_units[step4_index]);
              this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
          }

          else {      //else give response
              if(!parDetected){

                  if(groups[2].assigned && !assignKeyword){
                      groups[2].response = 1;
                      repeat = 1;
                      this.giveResponse(2, assignKeyword, parDetected);
                      step4_index--;
                  }
                  else {
                      repeat = 0;
                      groups[2].assigned_to.push(calling_units[index].name);
                      groups[2].assigned = 1;
                      this.giveResponse(2, assignKeyword, parDetected);
                      // userAssignTranscript();
                  }
              }

              else {
                  console.log('I am in par fnction to call response')
                  repeat = 1;
                  this.giveResponse(2, assignKeyword, parDetected);
                  step4_index--;
              }
          }
      }
  }
  // ====================== VENTILATION GROUP ====================== //

  // ====================== RIC GROUP ====================== //
  if(!checkUserSpeech){
      console.log('In rick');

    rickGroupDictionary.forEach(function (elem) {
        var re = new RegExp(elem, "gi");
        if (user_speech.match(re)) {
            checkUserSpeech = 1;
        }
    });
    if(checkUserSpeech)   //Check if it is not already assigned to someone
    {
        if(!groups[3].assigned && !parDetected){
            repeat = 0;
            calling_units[index].group = 'RIC';
            groups[3].assigned_to.push(calling_units[index].name);
            groups[3].assigned = 1;
            // userAssignTranscript();
            simpleAssignment = 1;
            this.changeKeywords(user_speech);
            user_speech = userSpeechChanged;
            console.log('RIC group has been assigned to ' + calling_units[step4_index]);
            this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
        }

        else {      //else give response
            if(!parDetected){
                if(groups[3].assigned && !assignKeyword){
                    groups[3].response = 1;
                    repeat = 1;
                    this.giveResponse(3, assignKeyword, parDetected);
                    step4_index--;
                }
                else {
                    repeat = 0;
                    this.giveResponse(3, assignKeyword, parDetected);
                    groups[3].assigned_to.push(calling_units[index].name);
                    groups[3].assigned = 1;
                    // userAssignTranscript();
                }
            }

            else {
                console.log('I am in par fnction to call response')
                repeat = 1;
                this.giveResponse(3, assignKeyword, parDetected);
                step4_index--;
            }
        }
    }
  }
  // ====================== RIC GROUP ====================== //

  // ====================== NAME DETECTION ====================== //
  if(!checkUserSpeech){
    console.log('Inside name function')
    groups.forEach(function (elem, index) {
        nameIndex = index;
        if(elem.assigned){
            var assignedName = elem.assigned_to;
            assignedName.forEach(function (name, index2) {
                var re = new RegExp(name, "gi");
                if (user_speech.match(re)) {
                    checkUserSpeech = 1;
                    console.log('Name detected');
                }
            });
        }
    });
    if(checkUserSpeech)   //Check if it is not already assigned to someone
    {
        this.giveResponse(nameIndex, assignKeyword, parDetected);
        groups[nameIndex].response = 1;
        repeat = 1;
        step4_index--;
    }
  }
  // ====================== NAME DETECTION ====================== //

  // ====================== NOTHING ====================== //
  if(!checkUserSpeech){
      console.log('nothing detected');
  }
  // ====================== NOTHING ====================== //

  } //onDecision

  giveResponse = (id, assignKeyword, parDetected, simpleAssignment) => {
    const {userSpeechChanged} = this.state;
    const {calling_units, step4_index} = this.props;
    if(parDetected){
      var phrase = 'All personnel are present and accounted for';
      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
    }
    else if(assignKeyword){
        console.log('In assign keyword response function')
        var phrase = calling_units[step4_index].name + 'copies' + userSpeechChanged;
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        // fullTranscript();
    }
    else if(simpleAssignment){
        var phrase = calling_units[step4_index].name + 'copies' + userSpeechChanged;
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        // fullTranscript();
    }
    else{  //0= Fire Attack     1=Exposure Group    2=Vent Group   3:Rick Group     4: Simple Response
        if(id == 0)
            var phrase = 'The building is withstanding the insult, we are advancing and we do not need any additional resources at this time.';
        if(id == 1)
            var phrase = 'The exposure is withstanding the insult, we are protecting the exposures and we do not need any additional resources at this time.';
        if(id == 2)
            var phrase = 'The building is withstanding the insult, we are ventilating and we could use additional resources.';
        if(id == 3)
            var phrase = 'We are in position and are softening the building. All IDLH resources are located, we do not need any additional resources.';

        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        // fullTranscript();
        // console.log('In response for '+ group_names[id]);
    }

  }

  changeKeywords = (user_speech) => {
    var {userSpeechChanged} = this.state;
    var mapObj = {
        'You will': "I will",
        'you will': "I will",
        'You are': "I am",
        'you are': "I am",
        'Your': "my",
        'your': "my",
        'we have': 'there are',
        'We have': 'there are',
        'Let me know': 'Ok I will let you know',
        'let me know': 'Ok I will let you know'
    };
    userSpeechChanged = user_speech.replace(/you will|you are|your|we have/gi, function (matched) {
        this.setState({userSpeechChanged: mapObj[matched]});
        //return mapObj[matched];
    });
  }

  */
}
