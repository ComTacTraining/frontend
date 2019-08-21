import React, { Component } from 'react';
import { API } from 'aws-amplify';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
//import Videos from './Videos/Videos';
//import VideoCanvas from './VideoCanvas/VideoCanvas';
import TextCanvas from './TextCanvas/TextCanvas';
import './Evolution.css';
import playButton from './play.svg';
// import Speak from './Speak/Speak';
//import Listen from './Listen/Listen';
import { education } from './Education/Education';
import config from '../../config';

import CognitiveSpeech from './Speak/CognitiveSpeech/CognitiveSpeech';
import { isArray } from 'util';
import DictateButton from 'react-dictate-button';
// import { Component } from 'react';
// import CognitiveSpeech from './CognitiveSpeech/CognitiveSpeech';
// import { isArray } from 'util';
// import config from '../../../config';

let step = 0;
export default class Evolution extends Component {
  state = {
    voices: [],
    isLoadingEvolution: true,
    alarms: null,
    Speakspace:null,
    waitAlarm: this.setupAlarms(),
    evolution: null,
    videos: [],
    timerId: null,
    isPlaying: false,
    isReady: false,
    preloadedVideoCount: 0,
    currentVideo: null,
    scrollText: [],
    speakPhrases: [],
    speakVoice: 'enUS_Male',
    speakTimeout: 0,
    //initial_report: null,
    secondary_report: null,
    step1_chunk : false,
    transcript: '',
    recognition: null,
    speechRecognitionResult: '',
    isSpeaking: false,
    canTalk: true,
    step1_pass: false,
    //////////////////////////////CTT///////////////////////////////
    flag : true,
    global_alarm2_array : ['Alarm 2:00', 'Alarm 2', 'alarm 2:00', 'alarm 2', 'alarm two', 'Alarm two'],
    global_fireattach_array : ['fire attach', 'fire attack', 'far attack'],
    global_rickgroup_array : ['rick', 'R I C', 'R.I.C', 'Rick', 'R I C'],
    global_exposuregroup_array : ['exposure'],
    global_ventgroup_array : ['whent', 'went', 'vent', 'when', 'Ventilacion', 'Ventilation'],
    global_assign_array : ['Assign', 'assign', 'Sign', 'Sign', 'Assigned'],
    global_par_array : ['Par', 'par', 'per', 'bar'],
    finalJsonOutput : [],
    finalJsonOutputIndex : 0,
    comp_speakup_allowed : 1,
    repeat : 0,
    assignKeyword : 0,
    parDetected : 0,
    nameDetected : 0,
    user_speech: null,
    all_user_speech : [],
    user_speech_index : 0,
    user_speech_end_detected : 0,
    assigned : 0,
    assignedSpeech : [],
    assignedSpeechIndex : 0,
    userSpeech : [],
    userSpeechIndex : 0,
    STEP : 1,
    group_names : ['Fire Attack', 'Exposure Group', 'Ventilation Group', 'RIC Group'],
    groups : [{
      "name": "Fire Attack", "assigned": 0, "assigned_to": [], "response": 0
    }, {
      "name": "Exposure Group", "assigned": 0, "assigned_to": [], "response": 0
    }, {
      "name": "Ventilation Group", "assigned": 0, "assigned_to": [], "response": 0
    }, {
      "name": "RIC Group", "assigned": 0, "assigned_to": [], "response": 0
    }],
    x: '',
    y: null,
    alarm1_temp: null,
    alarm2_temp: null,
    unit1_names: null,
    unit2_names: null,
    alarm1_units : [],
    alarm2_units : [],
    alarm1_index : 0,
    alarm2_index : 0,
    step4_index : 0,
    initial_report: null,
    secondary_report: null,
    calling_units : [],
    calling_units_length : 0,
    alarm2_names: null,
    alarm2_called : 0,
    wait : 0,
    alarms: null,
    wait: false
  };

  constructor(props) {
    super(props);
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
    /////////////////// JS //////////////////
    // console.log(this.state.groups);
    // //-----------Groups Array--------------//
    // this.state.group_names.forEach((element, index) => {
    //   this.state.groups[index] = [];
    //   this.state.groups[index].name = element;
    //   this.state.groups[index].response = 0;
    //   this.state.groups[index].assigned = 0;
    //   this.state.groups[index].assigned_to = [];
    // });
    // //-----------Groups Array--------------//
  }

