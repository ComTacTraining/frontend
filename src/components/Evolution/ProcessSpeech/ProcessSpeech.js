import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  state = {
    userSpeechChanged : '',
    alarm2KeywordDictionary : ['Alarm 2:00', 'Alarm 2', 'alarm 2:00', 'alarm 2', 'alarm two', 'Alarm two'],
    fireAttackDictionary : ['fire attach', 'fire attack', 'far attack'],
    exposureGroupDictionary : ['exposure'],
    ventGroupDictionary : ['whent', 'went', 'vent', 'when', 'Ventilacion', 'Ventilation'],
    rickGroupDictionary : ['rick', 'R I C', 'R.I.C', 'Rick', 'R I C', 'Ric', 'ric'],
    assignKeywordDictionary : ['Assign', 'assign', 'Sign', 'Sign', 'Assigned'],
    parKeywordDictionary : ['Par', 'par', 'per', 'bar'],
  };
  componentDidMount() {
    console.log('componentDidMount()')
    console.log('STEP is : '+this.props.step);
    this.processTranscript();
  }

  componentDidUpdate(prevProps) {
    // const {transcript, step, assignmentCheck} = this.props;
    //console.log('CallingUnits are '+ this.props.callingUnits);
    const {assignmentCheck} = this.props;
    console.log(`componenetDidUpdate(${prevProps.step});`);
    if (prevProps.step === this.props.step && !assignmentCheck) {
      console.log('Going to call process transcript');
      this.processTranscript();
    }
  }

  processTranscript() {
    const { step } = this.props;
    switch (step) {
      case 2:
        this.processInitialReport();
        break;
      case 3:
        this.processSecondaryReport();
        break;
      case 4:
        this.processArrivals();
        break;
      case 5:
        this.faceToFace();
        break;
      default:
        break;
    }
  }

  processReport() {
    // const { transcript } = this.props;
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

  // STEP: 1  setDispatchText()

  //######## STEP 2 ###########//
  processInitialReport() {
    console.log('Process Initial');
    this.processReport();
  }
  //######## STEP 2 ###########//

  //######## STEP 3 ###########//
  processSecondaryReport() {
    console.log('Secondary Report');
    this.processReport();
  }
  //######## STEP 3 ###########//

  //######## STEP 4 ###########//
  processArrivals = async () => {
    const { firstAlarm, step4Index, step, transcript, assignmentCheck, groups, parSpeech, parSpeechIndex } = this.props;    
    console.log('Process Arrival()');
    if (firstAlarm.length>step4Index) {
      if (assignmentCheck === 0) {
        const phrase = `${firstAlarm[step4Index]} staged and awaiting assignment.`;
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        const newAssignmentCheck = 1;
        this.props.speechCallback(step4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
      }
      else {
                if (transcript !== '')
          this.decisionOnSpeech(transcript, step4Index);
      }
    }
    else {
      const newStep = step + 1;
      this.props.speechCallback(step4Index, assignmentCheck, newStep, groups, parSpeech, parSpeechIndex);
    }
  }
  //######## STEP 4 ###########//

  //######## STEP 5 ###########//
  faceToFace() {
    console.log('faceToFace()');
    const { firstAlarm, step4Index, step, assignmentCheck, groups, parSpeech, parSpeechIndex } = this.props;    
    const phrase = firstAlarm[0] + ' requesting face to face';
    const newStep = step + 1;
    this.props.speechCallback(step4Index, assignmentCheck, newStep, groups, parSpeech, parSpeechIndex);
    this.props.handleSpeak(phrase);
    this.props.handleTranscriptReset();
    setTimeout(()=> { 
    }, 5000);
  }
  //######## STEP 5 ###########//

  render() {
    return <div />;
  }

  //Changing variables
  //checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2_called, assignmentCheck
  //parDetected, parKeyword, parSpeech, parSpeechIndex, callingUnits
  decisionOnSpeech = (userSpeech, index) => {
    console.log('decisionOnSpeech()');
    const {
      alarm2KeywordDictionary, 
      assignKeywordDictionary,
      parKeywordDictionary,
      fireAttackDictionary,
      exposureGroupDictionary,
      ventGroupDictionary,
      rickGroupDictionary,
      userSpeechChanged } = this.state;
    const { secondAlarm, callingUnits } = this.props;
    var { groups, step, parSpeech, parSpeechIndex, step4Index } = this.props;
    console.dir(groups);
    ///////////////////////LOCAL VARIABLES//////////////////////////////
    userSpeech = userSpeech.toLowerCase();
    var checkUserSpeech = 0;    //if it is matched
    var assignKeyword = 0;      //Check if assigned keyword is detected
    var parDetected = 0;        //Check if PAR keyword is detected
    // var nameDetected = 0;       //Check if some name is called
    var nameIndex = 0;          //Index on which it is found
    //assigned = 0;             //Check if any group is assigned
    var simpleAssignment = 0;   //Simple assignment response
    
    var i = 0;
    var goAssignment = 0;
    var assignKeywordFound = 0;
    ///////////////////////LOCAL VARIABLES//////////////////////////////
    // ====================== ALARM 2 ====================== //
    if(!checkUserSpeech){
      alarm2KeywordDictionary.forEach(function (elem) {
        var re = new RegExp(elem, "gi");
        if (userSpeech.match(re)) {
            checkUserSpeech = 1;
        }
      });

      if(checkUserSpeech) {
        console.log('Alarm 2 Response');
        var phrase= 'Dispatch copies ';
        secondAlarm.forEach((elem)=>{
          phrase += elem + ' ';
        });
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        const newAssignmentCheck =  1;
        setTimeout(()=>{
          this.props.speechCallback(step4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
          this.props.handleStep4Assignment();
        }, 5000);
      }
    }
    // ====================== ALARM 2 ====================== //

    // ====================== MULTIPLE GROUPS ====================== //
    //Check if it doesn't have assignKeyword
    callingUnits.forEach((element, index) => {
      groups[index].found = 0;
      groups[index].index = 0;
      groups[index].count = 0;
    });
    assignKeywordDictionary.forEach(function (elem) {
        var re = new RegExp(elem, "gi");
        if (userSpeech.match(re)) {
            assignKeywordFound = 1;
        }
    });

    //If not assign keyword
    if(!assignKeywordFound){
      //fireattack check
      for(i=0; i<fireAttackDictionary.length; i++){
          var re = new RegExp(fireAttackDictionary[i], "gi");
          if (userSpeech.match(re)) {
          groups[0].found = 1;
          groups[0].count = fireAttackDictionary[i].length;
          groups[0].index = userSpeech.indexOf(fireAttackDictionary[i]);
          i = fireAttackDictionary.length;
          }
      }
      i = 0;
      //exposure group check
      for(i=0; i<exposureGroupDictionary.length; i++){
          re = new RegExp(exposureGroupDictionary[i], "gi");
          if (userSpeech.match(re)) {
          groups[1].found = 1;
          groups[1].count = exposureGroupDictionary[i].length;
          groups[1].index = userSpeech.indexOf(exposureGroupDictionary[i]);
          i = exposureGroupDictionary.length;
          }
      }
      i = 0;
      //vent group check
      for(i=0; i<ventGroupDictionary.length; i++){
          re = new RegExp(ventGroupDictionary[i], "gi");
          if (userSpeech.match(re)) {
          groups[2].found = 1;
          groups[2].count = ventGroupDictionary[i].length;
          groups[2].index = userSpeech.indexOf(ventGroupDictionary[i]);
          i = ventGroupDictionary.length;
          }
      }
      i = 0;
        //Rick Group check
      for(i=0; i<rickGroupDictionary.length; i++){
        re = new RegExp(rickGroupDictionary[i], "gi");
        if (userSpeech.match(re)) {
        groups[3].found = 1;
        groups[3].count = rickGroupDictionary[i].length;
        groups[3].index = userSpeech.indexOf(rickGroupDictionary[i]);
        i = rickGroupDictionary.length;
        }
      }
    }

    var keyWordLength = 10000;
    var indexOfKeyword = 1000;
    var indexofGroup = 5;
    var countKeywords = 0;
    i=0;
    groups.forEach((elem)=>{
    if(indexOfKeyword>elem.index && elem.found === 1){
      keyWordLength = elem.count;
      indexOfKeyword = elem.index;
      console.log(elem.index);
      indexofGroup = i;
    }
    i++;
    if(elem.found)
      countKeywords++;
      console.log('Keyword counted');
    });

    if(countKeywords>1){
      var sub = userSpeech.substring(0, indexOfKeyword+keyWordLength);
      userSpeech = sub;
      console.log('If keyword is greater than 1');
      if(!groups[indexofGroup].assigned){
        //Dont go to assignment
        goAssignment = 1;
        console.log('User speech is '+ userSpeech);
      }
    }
    // ====================== MULTIPLE GROUPS ====================== //

    // ====================== ASSIGN ====================== //
    if(!checkUserSpeech && !goAssignment){
      assignKeywordDictionary.forEach(function (elem) {
        var re = new RegExp(elem, "gi");
        if (userSpeech.match(re)) {
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
        var re = new RegExp(elem, "gi");
        if (userSpeech.match(re)) {
          console.log('PAR SEARCHING')
          checkUserSpeech = 0;
          parDetected = 1;
          //parKeyword = 1;
          parSpeech[parSpeechIndex] = userSpeech;
          parSpeechIndex++;
        }
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
        if (userSpeech.match(re)) {
          checkUserSpeech = 1;
          console.log('Fire attack matched');
        }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
        if(!groups[0].assigned && !parDetected){    // Simple assignment
          callingUnits[index].group = 'Fire attack';
          groups[0].assigned_to.push(callingUnits[index].name);
          groups[0].assigned = 1;
          // userAssignTranscript();
          simpleAssignment = 1;
          this.changeKeywords(userSpeech);
          userSpeech = userSpeechChanged;
          console.log('Fire attack assigned to ' + callingUnits[step4Index].name);
          this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
        }

        else {      // IF PAR AND ALREADY ASSIGNED
          if(!parDetected){   //If assigned
            if(groups[0].assigned && !assignKeyword){
              console.log('Assigned keyword and calling response');
              groups[0].response = 1;
              this.giveResponse(0, assignKeyword, parDetected);
              step4Index--;
            }
            else {      // IF ASSIGNED
              console.log('Fire attack assigned with assign keyword')
              groups[0].assigned_to.push(callingUnits[index].name);
              groups[0].assigned = 1;
              this.giveResponse(0, assignKeyword, parDetected);
              // userAssignTranscript();
            }
          }

          else {  //FIRE ATTACK PAR
            console.log('I am in par function to call response');
            this.giveResponse(0, assignKeyword, parDetected);
            step4Index--;
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
        if (userSpeech.match(re)) {
          checkUserSpeech = 1;
        }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
        if(!groups[1].assigned && !parDetected){    // Simple assignment
          callingUnits[index].group = 'Exposure';
          groups[1].assigned_to.push(callingUnits[index].name);
          groups[1].assigned = 1;
          // userAssignTranscript();
          simpleAssignment = 1;
          this.changeKeywords(userSpeech);
          userSpeech = userSpeechChanged;
          console.log('Exposure group has been assigned to ' + callingUnits[step4Index].name);
          this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
        }
        else {      //else give response
          if(!parDetected){
            if(groups[1].assigned && !assignKeyword){
              groups[1].response = 1;
              this.giveResponse(1, assignKeyword, parDetected);
              step4Index--;
            }
            else {
              groups[1].assigned_to.push(callingUnits[index].name);
              groups[1].assigned = 1;
              this.giveResponse(1, assignKeyword, parDetected);
              // userAssignTranscript();
            }
          }

          else {
            console.log('I am in par fnction to call response')
            this.giveResponse(1, assignKeyword, parDetected);
            step4Index--;
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
        if (userSpeech.match(re)) {
          checkUserSpeech = 1;
        }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
        if(!groups[2].assigned && !parDetected){
          callingUnits[index].group = 'Vent';
          groups[2].assigned_to.push(callingUnits[index].name);
          groups[2].assigned = 1;
          // userAssignTranscript();
          simpleAssignment = 1;
          this.changeKeywords(userSpeech);
          userSpeech = userSpeechChanged;
          console.log('Vent group has been assigned to ' + callingUnits[step4Index].name);
          this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
        }
        else {      //else give response
          if(!parDetected){
            if(groups[2].assigned && !assignKeyword){
              groups[2].response = 1;
              this.giveResponse(2, assignKeyword, parDetected);
              step4Index--;
            }
            else {
              groups[2].assigned_to.push(callingUnits[index].name);
              groups[2].assigned = 1;
              this.giveResponse(2, assignKeyword, parDetected);
              // userAssignTranscript();
            }
          }
          else {
            console.log('I am in par fnction to call response')
            this.giveResponse(2, assignKeyword, parDetected);
            step4Index--;
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
        if (userSpeech.match(re)) {
            checkUserSpeech = 1;
        }
      });
      if(checkUserSpeech)   //Check if it is not already assigned to someone
      {
        if(!groups[3].assigned && !parDetected){
          callingUnits[index].group = 'RIC';
          groups[3].assigned_to.push(callingUnits[index].name);
          groups[3].assigned = 1;
          // userAssignTranscript();
          simpleAssignment = 1;
          this.changeKeywords(userSpeech);
          userSpeech = userSpeechChanged;
          console.log('RIC group has been assigned to ' + callingUnits[step4Index].name);
          this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
        }

        else {      //else give response
          if(!parDetected){
            if(groups[3].assigned && !assignKeyword){
                groups[3].response = 1;
                this.giveResponse(3, assignKeyword, parDetected);
                step4Index--;
            }
            else {
                this.giveResponse(3, assignKeyword, parDetected);
                groups[3].assigned_to.push(callingUnits[index].name);
                groups[3].assigned = 1;
                // userAssignTranscript();
            }
          }

          else {
            console.log('I am in par fnction to call response')
            this.giveResponse(3, assignKeyword, parDetected);
            step4Index--;
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
            if (userSpeech.match(re)) {
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
        step4Index--;
      }
    }
    // ====================== NAME DETECTION ====================== //

    // ====================== NOTHING ====================== //
    if(!checkUserSpeech){
      console.log('nothing detected');
      const newStep4Index = step4Index + 1;
      const newAssignmentCheck = 0;
      setTimeout(()=>{
        this.props.speechCallback(newStep4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex );
        this.props.handleStep4Assignment();
      }, 5000);
    }
    // ====================== NOTHING ====================== //
  } //onDecision

  giveResponse = async (id, assignKeyword, parDetected, simpleAssignment) => {
    const {userSpeechChanged} = this.state;
    const {callingUnits, transcript, step4Index, step, groups, parSpeech, parSpeechIndex } = this.props;

    if(parDetected){
      var phrase = 'All personnel are present and accounted for';
      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      const newAssignmentCheck =  1;
      setTimeout(()=>{
        this.props.speechCallback(step4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
        this.props.handleStep4Assignment();
      }, 5000);
    }
    else if(assignKeyword) {
      console.log('In assign keyword response function')
      phrase = callingUnits[step4Index].name + 'copies' + userSpeechChanged;
      phrase = "Assigned keyword detected";
      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      const newStep4Index = step4Index + 1;
      const newAssignmentCheck =  0;
      setTimeout(()=>{
        this.props.speechCallback(newStep4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
        this.props.handleStep4Assignment();
      }, 5000);
      // fullTranscript();
    }
    else if(simpleAssignment) {
      phrase = callingUnits[step4Index].name + 'copies' + userSpeechChanged;
      console.log(phrase);
      this.props.handleSpeak(transcript, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      const newStep4Index = step4Index + 1;
      const newAssignmentCheck =  0;
      setTimeout(()=>{
        this.props.speechCallback(newStep4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
        this.props.handleStep4Assignment();
      }, 5000);
      // fullTranscript();
    }
    else {  //0: Fire Attack     1: Exposure Group    2: Vent Group   3: Rick Group     4: Simple Response
      // var phrase;
      if(id === 0)
          phrase = 'The building is withstanding the insult, we are advancing and we do not need any additional resources at this time.';
      if(id === 1)
          phrase = 'The exposure is withstanding the insult, we are protecting the exposures and we do not need any additional resources at this time.';
      if(id === 2)
          phrase = 'The building is withstanding the insult, we are ventilating and we could use additional resources.';
      if(id === 3)
          phrase = 'We are in position and are softening the building. All IDLH resources are located, we do not need any additional resources.';

      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      const newAssignmentCheck =  1;
      setTimeout(()=>{
        this.props.speechCallback(step4Index, newAssignmentCheck, step, groups, parSpeech, parSpeechIndex);
        this.props.handleStep4Assignment();
      }, 5000);
      // fullTranscript();
    } 
  }

  changeKeywords = (userSpeech) => {
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
    userSpeech.replace(/you will|you are|your|we have/gi, (matched) => {
      this.setState({userSpeechChanged: mapObj[matched]});
      //return mapObj[matched];
    });
  }

}  //Class
