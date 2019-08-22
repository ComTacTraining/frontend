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
    step: 0,
    transcript: '',
    recognition: null,
    speechRecognitionResult: '',
    isSpeaking: false,
    canTalk: false,
    videosLoaded: 0,
    preloadPercentage: 0,
    /////////////////////CJ VARIABLES////////////////////
    flag : true,
    ////Dictionary
    alarm2KeywordDictionary : ['Alarm 2:00', 'Alarm 2', 'alarm 2:00', 'alarm 2', 'alarm two', 'Alarm two'],
    fireAttackDictionary : ['fire attach', 'fire attack', 'far attack'],
    exposureGroupDictionary : ['exposure'],
    ventGroupDictionary : ['whent', 'went', 'vent', 'when', 'Ventilacion', 'Ventilation'],
    rickGroupDictionary : ['rick', 'R I C', 'R.I.C', 'Rick', 'R I C'],
    assignKeywordDictionary : ['Assign', 'assign', 'Sign', 'Sign', 'Assigned'],
    parKeywordArray : ['Par', 'par', 'per', 'bar'],
    ////Dictionary
    finalJsonOutput : [],
    finalJsonOutputIndex : 0,
    comp_speakup_allowed : 1,
    repeat : 0,
    simpleAssignment : 0,
    assignKeyword : 0,
    parDetected : 0,
    nameDetected : 0,
    user_speech: '',
    all_user_speech : [],
    user_speech_index : 0,
    user_speech_end_detected : 0,
    assigned : 0,
    assignedSpeech : [],
    assignedSpeechIndex : 0,
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
    checkUserSpeech: 0, alarm2_called: 0
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
    const {group_names, groups, firstAlarm, calling_units, calling_units_length} = this.state;
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
    firstAlarm.forEach(elem => {
      calling_units[index] = [];
      calling_units[index].name = elem;
      index++;
    });
    this.setState({groups: groups, calling_units: calling_units, calling_units_length: index}, ()=> {
      console.log(this.state.calling_units_length);
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
          () => {
            this.getVideos();
            
            //this.setDispatchText();
            this.setupAlarms();
            
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
          console.log(this.state.firstAlarm, this.state.secondAlarm);
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
    this.stopTimer();
  }

  getVideos = async () => {
    console.log('getVideos()');
    const { evolution } = this.state;
    const bucket = 'https://s3-us-west-2.amazonaws.com/ctt-video/';
    const fileType = '.mp4';
    const videos = [
      {
        id: 'intro',
        src: bucket + evolution.intro + fileType,
        next: 'dispatch'
      },
      {
        id: 'dispatch',
        src: bucket + 'CTT Dispatch with Label' + fileType,
        next: 'dispatchLoop'
      },
      {
        id: 'dispatchLoop',
        src: bucket + 'CTT Dispatch no label' + fileType,
        next: 'dispatchLoop'
      },
      {
        id: 'approach',
        src: bucket + evolution.approach + fileType,
        next: 'alphaIntro'
      },
      {
        id: 'alphaIntro',
        src: bucket + evolution.loop + fileType,
        next: 'bravo'
      },
      {
        id: 'bravo',
        src: bucket + evolution.bravo + fileType,
        next: 'charlie'
      },
      {
        id: 'charlie',
        src: bucket + evolution.charlie + fileType,
        next: 'delta'
      },
      { id: 'delta', src: bucket + evolution.delta + fileType, next: 'alpha' },
      {
        id: 'alpha',
        src: bucket + evolution.alpha + fileType,
        next: 'alphaLoop'
      },
      {
        id: 'alphaLoop',
        src: bucket + evolution.loop + fileType,
        next: 'alphaLoop'
      },
      { id: 'credits', src: bucket + 'Credits' + fileType, next: '' }
    ];
    this.setState({ videos: videos }, this.preloadVideos);
  };

  preloadVideos() {
    console.log('preloadVideos()');
    const { videos } = this.state;
    videos.forEach(video => {
      this.preloadVideo(video);
    });
  }

  preloadVideo(video) {
    console.log('preloadVideo()');
    const vidRef = this[video.id].current;
    fetch(video.src, { mode: 'cors' })
      .then(response => response.blob())
      .then(videoBlob => {
        const videoObject = window.URL.createObjectURL(videoBlob);
        vidRef.src = videoObject;
        this.updateVideosLoaded();
      });
  }

  updateVideosLoaded() {
    console.log('updateVideosLoaded()');
    const { videosLoaded, videos } = this.state;
    const newVideosLoaded = videosLoaded + 1;
    const preloadPercentage = Math.floor(
      (newVideosLoaded / videos.length) * 100
    );
    this.setState({
      videosLoaded: newVideosLoaded,
      preloadPercentage: preloadPercentage
    });
  }

  stopTimer() {
    console.log('stopTimer()');
    const { timerId } = this.state;
    window.clearInterval(timerId);
  }

  drawImage(video) {
    console.log('drawImage()');
    const canvas = this.videoCanvas.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  loadVideo(video) {
    console.log('loadVideo()');
    const timerId = window.setInterval(() => {
      this.drawImage(video);
    }, this.fps);
    this.setState({ timerId: timerId });
  }

  handlePlay = event => {
    console.log('handlePlay()');
    this.loadVideo(event.target);
  };

  handleEnded = next => event => {
    console.log('handleEnded()')
    const { scrollText } = this.state;
    if (scrollText.length === 0 && next === 'dispatchLoop') {
      this.setDispatchText();
    } else if (scrollText.length === 0 && next === 'alphaLoop') {
      //this.setEducationText();
    } else if (next === 'alphaIntro') {
      this.setState({ canTalk: true });
    }
    const video = this[next].current;
    this.stopTimer();
    video.play();
    this.setState({ currentVideo: next });
  };

  handleLoadedData = id => event => {
    console.log('handleLoadedData()')
    console.log(id);
    if (id === 'intro') {
      const intro = this.intro.current;
      this.drawImage(intro);
    }
  };

  handlePlayClicked = () => {
    console.log('handlePlayClicked()')
    const canvas = this.canvasContainer.current;
    if (canvas.requestFullScreen) {
      canvas.requestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    } else if (canvas.moRequestFullScreen) {
      canvas.mozRequestFullScreen();
    }

    const { isPlaying } = this.state;
    if (!isPlaying) {
      this.stopTimer();
      const intro = this.intro.current;
      intro.play();
      this.setState({ isPlaying: true });
    }
  };

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
        this.stopTimer();
        // // CJ Comment
        dispatchLoop.pause();
        approach.play();
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

  handleStepUpdate = step => {
    console.log(`handleStepUpdate(${step});`);
    this.setState({ step: step });
  };

  handleSpeak = (phrases, voice = 'enUS_Male', timeout = 0) => {
    console.log('handleSpeak()')
    console.log(`handleSpeak(${phrases}, ${voice}, ${timeout});`);
    this.setState({
      speakPhrases: phrases,
      speakVoice: voice,
      speakTimeout: timeout
    });
  };

  handleSpeechComplete = () => {
    console.log('handleSpeechComplete()')
    const { step } = this.state;
    let newStep = step;
    if (step < 3) {
      newStep++;
    }
    this.setState({ speakPhrases: [], step: newStep });
  };

  handleTranscriptReset = () => {
    console.log('handleTranscriptReset()')
    this.setState({ transcript: '' });
  };

  handleListenComplete = () => {
    console.log('handleListenComplete()')
    const { speechRecognitionResult, step } = this.state;
    console.log(speechRecognitionResult);
    this.setState({
      transcript: speechRecognitionResult,
      speechRecognitionResult: ''
    });
    if (step === 0) {
      this.handleStepUpdate(1);
    }
  };

  handleListenResponse = response => {
    console.log('handleListenResponse()')
    console.log(`handleListenResponse(${response});`);
    const { speechRecognitionResult } = this.state;
    const newResult = `${speechRecognitionResult} ${response}`.trim();
    this.setState({ speechRecognitionResult: newResult, isSpeaking: false });
  };

  handleKeyDown = event => {
    const { speakPhrases, recognition, isSpeaking, canTalk } = this.state;
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
          this.setState({ recognition: recognition, isSpeaking: true });
        }
      }
      if (event.repeat && !isSpeaking) {
        recognition.start();
        this.setState({ isSpeaking: true });
      }
    }
  };

  handleKeyUp = event => {
    const { recognition, canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      setTimeout(() => {
        recognition.stop();
        this.setState({ recognition: null, isSpeaking: false });
        this.handleListenComplete();
      }, 1000);
    }
  };

  speakCallback = (checkUserSpeech1, assignKeyword1, parDetected1, nameDetected1, assigned1, simpleAssignment1, alarm2KeywordDictionary1,
    alarm2_called1) => {
      console.log('Speak callback called');
      this.setState({checkUserSpeech: checkUserSpeech1, assignKeyword: assignKeyword1, parDetected: parDetected1, nameDetected: nameDetected1, 
      assigned: assigned1, simpleAssignment: simpleAssignment1, alarm2KeywordDictionary: alarm2KeywordDictionary1,alarm2_called: alarm2_called1});
  }

  speechCallback = (firstAlarm1, calling_units1, calling_units_length1, step4_index1) => {
    const {firstAlarm, calling_units, calling_units_length, step4_index} = this.state;
    console.log('STAP : '+ step4_index);
    //console.log(dataFromChild);
    this.setState({firstAlarm: firstAlarm1, calling_units:calling_units1, calling_units_length: calling_units_length1, step4_index: step4_index1}, ()=>{
      console.log(this.state.calling);
    });
    
   };

   startSimulation = () => {
    this.loadVariables();
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
      step,
      transcript,
      isSpeaking,
      preloadPercentage,
      //CJ
      calling_units, calling_units_length, step4_index,
      checkUserSpeech, assignKeyword, parDetected, nameDetected, assigned, simpleAssignment, alarm2KeywordDictionary,
      alarm2_called
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    return (
      !isLoadingEvolution && (
        <div>
          <button onClick={this.startSimulation}>Start Simulation</button>
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
          {(transcript !== '' || step >= 3) && !isSpeaking && (
            <ProcessSpeech
              firstAlarm={firstAlarm}
              dispatchCenter={alarms.dispatchCenter}
              step={step}
              transcript={transcript}
              handleStepUpdate={this.handleStepUpdate}
              handleSpeak={this.handleSpeak}
              handleTranscriptReset={this.handleTranscriptReset}
              speechCallback={this.speechCallback}
              calling_units={calling_units}
              calling_units_length = {calling_units_length}
              step4_index = {step4_index}  
              checkUserSpeech = {checkUserSpeech}
              assignKeyword = {assignKeyword}
              parDetected = {parDetected}
              nameDetected = {nameDetected}
              assigned = {assigned}
              simpleAssignment = {simpleAssignment}
              alarm2KeywordDictionary = {alarm2KeywordDictionary}
              alarm2_called = {alarm2_called}   
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