  async afterAlarm(alarms) {
    this.setState({
      x: alarms.alarm1,
      y: alarms.alarm2,
      alarm1_temp: alarms.alarm1.split(','),
      alarm2_temp: alarms.alarm2.split(','),
      unit1_names: this.state.alarm1_temp,
      unit2_names: this.state.alarm2_temp
    });
    this.state.alarm1_temp.forEach(name => {
      this.state.alarm1_units[this.state.alarm1_index] = [];
      this.state.alarm1_units[this.state.alarm1_index].name = name;
      this.state.alarm1_index++;
    });
    this.setState({ alarm1_index: 0 });
    
    this.state.alarm2_temp.forEach(name => {
        this.state.alarm2_units[this.state.alarm2_index] = [];
        this.state.alarm2_units[this.state.alarm2_index].name = name;
        this.state.alarm2_index++;
    });
    this.setState({
      calling_units: this.state.alarm1_units,
      calling_units_length: this.state.calling_units.length
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
            this.setupAlarms();
           
            //this.speakUp();
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
      this.setState({ alarms: alarms });
      this.afterAlarm(alarms);
    } catch (e) {
      alert(e.message);
    }
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

  getVideos = () => {
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
        next: 'approach'
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
    this.setState({ videos: videos });
  }

  stopTimer() {
    const { timerId } = this.state;
    window.clearInterval(timerId);
  }

  drawImage(video) {
    const canvas = this.videoCanvas.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  loadVideo(video) {
    const timerId = window.setInterval(() => {
      this.drawImage(video);
    }, this.fps);
    this.setState({ timerId: timerId });
  }

  handlePlay = event => {
    this.loadVideo(event.target);
  };

  handleEnded = next => event => {
    const { scrollText } = this.state;
    if (scrollText.length === 0 && next === 'dispatchLoop') {
      this.setDispatchText();
    } 
    else if (step == 1) {
      const phrase = `Initial Radio Response.`;
      const scrollText = phrase;
      this.setState({ scrollText: scrollText, speakPhrases: scrollText });
      console.log('Step is '+ step);
    }
    else if (scrollText.length === 0 && next === 'alphaLoop') {
      this.setEducationText();
    }
    const video = this[next].current;
    this.stopTimer();
    video.play();
    this.setState({ currentVideo: next });
  };

  handleLoadedData = id => event => {
    if (id === 'intro') {
      const intro = this.intro.current;
      this.drawImage(intro);
    }
  };

  handleCanPlayThrough = () => {
    const { preloadedVideoCount, videos } = this.state;
    const newCount = preloadedVideoCount + 1;
    this.setState({ preloadedVideoCount: newCount });
    if (newCount === videos.length) {
      this.setState({ isReady: true });
    }
  };

  handlePlayClicked = () => {
    const { isPlaying } = this.state;
    if (!isPlaying) {
      this.stopTimer();
      const intro = this.intro.current;
      intro.play();
      this.setState({ isPlaying: true });
    }
  };

  setDispatchText() {
    const { alarms, evolution } = this.state;
    const phrase = `Structure fire, ${alarms.alarm1} at ${evolution.street}.`;
    const scrollText = [phrase, `Repeating. ${phrase}`];
    this.setState({ scrollText: scrollText, speakPhrases: scrollText });
    //step++;
    console.log('Step is '+ step);
  }

  setEducationText() {
    const { alarms, evolution } = this.state;
    const phrases = education(evolution, alarms);
    this.setState({ scrollText: phrases, speakPhrases: phrases });
    //step++;
    console.log('Step is '+ step);
  }

  handleDispatchLoopComplete = () => {
    const dispatchLoop = this.dispatchLoop.current;
    const approach = this.approach.current;
    this.setState(
      { currentVideo: 'approach', scrollText: [], speakPhrases: [] },
      () => {
        this.stopTimer();
        dispatchLoop.pause();
        approach.play();
      }
    );
  };

  handleAlphaLoopComplete = () => {
    const alphaLoop = this.alphaLoop.current;
    const credits = this.credits.current;
    this.setState({ currentVideo: 'credits', scrollText: [] }, () => {
      this.stopTimer();
      alphaLoop.pause();
      credits.play();
    });
  };

  handleListenResponse = response => {
    this.state.user_speech = response;
    console.log(response);
  };

  // handleKeyPress = event => {
  //   // console.dir(this.state.alarms);
  //   if (event.code === 'Space') {
  //     event.preventDefault();
  //     // this.speak();
  //     console.log(this.state);
  //     const { ponyfill } = this.state;
  //     const recognition = new ponyfill.SpeechRecognition();
  //     recognition.interimResults = false;
  //     recognition.lang = 'en-US';
  //     recognition.onresult = ({ results }) => {
  //       this.handleListenResponse(results[0][0].transcript);
  //       this.setState({Speakspace: results[0][0].transcript });
  //       // this.state
  //       this.setupClient();
  //       //this.response();
  //       // console.log(speakPhrases);
  //       // const phrase = `Dispatch copies  ${this.state.user_speech}`;
  //       // console.log('Phrase is '+ phrase);
  //       // this.setState({ scrollText: phrase, speakPhrases: phrase });
  //     };
  //     recognition.start();
      
  //   }
  // };

  handleKeyDown = event => {
    const { speakPhrases, recognition, isSpeaking, canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      event.preventDefault();
      if (!event.repeat) {
        console.log('Space');
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
    console.log('Key up is pressed');
    const { recognition, canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      setTimeout(() => {
        recognition.stop();
        this.setState({ recognition: null, isSpeaking: false});
        this.handleListenComplete();
      }, 1000);
    }
  };

  handleListenResponse = response => {
    console.log(`handleListenResponse(${response});`);
    const { speechRecognitionResult } = this.state;
    const newResult = `${speechRecognitionResult} ${response}`.trim();
    if(this.state.user_speech==null)
      this.setState({user_speech: ''});
    this.setState({ speechRecognitionResult: newResult, isSpeaking: false, user_speech: this.state.user_speech + newResult });
    console.log(this.state.user_speech);
  };

  handleListenComplete = () => {
    console.log('handle listen complete');
    const { speechRecognitionResult, step } = this.state;
    this.setState({
      transcript: speechRecognitionResult,
      speechRecognitionResult: '', STEP: this.state.STEP + 1 }, ()=>{
        this.speakUp();
      });
  };

  setupClient() {
    console.log('Inside Client');
    const client = new CognitiveSpeech.TTSClient(config.COGNITIVE_SPEECH_KEY);
    client.multipleXHR = false;
    this.setState({ client: client }, this.setupVoices);
  }
  getVoice(key) {
    const { voices } = this.state;
    const voice = voices.filter(item => item.id === key);
    return voice[0].voice;
  }

  handleVoicePlay = async () => {
      let step1_p2 = false;
      const { client } = this.state;
      const phrases = isArray(this.state.Speakspace)
        ? this.state.Speakspace
        : [this.state.Speakspace];
      const voiceString =  'enUS_Male';
      const voice = this.getVoice(voiceString);
      if(!(this.state.step1_chunk)) {
        console.log('step 1 called');
        step1_p2 = true;
        this.setState({step1_chunk: true});
      }
      client.synthesize(this.state.Speakspace, voice, ()=>{
        if(!step1_p2) {
          this.speakUp();
        }
        else{
          this.speakUp();
        }
        
      });
  };

  setupVoices() {
    const voices = [
      {
        id: 'enAU_Female',
        voice: CognitiveSpeech.SupportedLocales.enAU_Female
      },
      {
        id: 'enCA_Female',
        voice: CognitiveSpeech.SupportedLocales.enCA_Female
      },
      {
        id: 'enGB_Female',
        voice: CognitiveSpeech.SupportedLocales.enGB_Female
      },
      { id: 'enGB_Male', voice: CognitiveSpeech.SupportedLocales.enGB_Male },
      { id: 'enIN_Male', voice: CognitiveSpeech.SupportedLocales.enIN_Male },
      {
        id: 'enUS_Female',
        voice: CognitiveSpeech.SupportedLocales.enUS_Female
      },
      { id: 'enUS_Male', voice: CognitiveSpeech.SupportedLocales.enUS_Male }
    ];
    this.setState({ voices: voices }, this.handleVoicePlay);
  }

  speakUp() {
    if(this.state.STEP === 1){    //Calling units names
      const phrase = `Structure fire, ${this.state.alarms.alarm1} at ${this.state.evolution.street}.`;
      const phrase2 = `Repeating Structure fire, ${this.state.alarms.alarm1} at ${this.state.evolution.street}.`;
      if(!this.state.step1_chunk) {
        this.setState({Speakspace: phrase});
        this.setupClient();
      }
      if(this.state.step1_chunk && !(this.state.step1_pass)) {
        this.setState({Speakspace: phrase2, step1_pass: true});
        this.setupClient();
      }   
    }

    if(this.state.STEP === 2){    //Initial Radio Response
      console.log('=====================================STEP 2=====================================');
      this.setState({Speakspace: this.state.user_speech});
      this.setupClient();
    }

    if(this.state.STEP == 3){ //Initial & Secondary Sizeup Report;
      console.log('=====================================STEP 3=====================================')
    }
  }

  startSimulation = () => {
    this.speakUp();
  }

  render() {
    var {
      isLoadingEvolution,
      videos,
      isPlaying,
      isReady,
      currentVideo,
      scrollText,
      speakPhrases,
      speakVoice,
      speakTimeout
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    return (
       !isLoadingEvolution && (
        <div>
          
          {/* <Listen
            handleListenResponse={this.handleListenResponse}
          /> */}
          {/* {videos.map(video => (
            <video
              ref={this[video.id]}
              key={video.id}
              src={video.src}
              onPlay={this.handlePlay}
              onEnded={this.handleEnded(video.next)}
              onLoadedData={this.handleLoadedData(video.id)}
              onCanPlayThrough={this.handleCanPlayThrough}
              hidden
            />
          ))}
          <div className='canvas'>
            {!isPlaying && isReady && (
              <img
                src={playButton}
                onClick={this.handlePlayClicked}
                className='playButton'
                alt='Play Video'
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
          </div> */}
          <button onClick={this.startSimulation}>Start Simulation</button>
        </div>
      )
    );
  }
}

