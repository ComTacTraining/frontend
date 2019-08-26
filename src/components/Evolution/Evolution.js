import React, { Component } from 'react';
//import { API, Storage } from 'aws-amplify';
import { API } from 'aws-amplify';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
//import Videos from './Videos/Videos';
//import VideoCanvas from './VideoCanvas/VideoCanvas';
import TextCanvas from './TextCanvas/TextCanvas';
import './Evolution.css';
import playButton from './play.svg';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Speak from './Speak/Speak';
import ProcessSpeech from './ProcessSpeech/ProcessSpeech';
//import Listen from './Listen/Listen';
import { education } from './Education/Education';
import config from '../../config';

export default class Evolution extends Component {
  state = {
    isLoadingEvolution: true,
    alarms: null,
    firstAlarm: [],
    secondAlarm: [],
    chief: '',
    evolution: null,
    videos: [],
    timerId: null,
    isPlaying: false,
    preloadedVideoCount: 0,
    currentVideo: null,
    scrollText: [],
    speakPhrases: [],
    speakVoice: 'enUS_Male',
    speakTimeout: 0,
    step: 3,
    transcript: '',
    recognition: null,
    speechRecognitionResult: '',
    isSpeaking: false,
    canTalk: true,
    videosLoaded: 0,
    preloadPercentage: 0,
    /////////////////////CJ VARIABLES////////////////////
    flag : true,
    assignmentCheck: 0,
    ////Dictionary
    alarm2KeywordDictionary : ['Alarm 2:00', 'Alarm 2', 'alarm 2:00', 'alarm 2', 'alarm two', 'Alarm two'],
    fireAttackDictionary : ['fire attach', 'fire attack', 'far attack'],
    exposureGroupDictionary : ['exposure'],
    ventGroupDictionary : ['whent', 'went', 'vent', 'when', 'Ventilacion', 'Ventilation'],
    rickGroupDictionary : ['rick', 'R I C', 'R.I.C', 'Rick', 'R I C', 'Ric', 'ric'],
    assignKeywordDictionary : ['Assign', 'assign', 'Sign', 'Sign', 'Assigned'],
    parKeywordDictionary : ['Par', 'par', 'per', 'bar'],
    ////Dictionary
    finalJsonOutput : [],
    finalJsonOutputIndex : 0,
    comp_speakup_allowed : 1,
    repeat : 0,
    simpleAssignment : 0,
    assignKeyword : 0,
  
    nameDetected : 0,
    user_speech: '',
    all_user_speech : [],
    user_speech_index : 0,
    user_speech_end_detected : 0,
    assigned : 0,
    assignedSpeech : [],
    assignedSpeechIndex : 0,
    parDetected : 0,
    parSpeech : [],
    parKeyword : 0,
    parSpeechIndex : 0,
    userSpeech : [],
    userSpeechIndex : 0,
    initial_report: '',
    secondary_report: '',
    user_speech_changed: '',
    commanding_unit_report : '',
    groups : [],
    group_names : ['Fire Attack', 'Exposure Group', 'Ventilation Group', 'RIC Group'],
    alarm1_units : [],
    calling_units :[],
    calling_units_length : 0,
    step4_index : 0,
    checkUserSpeech: 0, alarm2_called: 0,
    step4Speak: false
    // group_names : ['Fire Attack', 'Exposure Group', 'Ventilation Group', 'RIC Group'],
    // groups : [{
    //   "name": "Fire Attack", "assigned": 0, "assigned_to": [], "response": 0
    // }, {
    //   "name": "Exposure Group", "assigned": 0, "assigned_to": [], "response": 0
    // }, {
    //   "name": "Ventilation Group", "assigned": 0, "assigned_to": [], "response": 0
    // }, {
    //   "name": "RIC Group", "assigned": 0, "assigned_to": [], "response": 0
    // }],
    // x: '',
    // y: null,
    // alarm1_temp: null,
    // alarm2_temp: null,
    // unit1_names: null,
    // unit2_names: null,
    // alarm1_units : [],
    // alarm2_units : [],
    // alarm1_index : 0,
    // alarm2_index : 0,
    // step4_index : 0,
    // initial_report: null,
    // secondary_report: null,
    // calling_units : [],
    // calling_units_length : 0,
    // alarm2_names: null,
    // alarm2_called : 0,
    // wait : 0,
    // alarms: null,
    // wait: false
  };

