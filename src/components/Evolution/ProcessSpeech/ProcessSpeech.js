import React, { Component } from 'react';

export default class ProcessSpeech extends Component {
  state = {
    userSpeechChanged: '',
    alarm2KeywordDictionary: [
      'Alarm 2:00',
      'Alarm 2',
      'alarm 2:00',
      'alarm 2',
      'alarm two',
      'Alarm two'
    ],
    fireAttackDictionary: ['fire attach', 'fire attack', 'far attack'],
    exposureGroupDictionary: ['exposure'],
    ventGroupDictionary: [
      'whent',
      'went',
      'vent',
      'when',
      'Ventilacion',
      'Ventilation'
    ],
    rickGroupDictionary: [
      'rick',
      'R I C',
      'R.I.C',
      'Rick',
      'R I C',
      'Ric',
      'ric'
    ],
    assignKeywordDictionary: ['Assign', 'assign', 'Sign', 'Sign', 'Assigned'],
    parKeywordDictionary: ['Par', 'par', 'per', 'bar']
  };

  componentDidMount() {
    console.log('ProcessSpeech()');
    this.processTranscript();
  }

  processTranscript() {
    // const { alarm2KeywordDictionary } = this.state;
    const {
      initialReportComplete,
      threeSixtyComplete,
      arrivalsComplete,
      commandingUnitComplete,
      smokeReportComplete,
      transcript,
      step4Index
    } = this.props.childProps;
    // if (this.includesAnyText(alarm2KeywordDictionary)) {
    //   this.processSecondAlarm();
    // } else
    if (!smokeReportComplete) {
      console.log('SmokeReport()');
      this.smokeReport();
    } else if (!initialReportComplete) {
      console.log('initialReport()');
      this.processInitialReport();
    } else if (!threeSixtyComplete) {
      console.log('secondaryReport()');
      this.processThreeSixtyAssessment();
    } else if (!arrivalsComplete) {
      console.log('decisionOnSpeech()');
      this.decisionOnSpeech(transcript, step4Index);
    } else if (!commandingUnitComplete) {
      this.commandingUnitReport();
    }
  }

