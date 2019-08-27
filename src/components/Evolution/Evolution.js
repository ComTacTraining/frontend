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
    step: 1,
    transcript: '',
    recognition: null,
    speechRecognitionResult: '',
    isSpeaking: false,
    canTalk: true,
    videosLoaded: 0,
    preloadPercentage: 0,
    //// CJ VARIABLES ////
    flag : true,
    assignmentCheck: 0,
    finalJsonOutput : [],
    finalJsonOutputIndex : 0,
    parSpeech : [],
    parSpeechIndex : 0,
    groups : [],
    callingUnits :[],
    step4Index : 0,
    step4Speak: false
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
    const groupNames = ['Fire Attack', 'Exposure Group', 'Ventilation Group', 'RIC Group'];
    const { groups, firstAlarm, callingUnits} = this.state;
    groupNames.forEach((element, index) => {
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
    firstAlarm.forEach((elem, index) => {
      callingUnits[index] = [];
      callingUnits[index].name = elem;
      callingUnits[index].group='';
    });
    this.setState({groups: groups, callingUnits: callingUnits}, ()=>{
      console.dir(this.state.callingUnits);
      console.dir(this.state.groups);
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
            this.setDispatchText();
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
    // const dispatchLoop = this.dispatchLoop.current;
    // const approach = this.approach.current;
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

    if(step === 5){
      console.log('Inside step 5 statement');
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

  speechCallback = (step4Index, assignmentCheck, step, groups, parSpeech, parSpeechIndex) => {
    this.setState({step4Index: step4Index, assignmentCheck: assignmentCheck, step: step, groups: groups,
    parSpeech: parSpeech, parSpeechIndex});
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
      //CJ
      assignmentCheck,
      parSpeech,
      parSpeechIndex,
      callingUnits, 
      step4Index,
      groups
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    return (
      !isLoadingEvolution && (
        <div>
          <p>{transcript}</p>
          {speakPhrases.length > 0 && (
            <Speak
              phrases={speakPhrases}
              voice={speakVoice}
              timeout={speakTimeout}
              handleSpeechComplete={this.handleSpeechComplete}
              callbackForSpeak={this.speakCallBack}
              step = {step}
              step4Index = {step4Index}
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
              //CJ
              firstAlarm={firstAlarm}
              secondAlarm={secondAlarm}
              parSpeech = {parSpeech}
              parSpeechIndex = {parSpeechIndex}
              callingUnits = {callingUnits}
              step4Index = {step4Index}
              assignmentCheck = {assignmentCheck}
              groups = {groups}
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