  constructor(props) {
    super(props);
    this.canvasContainer = React.createRef();
    this.videoCanvas = React.createRef();
    this.intro = React.createRef();
    this.dispatch = React.createRef();
    this.dispatchLoop = React.createRef();
    this.approach = React.createRef();
    this.alphaIntro = React.createRef();
    this.bravo = React.createRef();
    this.charlie = React.createRef();
    this.delta = React.createRef();
    this.alpha = React.createRef();
    this.alphaLoop = React.createRef();
    this.credits = React.createRef();
    this.fps = 30;
  }

  loadVariables() {
    console.log('Load Variables');
    var {group_names, groups, firstAlarm, calling_units} = this.state;
    group_names.forEach((element, index) => {
      groups[index] = [];
      groups[index].name = element;
      groups[index].response = 0;
      groups[index].assigned = 0;
      groups[index].assigned_to = [];
      //For double assignment
      groups[index].found = 0;
      groups[index].index = 0;
      groups[index].count = 0;
    });
    var index = 0;
    firstAlarm.forEach((elem, index) => {
      calling_units[index] = [];
      calling_units[index].name = elem;
      calling_units[index].group='';
    });
    this.setState({groups: groups, calling_units: calling_units, calling_units_length: index}, ()=>{
      console.dir(calling_units);
    });
  }