  smokeReport() {
    const { transcript } = this.props.childProps;
    this.props.childProps.handleSpeak(transcript);
    const updates = {
      smokeReportComplete: true,
      transcript: ''
    };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  processInitialReport() {
    const { transcript, dispatchCenter } = this.props.childProps;
    const phrase = `${dispatchCenter} copies ${transcript}`;
    this.props.childProps.handleSpeak(phrase);
    this.processInitialEvaluation(transcript);
    const updates = {
      initialReportComplete: true,
      transcript: ''
    };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  processInitialEvaluation(transcript) {
    let { initialMatched, slicerMatched, rectoMatched } = this.props.childProps;

    initialMatched = initialMatched.initialMatched;
    slicerMatched = slicerMatched.slicerMatched;
    rectoMatched = rectoMatched.rectoMatched;

    if (transcript !== undefined) {
      let initialDictionary = [];
      initialDictionary[0] = [
        'Small',
        'small',
        'Medium',
        'Large',
        'Extra Large',
        'Mega',
        'Square Feet',
        'Dimentions 50 by 120'
      ];
      initialDictionary[1] = [
        'Single Story',
        'single Storey',
        '2 Story',
        'two-story',
        'two story',
        'two storey',
        'double story',
        'double-story',
        'double storey',
        'Three story',
        'Three-story',
        'three storey',
        '3 Story',
        'Mid Rise',
        'High Rise',
        'High-rise'
      ];
      initialDictionary[2] = [
        'Residential',
        'single-family dwelling',
        'single family dwelling',
        'single families',
        'multi family dwelling',
        'garden apartment',
        'call apartment',
        'townhome',
        'town home',
        'condominium',
        'duplex',
        'business office',
        'warehouse',
        'medical office',
        'retail',
        'Apartment',
        'House',
        'Single Family Dwelling',
        'Townhome',
        'Center Hall',
        'Commercial',
        'Office',
        'Taxpayer',
        'Condo',
        'Condominium',
        'Industrial',
        'Metal building',
        'Warehouse',
        'Tiltup',
        'Home',
        'Retail'
      ];
      initialDictionary[3] = [
        'Smoke',
        'Smoke showing',
        'fire showing',
        'smoke and fire showing',
        'nothing showing',
        'Fire',
        'Nothing'
      ];
      initialDictionary[4] = [
        'Laying a supply line',
        'establishing water supply',
        'entering the rescue mode',
        'quick attack',
        'command',
        'investigation',
        'Water Supply',
        'Laying Lines',
        'Investigating',
        'Command',
        'Rescue',
        'attack lines'
      ];
      initialDictionary[5] = [
        'Second alarm',
        'third alarm',
        'police',
        'PD',
        'ambulance',
        'public works',
        '2nd Alarm',
        'Police',
        'Ambulance',
        'EMS',
        'Officers'
      ];
      initialDictionary[6] = [
        'Main Street command',
        'Main Street incident',
        'main street IC',
        'men straight incident',
        'men straight',
        'usually bear is the name of the street that the incident is on',
        'Consistent with the address'
      ];
      initialDictionary[7] = [
        'Typical light weight construction',
        'lightweight',
        'ordinary construction',
        'cut and stack construction',
        'poured in place',
        '360 degree assessment',
        '360 degree ',
        '360',
        'concrete tilt up',
        'metal clad building',
        'stack conception'
      ];
      const rescueDictionary = ['Rescue', 'search'];
      const salvageDictionary = [
        'salvage',
        'recovery',
        'property',
        'property conservation'
      ];

      // for (var i = 0; i < initialDictionary.length; i++) {
      //   initialMatched[i] = {};
      //   initialMatched[i].keywords = [];
      //   initialMatched[i].keywords = initialDictionary[i];
      //   initialMatched[i].matched = 0;
      //   initialMatched[i].matchKeyword = '';
      // }

      initialDictionary.forEach((elem, index) => {
        elem.forEach(item => {
          var re = new RegExp(item, 'gi');
          if (transcript.match(re)) {
            initialMatched[index].matched = 1;
            initialMatched[index].matchKeyword = item;
          }
        });
      });

      // for (var i = 0; i <= 6; i++) {
      //   slicerMatched[i] = {};
      //   slicerMatched[i].matched = 0;
      //   slicerMatched[i].matchKeyword = '';

      //   rectoMatched[i] = {};
      //   rectoMatched[i].matched = 0;
      //   rectoMatched[i].matchKeyword = '';
      // } //Initialize SLICER and RECTO-VS array

      rescueDictionary.forEach(item => {
        var re = new RegExp(item, 'gi');
        if (transcript.match(re)) {
          slicerMatched[5].matched = 1;
          slicerMatched[5].matchKeyword = item;

          rectoMatched[0].matched = 1;
          rectoMatched[0].matchKeyword = item;
          rectoMatched[4].matched = 1;
          rectoMatched[4].matchKeyword = item;
        }
      });

      salvageDictionary.forEach(item => {
        var re = new RegExp(item, 'gi');
        if (transcript.match(re)) {
          slicerMatched[6].matched = 1;
          slicerMatched[6].matchKeyword = item;

          rectoMatched[5].matched = 1;
          rectoMatched[5].matchKeyword = item;
        }
      });
      const updates = {
        initialMatched: initialMatched,
        rectoMatched: rectoMatched,
        slicerMatched: slicerMatched
      };
      this.props.childProps.handleEvaluationComplete(updates);
    }
  }

  processThreeSixtyAssessment() {
    const { transcript, dispatchCenter } = this.props.childProps;
    const phrase = `${dispatchCenter} copies ${transcript}`;
    this.props.childProps.handleSpeak(phrase);
    this.processThreeSixtyEvaluation(transcript);
    const updates = {
      threeSixtyComplete: true,
      transcript: '',
      startArrival: true
    };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  processThreeSixtyEvaluation(transcript) {
    let {
      slicerMatched,
      secondaryMatched,
      initialMatched
    } = this.props.childProps;
    initialMatched = initialMatched.initialMatched;
    secondaryMatched = secondaryMatched.secondaryMatched;
    slicerMatched = slicerMatched.slicerMatched;

    if (transcript !== undefined) {
      let secondaryDictionary = [];
      secondaryDictionary[0] = ['Alpha', 'bravo', 'Charlie', 'Delta'];
      secondaryDictionary[1] = [
        'Structure fire',
        'room and contents fire',
        'room and contents. fire',
        'room and contents',
        'attic fire',
        'basement fire'
      ];
      secondaryDictionary[2] = [
        'Bidirectional',
        'unidirectional',
        'exhaust on Alpha',
        'bravo',
        'Charlie',
        'Delta',
        'intake',
        'on Alpha',
        'bravo',
        'Charlie',
        'Delta'
      ];
      secondaryDictionary[3] = [
        'survivability profile',
        'Survivability profile',
        'Positive',
        'marginal',
        'negative'
      ];
      // for (var i = 0; i < secondaryDictionary.length; i++) {
      //   secondaryMatched[i] = {};
      //   secondaryMatched[i].keywords = [];
      //   secondaryMatched[i].keywords = secondaryDictionary[i];
      //   secondaryMatched[i].matched = 0;
      //   secondaryMatched[i].matchKeyword = '';
      // }

      secondaryDictionary.forEach((elem, index) => {
        elem.forEach(item => {
          var re = new RegExp(item, 'gi');
          if (transcript.match(re)) {
            secondaryMatched[index].matched = 1;
            secondaryMatched[index].matchKeyword = item;
          }
        });
      });

      //S in SLICER
      if (
        initialMatched[0].matched &&
        initialMatched[1].matched &&
        initialMatched[2].matched &&
        secondaryMatched[0].matched
      ) {
        slicerMatched[0].matched = 1;
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[0].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[1].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[2].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword +
          secondaryMatched[0].matchKeyword +
          ', ';
      }
      // L
      if (initialMatched[4].matched && secondaryMatched[0].matched) {
        slicerMatched[1].matched = 1;
        slicerMatched[1].matchKeyword =
          slicerMatched[1].matchKeyword + initialMatched[4].matchKeyword + ', ';
        slicerMatched[1].matchKeyword =
          slicerMatched[1].matchKeyword +
          secondaryMatched[0].matchKeyword +
          ', ';
      }
      // I
      if (secondaryMatched[1].matched) {
        slicerMatched[2].matched = 1;
        slicerMatched[2].matchKeyword =
          slicerMatched[2].matchKeyword +
          secondaryMatched[2].matchKeyword +
          ', ';
      }

      const updates = {
        initialMatched: initialMatched.initialMatched,
        slicerMatched: slicerMatched,
        secondaryMatched: secondaryMatched
      };
      this.props.childProps.handleEvaluationComplete(updates);
    }
  }

  commandingUnitReport() {
    const { transcript } = this.props.childProps;
    this.props.childProps.handleSpeak(transcript);
    this.commandingUnitEvaluation(transcript);
    const updates = {
      commandingUnitComplete: true,
      transcript: ''
    };
    this.props.childProps.handleProcessSpeechComplete(updates);
  }

  commandingUnitEvaluation(transcript) {
    let { commandingUnitMatched } = this.props.childProps;
    if (transcript !== undefined) {
      const assignedToDictionary = [
        'assign to',
        'assign two',
        'assigned to',
        'assigned two'
      ];
      commandingUnitMatched = commandingUnitMatched.commandingUnitMatched;
      commandingUnitMatched[0].matched = 1;
      commandingUnitMatched[0].matchKeyword = transcript;

      assignedToDictionary.forEach((item, i) => {
        var re = new RegExp(item, 'gi');
        if (transcript.match(re)) {
          commandingUnitMatched[1].matched = 1;
          commandingUnitMatched[1].matchKeyword = transcript;
        }
      });
      const updates = {
        commandingUnitMatched: commandingUnitMatched
      };
      this.props.childProps.handleEvaluationComplete(updates);
    }
  }

  processSecondAlarm() {
    const { incidentCommander, dispatchCenter, alarms } = this.props.childProps;
    const phrase = `${incidentCommander} from ${dispatchCenter}, your second alarm units are: ${alarms.alarm2}`;
    this.props.childProps.handleSpeak(phrase);
    this.props.childProps.handleProcessSpeechComplete({ transcript: '' });
  }

  processFaceToFaceRequest() {
    const { chief } = this.props.childProps;
    const phrase = `${chief} requesting face to face`;
    this.props.childProps.handleSpeak(phrase);
    const updates = {
      faceToFaceRequestComplete: true,
      transcript: ''
    };
    this.props.childProps.handleProcessSpeechComplete(updates);
    // this.props.childProps.handleSpeak(phrase);
  }

  processFaceToFace() {
    this.props.childProps.handleProcessSpeechComplete({
      faceToFaceComplete: true,
      transcript: ''
    });
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

  async decisionOnSpeech(userSpeech, index) {
    const {
      alarm2KeywordDictionary,
      assignKeywordDictionary,
      parKeywordDictionary,
      fireAttackDictionary,
      exposureGroupDictionary,
      ventGroupDictionary,
      rickGroupDictionary
    } = this.state;
    const { secondAlarm, callingUnits } = this.props.childProps;
    let {
      groups,
      parSpeech,
      parSpeechIndex,
      step4Index
    } = this.props.childProps;
    console.dir(groups);
    ///////////////////////LOCAL VARIABLES//////////////////////////////
    userSpeech = userSpeech.toLowerCase();
    var checkUserSpeech = 0; //if it is matched
    var assignKeyword = 0; //Check if assigned keyword is detected
    var parDetected = 0; //Check if PAR keyword is detected
    // var nameDetected = 0;       //Check if some name is called
    var nameIndex = 0; //Index on which it is found
    //assigned = 0;             //Check if any group is assigned
    var simpleAssignment = 0; //Simple assignment response

    var i = 0;
    var goAssignment = 0;
    var assignKeywordFound = 0;
    ///////////////////////LOCAL VARIABLES//////////////////////////////
    // ====================== ALARM 2 ====================== //
    if (!checkUserSpeech) {
      checkUserSpeech = this.groupMatching(
        checkUserSpeech,
        alarm2KeywordDictionary,
        userSpeech
      );
      if (checkUserSpeech) {
        console.log('Alarm 2 Response');
        var phrase = 'Dispatch copies ';
        secondAlarm.forEach(elem => {
          phrase += elem + ' ';
        });
        this.props.childProps.handleSpeak(
          phrase,
          callingUnits[step4Index].voice,
          5000
        );

        setTimeout(() => {
          //this.props.childProps.handleStep4Assignment();
          const updates = {
            assignmentCheck: 1,
            transcript: '',
            alarmTwoIncident: true
          };
          this.props.childProps.incidentWithinIncident();
          this.props.childProps.handleProcessSpeechComplete(updates);
        }, 5000);
      }
    }
    // ====================== ALARM 2 ====================== //

    // ====================== MULTIPLE GROUPS ====================== //
    //Check if it doesn't have assignKeyword

    // groups.forEach((element, index) => {
    //   groups[index].found = 0;
    //   groups[index].index = 0;
    //   groups[index].count = 0;
    // });
    assignKeywordDictionary.forEach(function(elem) {
      var re = new RegExp(elem, 'gi');
      if (userSpeech.match(re)) {
        assignKeywordFound = 1;
      }
    });

    //If not assign keyword
    if (!assignKeywordFound) {
      //fireattack check
      for (i = 0; i < fireAttackDictionary.length; i++) {
        var re = new RegExp(fireAttackDictionary[i], 'gi');
        if (userSpeech.match(re)) {
          groups[0].found = 1;
          groups[0].count = fireAttackDictionary[i].length;
          groups[0].index = userSpeech.indexOf(fireAttackDictionary[i]);
          i = fireAttackDictionary.length;
        }
      }
      i = 0;
      //exposure group check
      for (i = 0; i < exposureGroupDictionary.length; i++) {
        re = new RegExp(exposureGroupDictionary[i], 'gi');
        if (userSpeech.match(re)) {
          groups[1].found = 1;
          groups[1].count = exposureGroupDictionary[i].length;
          groups[1].index = userSpeech.indexOf(exposureGroupDictionary[i]);
          i = exposureGroupDictionary.length;
        }
      }
      i = 0;
      //vent group check
      for (i = 0; i < ventGroupDictionary.length; i++) {
        re = new RegExp(ventGroupDictionary[i], 'gi');
        if (userSpeech.match(re)) {
          groups[2].found = 1;
          groups[2].count = ventGroupDictionary[i].length;
          groups[2].index = userSpeech.indexOf(ventGroupDictionary[i]);
          i = ventGroupDictionary.length;
        }
      }
      i = 0;
      //Rick Group check
      for (i = 0; i < rickGroupDictionary.length; i++) {
        re = new RegExp(rickGroupDictionary[i], 'gi');
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
    i = 0;
    groups.forEach(elem => {
      if (indexOfKeyword > elem.index && elem.found === 1) {
        keyWordLength = elem.count;
        indexOfKeyword = elem.index;
        indexofGroup = i;
      }
      i++;
      if (elem.found) countKeywords++;
    });

    if (countKeywords > 1) {
      var sub = userSpeech.substring(0, indexOfKeyword + keyWordLength);
      userSpeech = sub;
      if (!groups[indexofGroup].assigned) {
        //Dont go to assignment
        goAssignment = 1;
      }
    }
    // ====================== MULTIPLE GROUPS ====================== //

    // ====================== ASSIGN ====================== //
    if (!checkUserSpeech && !goAssignment) {
      assignKeywordDictionary.forEach(function(elem) {
        var re = new RegExp(elem, 'gi');
        if (userSpeech.match(re)) {
          checkUserSpeech = 0; //Because not to break condition if found
          assignKeyword = 1;
        }
      });
      if (assignKeyword) {
        console.log('Assign keyword detected');
      }
    }
    // ====================== ASSIGN ====================== //

    // ====================== PAR REPORT ====================== //
    if (!checkUserSpeech) {
      parKeywordDictionary.forEach(function(elem) {
        var re = new RegExp(elem, 'gi');
        if (userSpeech.match(re)) {
          checkUserSpeech = 0;
          parDetected = 1;
          //parKeyword = 1;
          parSpeech[parSpeechIndex] = userSpeech;
          parSpeechIndex++;
        }
      });
      if (parDetected) {
        //Check if it is not already assigned to someone
        console.log('PAR keyword detected');
      }
    }
    // ====================== PAR REPORT ====================== //

    // ====================== FIRE ATTACK ====================== //
    if (!checkUserSpeech) {
      checkUserSpeech = await this.groupMatching(
        checkUserSpeech,
        fireAttackDictionary,
        userSpeech
      );
      let obj = await this.groupAssignment(
        checkUserSpeech,
        groups,
        0,
        index,
        parDetected,
        callingUnits,
        simpleAssignment,
        assignKeyword,
        step4Index
      );
      checkUserSpeech = obj.checkUserSpeech;
      groups = obj.groups;
      index = obj.parDetected;
      simpleAssignment = obj.simpleAssignment;
      assignKeyword = obj.assignKeyword;
      parDetected = obj.parDetected;
      step4Index = obj.step4Index;
    }
    // ====================== FIRE ATTACK ====================== //

    // ====================== EXPOSURE GROUP ====================== //
    if (!checkUserSpeech) {
      checkUserSpeech = await this.groupMatching(
        checkUserSpeech,
        exposureGroupDictionary,
        userSpeech
      );
      let obj = await this.groupAssignment(
        checkUserSpeech,
        groups,
        1,
        index,
        parDetected,
        callingUnits,
        simpleAssignment,
        assignKeyword,
        step4Index
      );
      checkUserSpeech = obj.checkUserSpeech;
      groups = obj.groups;
      index = obj.parDetected;
      simpleAssignment = obj.simpleAssignment;
      assignKeyword = obj.assignKeyword;
      parDetected = obj.parDetected;
      step4Index = obj.step4Index;
    }
    // ====================== EXPOSURE GROUP ====================== //

    // ====================== VENTILATION GROUP ====================== //
    if (!checkUserSpeech) {
      checkUserSpeech = await this.groupMatching(
        checkUserSpeech,
        ventGroupDictionary,
        userSpeech
      );
      let obj = await this.groupAssignment(
        checkUserSpeech,
        groups,
        2,
        index,
        parDetected,
        callingUnits,
        simpleAssignment,
        assignKeyword,
        step4Index
      );
      checkUserSpeech = obj.checkUserSpeech;
      groups = obj.groups;
      index = obj.parDetected;
      simpleAssignment = obj.simpleAssignment;
      assignKeyword = obj.assignKeyword;
      parDetected = obj.parDetected;
      step4Index = obj.step4Index;
    }
    // ====================== VENTILATION GROUP ====================== //

    // ====================== RIC GROUP ====================== //
    if (!checkUserSpeech) {
      checkUserSpeech = await this.groupMatching(
        checkUserSpeech,
        rickGroupDictionary,
        userSpeech
      );
      let obj = await this.groupAssignment(
        checkUserSpeech,
        groups,
        3,
        index,
        parDetected,
        callingUnits,
        simpleAssignment,
        assignKeyword,
        step4Index
      );
      checkUserSpeech = obj.checkUserSpeech;
      groups = obj.groups;
      index = obj.parDetected;
      simpleAssignment = obj.simpleAssignment;
      assignKeyword = obj.assignKeyword;
      parDetected = obj.parDetected;
      step4Index = obj.step4Index;
    }
    // ====================== RIC GROUP ====================== //

    // ====================== NAME DETECTION ====================== //
    if (!checkUserSpeech) {
      groups.forEach((elem, index) => {
        nameIndex = index;
        if (elem.assigned) {
          var assignedName = elem.assigned_to;
          assignedName.forEach((name, index2) => {
            var re = new RegExp(name.toLowerCase(), 'gi');
            if (userSpeech.toLowerCase().match(re)) {
              checkUserSpeech = 1;
              console.log('Name detected');
            }
          });
        }
      });
      if (checkUserSpeech) {
        //Check if it is not already assigned to someone
        this.giveResponse(nameIndex, assignKeyword, parDetected);
        groups[nameIndex].response = 1;
        step4Index--;
      }
    }
    // ====================== NAME DETECTION ====================== //

    // ====================== NOTHING ====================== //
    if (!checkUserSpeech) {
      console.log('Nothing Detected');
      await this.changeKeywords(this.props.childProps.transcript);
      const newStep4Index = step4Index + 1;
      const updates = {
        step4Index: newStep4Index,
        assignmentCheck: 0,
        transcript: '',
        wait: 0
      };
      this.props.childProps.handleProcessSpeechComplete(updates);
      this.props.childProps.handleSpeak(
        this.state.userSpeechChanged,
        callingUnits[step4Index].voice,
        5000
      );
    }
  }

  async giveResponse(id, assignKeyword, parDetected, simpleAssignment) {
    const { userSpeechChanged } = this.state;
    const {
      callingUnits,
      transcript,
      step4Index,
      parSpeech
    } = this.props.childProps;

    if (parDetected) {
      var phrase = 'All personnel are present and accounted for';
      var newParSpeech = parSpeech;
      newParSpeech.push(transcript);

      const updates = {
        assignmentCheck: 1,
        parSpeech: newParSpeech,
        transcript: '',
        wait: 1
      };
      this.props.childProps.handleProcessSpeechComplete(updates);
      this.props.childProps.handleSpeak(
        phrase,
        callingUnits[step4Index].voice,
        5000
      );
    } else if (assignKeyword) {
      console.log('In assign keyword response function');
      await this.changeKeywords(transcript);

      phrase =
        callingUnits[step4Index].name + 'copies' + this.state.userSpeechChanged;
      //phrase = 'Assigned keyword detected';
      const newStep4Index = step4Index + 1;
      const updates = {
        step4Index: newStep4Index,
        assignmentCheck: 0,
        transcript: '',
        wait: 0
      };
      this.props.childProps.handleProcessSpeechComplete(updates);
      //this.props.childProps.handleStep4Assignment();
      this.props.childProps.handleSpeak(
        this.state.userSpeechChanged,
        callingUnits[step4Index].voice,
        5000
      );
    } else if (simpleAssignment) {
      phrase = callingUnits[step4Index].name + 'copies' + userSpeechChanged;
      await this.changeKeywords(transcript);
      const newStep4Index = step4Index + 1;
      let { slicerMatched, rectoMatched } = this.props.childProps;
      if (id === 0) {
        slicerMatched[3].matched = 1;
        slicerMatched[3].matchKeyword = 'Fire Attack';
        slicerMatched[4].matched = 1;
        slicerMatched[4].matchKeyword = 'Fire Attack';
        rectoMatched[2].matched = 1;
        rectoMatched[2].matchKeyword = 'Fire Attack';
        rectoMatched[3].matched = 1;
        rectoMatched[3].matchKeyword = 'Fire Attack';
      }

      const updates = {
        step4Index: newStep4Index,
        assignmentCheck: 0,
        transcript: '',
        wait: 0
      };
      this.props.childProps.handleProcessSpeechComplete(updates);
      setTimeout(() => {
        this.props.childProps.handleSpeak(
          this.state.userSpeechChanged,
          callingUnits[step4Index].voice,
          5000
        );
      }, 1000);
    } else {
      console.log('=============Group Id is : ' + id + '=============');
      //0: Fire Attack  1: Exposure Group    2: Vent Group   3: Rick Group     4: Simple Response
      let phrase;
      if (id === 0)
        phrase =
          'The building is withstanding the insult, we are advancing and we do not need any additional resources at this time.';
      if (id === 1)
        phrase =
          'The exposure is withstanding the insult, we are protecting the exposures and we do not need any additional resources at this time.';
      if (id === 2)
        phrase =
          'The building is withstanding the insult, we are ventilating and we could use additional resources.';
      if (id === 3)
        phrase =
          'We are in position and are softening the building. All IDLH resources are located, we do not need any additional resources.';

      const updates = {
        assignmentCheck: 1,
        transcript: '',
        wait: 1
      };
      
      this.props.childProps.handleProcessSpeechComplete(updates);
      //this.props.childProps.handleStep4Assignment();
      console.log(phrase);
      this.props.childProps.handleSpeak(
        phrase,
        callingUnits[step4Index].voice,
        5000
      );
    }
  }

  async changeKeywords(userSpeech) {
    var mapObj = {
      'You will': 'I will',
      'you will': 'I will',
      'You are': 'I am',
      'you are': 'I am',
      'Your': 'my',
      'your': 'my',
      'we have': 'there are',
      'We have': 'there are',
      'Let me know': 'Ok I will let you know',
      'let me know': 'Ok I will let you know'
    };
    var changeSpeech = userSpeech.replace(
      /you will|you are|your|we have/gi,
      matched => {
        return mapObj[matched];
      }
    );
    this.setState({ userSpeechChanged: changeSpeech });
  }

  groupMatching(checkUserSpeech, groupDictionary, userSpeech) {
    groupDictionary.forEach(function(elem) {
      var re = new RegExp(elem, 'gi');
      if (userSpeech.match(re)) {
        checkUserSpeech = 1;
      }
    });
    return checkUserSpeech;
  }

  async groupAssignment(
    checkUserSpeech,
    groups,
    groupId,
    index,
    parDetected,
    callingUnits,
    simpleAssignment,
    assignKeyword,
    step4Index
  ) {
    if (checkUserSpeech) {
      //Check if it is not already assigned to someone
      if (!groups[groupId].assigned && !parDetected) {
        // Simple assignment
        callingUnits[index].group = 'Fire attack';
        groups[groupId].assigned_to.push(callingUnits[step4Index].name);
        groups[groupId].assigned = 1;
        // userAssignTranscript();
        simpleAssignment = 1;

        //EVALUATION//
        let { slicerMatched, rectoMatched } = this.props.childProps;
        slicerMatched = slicerMatched.slicerMatched;
        rectoMatched = rectoMatched.rectoMatched;

        if (groupId === 0) {
          slicerMatched[3].matched = 1;
          slicerMatched[3].matchKeyword = 'Fire Attack';
          slicerMatched[4].matched = 1;
          slicerMatched[4].matchKeyword = 'Fire Attack';
          rectoMatched[2].matched = 1;
          rectoMatched[2].matchKeyword = 'Fire Attack';
          rectoMatched[3].matched = 1;
          rectoMatched[3].matchKeyword = 'Fire Attack';
        }

        if (groupId === 1) {
          rectoMatched[1].matched = 1;
          rectoMatched[1].matchKeyword = 'Exposure Group';
        }

        if (groupId === 2) {
          rectoMatched[5].matched = 1;
          rectoMatched[5].matchKeyword = 'Ventilation Group';
        }

        const { evaluationUpdate } = {
          slicerMatched,
          rectoMatched
        };

        this.props.childProps.handleEvaluationComplete(evaluationUpdate);
        //EVALUATION//

        console.log(
          `${groups[groupId].name} assigned to ${callingUnits[step4Index].name}`
        );
        this.giveResponse(4, assignKeyword, parDetected, simpleAssignment);
      } else {
        // IF PAR AND ALREADY ASSIGNED
        if (!parDetected) {
          //If assigned
          if (groups[groupId].assigned && !assignKeyword) {
            groups[groupId].response = 1;
            this.giveResponse(groupId, assignKeyword, parDetected);
            step4Index--;
          } else {
            // IF ASSIGNED
            console.log(`${groups[groupId]} assigned with assign keyword`);
            groups[groupId].assigned_to.push(callingUnits[index].name);
            groups[groupId].assigned = 1;
            this.giveResponse(groupId, assignKeyword, parDetected);
            // userAssignTranscript();
          }
        } else {
          //GROUP PAR
          console.log('I am in par function to call response');
          //EVALUATION//
          let { processArrivalMatched, transcript } = this.props.childProps;
          processArrivalMatched[0] = {};
          processArrivalMatched[0].matched = 1;
          processArrivalMatched[0].matchKeyword = transcript;
          const evaluationUpdate = {
            processArrivalMatched: processArrivalMatched
          };
          this.props.childProps.handleEvaluationComplete(evaluationUpdate);
          //EVALUATION//
          this.giveResponse(groupId, assignKeyword, parDetected);
          step4Index--;
        }
      }
    }
    return {
      checkUserSpeech,
      groups,
      index,
      simpleAssignment,
      assignKeyword,
      parDetected,
      step4Index
    };
  }

  arrivalEvaluation() {
    const { groups } = this.props;
    let { slicerMatched, rectoMatched } = this.props;
    console.dir(groups);
    if (groups[0].assigned === 1) {

      slicerMatched[3].matched = 1;
      slicerMatched[3].matchKeyword = 'Fire Attack';
      slicerMatched[4].matched = 1;
      slicerMatched[4].matchKeyword = 'Fire Attack';
      rectoMatched[2].matched = 1;
      rectoMatched[2].matchKeyword = 'Fire Attack';
      rectoMatched[3].matched = 1;
      rectoMatched[3].matchKeyword = 'Fire Attack';
    }

    if (groups[1].assigned) {
      rectoMatched[1].matched = 1;
      rectoMatched[1].matchKeyword = 'Exposure Group';
    }

    if (groups[2].assigned) {
      rectoMatched[5].matched = 1;
      rectoMatched[5].matchKeyword = 'Ventilation Group';
    }

    const updates = {
      rectoMatched: rectoMatched,
      slicerMatched: slicerMatched
    };
    this.props.handleEvaluationComplete(updates);
  }

  render() {
    return <div />;
  }
}
