import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  state = {
    userSpeechChanged : '',
  };
  componentDidMount() {
    console.log('componentDidMount()')
    const {step, transcript} = this.props;
    this.processTranscript();
  }

  componentDidUpdate(prevProps) {
    const {transcript, step, assignmentCheck} = this.props;
    console.log(`componenetDidUpdate(${prevProps.step});`);
    if (prevProps.step === this.props.step && !assignmentCheck) {
      console.log('Going to call process transcript');
      this.processTranscript();
    }
  }

  processTranscript() {
    const { step } = this.props;
    console.log(step);
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
      default:
        break;
    }
  }

  /////////STEP 1////////////
  //Step 1 in evolution.js setDispatchText

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

  ////////STEP 4//////////////
  processArrivals = async () => {
    console.log('Process Arrival()');
    var { firstAlarm, calling_units, calling_units_length, step4_index, step, transcript, assignmentCheck } = this.props;
    console.log('In process arrival function assignmentCheck is : '+ assignmentCheck);
    if(assignmentCheck === 0){
      const phrase = `${firstAlarm[step4_index]} staged and awaiting assignment.`;
      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      //step4_index++;
      assignmentCheck = 1;
      this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
      console.log('STEP 4 Index is '+ step);
    }
    else {
      console.log(transcript);
      if(transcript !== '')
        this.decisionOnSpeech(transcript, step4_index);
    }
  }



  render() {
    return <div />;
  }

  //Changing variables
  //checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2_called, assignmentCheck
  //parDetected, parKeyword, parSpeech, parSpeechIndex, repeat, calling_units
  decisionOnSpeech = (user_speech, index) => {
    var {userSpeechChanged} = this.state;
    var { checkUserSpeech, assignKeyword, nameDetected, assigned, simpleAssignment,
      alarm2_called, firstAlarm, calling_units, calling_units_length, step4_index, secondAlarm, assignmentCheck,
      groups, repeat,
      alarm2KeywordDictionary,assignKeywordDictionary,parKeywordDictionary,fireAttackDictionary,exposureGroupDictionary,ventGroupDictionary,rickGroupDictionary,
      parDetected, parKeyword, parSpeech, parSpeechIndex  } = this.props;
    console.dir(groups);
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
          step4_index--;
          //this.props.speechCallback(firstAlarm, calling_units, calling_units_length, step4_index, assignmentCheck, assignKeyword, parKeyword, parDetected, parSpeech, parSpeechIndex);

        }
    }
    // ====================== ALARM 2 ====================== //

    // ====================== MULTIPLE GROUPS ====================== //
    //Check if it doesn't have assignKeyword
    calling_units.forEach((element, index) => {
      groups[index].found = 0;
      groups[index].index = 0;
      groups[index].count = 0;
    });
    assignKeywordDictionary.forEach(function (elem) {
        var re = new RegExp(elem, "gi");
        if (user_speech.match(re)) {
            assignKeywordFound = 1;
        }
    });

    //If not assign keyword
    if(!assignKeywordFound){
        //fireattack check
        for(i=0; i<fireAttackDictionary.length; i++){
            var re = new RegExp(fireAttackDictionary[i], "gi");
            if (user_speech.match(re)) {
            groups[0].found = 1;
            groups[0].count = fireAttackDictionary[i].length;
            groups[0].index = user_speech.indexOf(fireAttackDictionary[i]);
            i = fireAttackDictionary.length;
            }
        }
        i = 0;
        //exposure group check
        for(i=0; i<exposureGroupDictionary.length; i++){
            var re = new RegExp(exposureGroupDictionary[i], "gi");
            if (user_speech.match(re)) {
            groups[1].found = 1;
            groups[1].count = exposureGroupDictionary[i].length;
            groups[1].index = user_speech.indexOf(exposureGroupDictionary[i]);
            i = exposureGroupDictionary.length;
            }
        }
        i = 0;
        //vent group check
        for(i=0; i<ventGroupDictionary.length; i++){
            var re = new RegExp(ventGroupDictionary[i], "gi");
            if (user_speech.match(re)) {
            groups[2].found = 1;
            groups[2].count = ventGroupDictionary[i].length;
            groups[2].index = user_speech.indexOf(ventGroupDictionary[i]);
            i = ventGroupDictionary.length;
            }
        }
        i = 0;
        //Rick Group check
        for(i=0; i<rickGroupDictionary.length; i++){
            var re = new RegExp(rickGroupDictionary[i], "gi");
            if (user_speech.match(re)) {
            groups[3].found = 1;
            groups[3].count = rickGroupDictionary[i].length;

            groups[3].index = user_speech.indexOf(rickGroupDictionary[i]);
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
    if(indexOfKeyword>elem.index && elem.found == 1){
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
        var sub = user_speech.substring(0, indexOfKeyword+keyWordLength);
        user_speech = sub;
        console.log('If keyword is greater than 1');
        if(!groups[indexofGroup].assigned){

            //Dont go to assignment
            goAssignment = 1;
            console.log('User speech is '+ user_speech);
        }
    }
    // ====================== MULTIPLE GROUPS ====================== //

    // ====================== ASSIGN ====================== //
    if(!checkUserSpeech && !goAssignment){
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
          var re = new RegExp(elem, "gi");
          if (user_speech.match(re)) {
              console.log('PAR SEARCHING')
              checkUserSpeech = 0;
              parDetected = 1;
              parKeyword = 1;
              parSpeech[parSpeechIndex] = user_speech;
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
      step4_index++;
      assignmentCheck =  0;
      this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
      this.props.handleStep4Assignment();
  }
  // ====================== NOTHING ====================== //

  } //onDecision

  giveResponse = async (id, assignKeyword, parDetected, simpleAssignment) => {
    //let {step4_index} = this.props;
    console.log('giveReponse(${id}, $assignKeyword, $parDetected, $simpleAssignment)');
    const {userSpeechChanged} = this.state;
    let {calling_units, step4_index, transcript, firstAlarm, calling_units_length, assignmentCheck} = this.props;
    if(parDetected){
      var phrase = 'All personnel are present and accounted for';
      this.props.handleSpeak(phrase, 'enUS_Female', 5000);
      this.props.handleTranscriptReset();
      assignmentCheck =  1;
      setTimeout(()=>{
        this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
        this.props.handleStep4Assignment();
      }, 5000);
    }
    else if(assignKeyword){
        console.log('In assign keyword response function')
        var phrase = calling_units[step4_index].name + 'copies' + userSpeechChanged;
        phrase = "Assigned keyword detected";
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        step4_index++;
        assignmentCheck =  0;
        setTimeout(()=>{
          this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
          this.props.handleStep4Assignment();
        }, 5000);
        // fullTranscript();
    }
    else if(simpleAssignment){
        var phrase = calling_units[step4_index].name + 'copies' + userSpeechChanged;
        console.log(phrase);
        this.props.handleSpeak(transcript, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        step4_index++;
        assignmentCheck =  0;
        setTimeout(()=>{
          this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
          this.props.handleStep4Assignment();
        }, 5000);
        // fullTranscript();
    }
    else{  //0= Fire Attack     1=Exposure Group    2=Vent Group   3:Rick Group     4: Simple Response
      var phrase;
        if(id == 0)
            phrase = 'The building is withstanding the insult, we are advancing and we do not need any additional resources at this time.';
        if(id == 1)
            phrase = 'The exposure is withstanding the insult, we are protecting the exposures and we do not need any additional resources at this time.';
        if(id == 2)
            phrase = 'The building is withstanding the insult, we are ventilating and we could use additional resources.';
        if(id == 3)
            phrase = 'We are in position and are softening the building. All IDLH resources are located, we do not need any additional resources.';
        this.props.handleSpeak(phrase, 'enUS_Female', 5000);
        this.props.handleTranscriptReset();
        assignmentCheck =  1;
        setTimeout(()=>{
          this.props.speechCallback(calling_units, calling_units_length, step4_index, assignmentCheck);
          this.props.handleStep4Assignment();
        }, 5000);
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
    userSpeechChanged = user_speech.replace(/you will|you are|your|we have/gi, (matched) => {
        this.setState({userSpeechChanged: mapObj[matched]});
        //return mapObj[matched];
    });
  }

  
}