  async componentDidMount() {
    const ponyfill = await createPonyfill({
      region: 'westus',
      subscriptionKey: config.COGNITIVE_SPEECH_KEY
    });
    this.setState(() => ({ ponyfill }));
    if (this.props.match.params.id) {
      try {
        const evolution = await this.getEvolution(this.props.match.params.id);
        this.setState(
          { evolution: evolution, isLoadingEvolution: false },
          async () => {
            // this.getVideos();
            
            //this.setDispatchText();
            await this.setupAlarms();
            await this.loadVariables();
          }
        );
      } catch (e) {
        alert(e.message);
        this.setState({ isLoadingEvolution: false });
      }
    }
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  async setupAlarms() {
    try {
      const alarms = await this.getAlarms();
      let firstAlarm = alarms.alarm1.split(',').map(alarm => alarm.trim());
      let secondAlarm = alarms.alarm2.split(',').map(alarm => alarm.trim());
      // firstAlarm.shift();
      //const chief = firstAlarm.pop();
      const chief = firstAlarm[0];
      this.setState(
        { alarms: alarms, firstAlarm: firstAlarm, secondAlarm: secondAlarm, chief: chief },
        () => {
          //this.shuffleFirstAlarm();
        }
      );
    } catch (e) {
      alert(e.message);
    }
  }

  shuffleFirstAlarm() {
    let { firstAlarm } = this.state;
    for (let i = firstAlarm.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [firstAlarm[i], firstAlarm[j]] = [firstAlarm[j], firstAlarm[i]];
    }
    this.setState({ firstAlarm: firstAlarm });
  }

  getEvolution(id) {
    return API.get('comtac', `/evolutions/${id}`);
  }

  getAlarms() {
    return API.get('comtac', '/alarms');
  }

  componentWillUnmount() {
    // this.stopTimer();
  }

  setDispatchText() {
    console.log('setDispatchText()')
    const { alarms, evolution } = this.state;
    const phrase = `Structure fire, ${alarms.alarm1} at ${evolution.street}.`;
    const scrollText = [phrase, `Repeating. ${phrase}`];
    this.setState({ scrollText: scrollText, speakPhrases: scrollText });
  }

  setEducationText() {
    console.log('setEducationText()')
    const { alarms, evolution } = this.state;
    const phrases = education(evolution, alarms);
    this.setState({ scrollText: phrases, speakPhrases: phrases });
  }

  handleDispatchLoopComplete = () => {
    console.log('handleDispatchLoopComplete()')
    const dispatchLoop = this.dispatchLoop.current;
    const approach = this.approach.current;
    this.setState(
      { currentVideo: 'approach', scrollText: [], speakPhrases: [] },
      () => {
        // this.stopTimer();
        // // CJ Comment
        // dispatchLoop.pause();
        // approach.play();
      }
    );
  };

  handleAlphaLoopComplete = () => {
    console.log('handleAlphaLoopComplete()')
    const alphaLoop = this.alphaLoop.current;
    const credits = this.credits.current;
    this.setState({ currentVideo: 'credits', scrollText: [] }, () => {
      this.stopTimer();
      alphaLoop.pause();
      credits.play();
    });
  };

  handleStep4Assignment = () => {
    console.log('handleStep4Assignment()')
    this.setState({isSpeaking: false});
  }

  handleStepUpdate = step => {
    console.log(`handleStepUpdate(${step});`);
    this.setState({ step: step });
  };

  handleSpeak = (phrases, voice = 'enUS_Male', timeout = 0) => {
    // console.log('handleSpeak()')
    // console.log(`handleSpeak(${phrases}, ${voice}, ${timeout});`);
    this.setState({
      speakPhrases: phrases,
      speakVoice: voice,
      speakTimeout: timeout,
      isSpeaking: true
    });
  };

  handleSpeechComplete = () => {
    console.log('handleSpeechComplete()')
    const { step } = this.state;
    let newStep = step;
    if (step < 4) {
      newStep++;
    }

    if(step === 4){
      console.log('Evolution Assignment check is ' + this.state.assignmentCheck);
      this.setState({isSpeaking: false});
    }

    this.setState({ speakPhrases: [], step: newStep, isSpeaking: false });
  };

  handleTranscriptReset = () => {
    console.log('handleTranscriptReset()')
    this.setState({ transcript: '' });
  };

  handleListenComplete = () => {
    // console.log('handleListenComplete()')
    const { speechRecognitionResult, step } = this.state;
    // console.log(speechRecognitionResult);
    this.setState({
      transcript: speechRecognitionResult,
      speechRecognitionResult: '',
      step4Speak: true,
      speakPhrases: speechRecognitionResult,
      isSpeaking: false
    });
    if (step === 1) {
      this.handleStepUpdate(2);
    }

  };

  handleListenResponse = response => {
    console.log(`handleListenResponse(${response});`);
    const { speechRecognitionResult } = this.state;
    const newResult = `${speechRecognitionResult} ${response}`.trim();
    this.setState({ speechRecognitionResult: newResult, isSpeaking: true, step4Speak: false});
    this.setState({ speechRecognitionResult: newResult});

  };

  handleKeyDown = event => {
    const { speakPhrases, recognition, isSpeaking, canTalk, step4Speak } = this.state;
    if (event.code === 'Space' && canTalk) {
      event.preventDefault();

      if (!event.repeat) {
        // Only allow microphone when not speaking
        if (speakPhrases.length === 0 && recognition === null) {
          const { ponyfill } = this.state;
          const recognition = new ponyfill.SpeechRecognition();
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          recognition.onresult = ({ results }) => {
            this.handleListenResponse(results[0][0].transcript);
          };
          recognition.start();
          this.setState({ recognition: recognition});
          this.setState({ recognition: recognition, isSpeaking: true, step4Speak: false });
          // this.setState({ recognition: recognition, isSpeaking: false });
        }
      }
      if (event.repeat && !step4Speak) {
        recognition.start();
        this.setState({ isSpeaking: true, step4Speak: true });

      }
    }
  };

  handleKeyUp = event => {
    const { recognition, canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      setTimeout(() => {
        recognition.stop();
        this.setState({ recognition: null, isSpeaking: true });
        this.handleListenComplete();
      }, 1000);
    }
  };

  speakCallback = (checkUserSpeech1, assignKeyword1, parDetected1, nameDetected1, assigned1, simpleAssignment1, alarm2KeywordDictionary1,
    alarm2_called1) => {
      // console.log('Speak callback called');
      this.setState({checkUserSpeech: checkUserSpeech1, assignKeyword: assignKeyword1, parDetected: parDetected1, nameDetected: nameDetected1, 
      assigned: assigned1, simpleAssignment: simpleAssignment1, alarm2KeywordDictionary: alarm2KeywordDictionary1,alarm2_called: alarm2_called1});
  }

  speechCallback = (calling_units, calling_units_length, step4_index, assignmentCheck) => {
    // console.log('Speech callback with assignment check ' + assignmentCheck);
    this.setState({calling_units:calling_units, calling_units_length: calling_units_length, step4_index: step4_index,
      assignmentCheck: assignmentCheck}, ()=>{
      //console.log(this.state.calling);
    });
    
   };

   startSimulation = async () => {
    await this.loadVariables();
    //this.setDispatchText();
   };

  render() {
    const {
      isLoadingEvolution,
      videos,
      isPlaying,
      currentVideo,
      scrollText,
      speakPhrases,
      speakVoice,
      speakTimeout,
      alarms,
      firstAlarm,
      secondAlarm,
      step,
      transcript,
      isSpeaking,
      preloadPercentage,
      assignmentCheck,
      parDetected,
      parSpeech,
      parKeyword,
      parSpeechIndex,
      //CJ
      alarm2KeywordDictionary,assignKeywordDictionary,parKeywordDictionary,fireAttackDictionary,exposureGroupDictionary,ventGroupDictionary,rickGroupDictionary,
      calling_units, calling_units_length, step4_index,
      checkUserSpeech, assignKeyword, nameDetected, assigned, simpleAssignment,
      alarm2_called,
      groups, repeat,
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    return (
      !isLoadingEvolution && (
        <div>
          <button onClick={this.startSimulation}>Start Simulation</button>
          <p>{transcript}</p>
          {speakPhrases.length > 0 && (
            <Speak
              phrases={speakPhrases}
              voice={speakVoice}
              timeout={speakTimeout}
              handleSpeechComplete={this.handleSpeechComplete}
              callbackForSpeak={this.speakCallBack}
              step = {step}
              step4_index = {step4_index}
            />
          )}
          {(transcript !== '' || step >= 4) && !isSpeaking && (
            <ProcessSpeech
              dispatchCenter={alarms.dispatchCenter}
              step={step}
              transcript={transcript}
              handleStepUpdate={this.handleStepUpdate}
              handleSpeak={this.handleSpeak}
              handleTranscriptReset={this.handleTranscriptReset}
              speechCallback={this.speechCallback}
              handleStep4Assignment = {this.handleStep4Assignment}
              //Alarms
              firstAlarm={firstAlarm}
              secondAlarm={secondAlarm}
              // Dictionary
              alarm2KeywordDictionary={alarm2KeywordDictionary}
              assignKeywordDictionary={assignKeywordDictionary}
              parKeywordDictionary = {parKeywordDictionary}
              fireAttackDictionary={fireAttackDictionary}
              exposureGroupDictionary={exposureGroupDictionary}
              ventGroupDictionary={ventGroupDictionary}
              rickGroupDictionary={rickGroupDictionary}
              // parVariables
              parDetected = {parDetected}
              parKeyword = {parKeyword}
              parSpeech = {parSpeech}
              parSpeechIndex = {parSpeechIndex}
              //Other
              checkUserSpeech = {checkUserSpeech}
              assignKeyword = {assignKeyword}
              assignKeyword = {assignKeyword}
              assigned = {assigned}
              simpleAssignment = {simpleAssignment}
              alarm2_called = {alarm2_called}
              calling_units = {calling_units}
              calling_units_length = {calling_units_length}
              step4_index = {step4_index}
              assignmentCheck = {assignmentCheck}
              groups = {groups}
              repeat = {repeat}
              
            />
          )}
          {/* <Listen
            handleListenResponse={this.handleListenResponse}
          /> */}
          {videos.map(video => (
            <video
              ref={this[video.id]}
              key={video.id}
              onPlay={this.handlePlay}
              onEnded={this.handleEnded(video.next)}
              onLoadedData={this.handleLoadedData(video.id)}
              hidden
            />
          ))}
          <div className='canvas' ref={this.canvasContainer}>
            {!isPlaying && preloadPercentage === 100 && (
              <img
                src={playButton}
                onClick={this.handlePlayClicked}
                className='playButton'
                alt='Play Video'
              />
            )}
            {!isPlaying && preloadPercentage < 100 && (
              <ProgressBar
                striped
                animated
                now={preloadPercentage}
                className='progressBar'
              />
            )}
            {scrollText.length > 0 && (
              <TextCanvas text={scrollText} handleCallback={handleCallback} />
            )}
            <canvas
              ref={this.videoCanvas}
              width='800'
              height='450'
              onClick={this.handlePlayClicked}
              className='videoCanvas'
            />
          </div>
        </div>
      )
    );
  }
}
