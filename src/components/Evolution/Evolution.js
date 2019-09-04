import React, { Component } from 'react';
import { API } from 'aws-amplify';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
import TextCanvas from './TextCanvas/TextCanvas';
import './Evolution.css';
import playButton from './play.svg';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Speak from './Speak/Speak';
import ProcessSpeech from './ProcessSpeech/ProcessSpeech';
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
    isSpeaking: true,
    canTalk: true,
    videosLoaded: 0,
    preloadPercentage: 0,
    initialReportComplete: false,
    threeSixtyComplete: false,
    startArrival: false,
    arrivalsComplete: false,
    assignmentsComplete: false,
    faceToFaceRequestComplete: false,
    faceToFaceComplete: false,
    commadingUnitComplete: false,
    flag: true,
    assignmentCheck: 0,
    initialCheck: 0,
    finalJsonOutput: [],
    finalJsonOutputIndex: 0,
    parSpeech: [],
    parSpeechIndex: 0,
    groups: [],
    callingUnits: [],
    step4Index: 0,
    step4Speak: false,
    wait: false
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
            this.getVideos();
            await this.setupAlarms();
            this.setupIncidentCommander();
            await this.loadVariables();
            // this.setDispatchText();
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

  componentWillUnmount() {
    this.stopTimer();
  }

  loadVariables() {
    console.log('Load Variables');
    const groupNames = [
      'Fire Attack',
      'Exposure Group',
      'Ventilation Group',
      'RIC Group'
    ];
    const { groups, firstAlarm, callingUnits } = this.state;
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
      callingUnits[index].group = '';
    });
    this.setState({ groups: groups, callingUnits: callingUnits });
  }

  async setupAlarms() {
    try {
      const alarms = await this.getAlarms();
      let firstAlarm = alarms.alarm1.split(',').map(alarm => alarm.trim());
      let secondAlarm = alarms.alarm2.split(',').map(alarm => alarm.trim());
      firstAlarm.shift();
      const chief = firstAlarm.pop();
      this.setState(
        {
          alarms: alarms,
          firstAlarm: firstAlarm,
          secondAlarm: secondAlarm,
          chief: chief
        },
        () => {
          this.shuffleFirstAlarm();
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

  setupIncidentCommander() {
    const { evolution } = this.state;
    const street = evolution.street.replace(/[0-9]/g, '').trim();
    const incidentCommander = `${street} IC`;
    this.setState({ incidentCommander: incidentCommander });
  }

  getEvolution(id) {
    return API.get('comtac', `/evolutions/${id}`);
  }

  getAlarms() {
    return API.get('comtac', '/alarms');
  }

  getVideos = async () => {
    const { evolution } = this.state;
    const bucket = 'https://s3-us-west-2.amazonaws.com/ctt-video/';
    const fileType = '.mp4';
    const videos = [
      {
        id: 'intro',
        src: bucket + evolution.intro + fileType,
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
    const { videos } = this.state;
    videos.forEach(video => {
      this.preloadVideo(video);
    });
  }

  preloadVideo(video) {
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

  handlePlayClicked = () => {
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
    const { alarms, evolution } = this.state;
    const calls = [
      'Dispatch has received one call.',
      'Dispatch has received multiple calls.',
      'Caller states smoke in the building.',
      'Caller reports smoke in the area.',
      'Caller reports everyone is out of the structure.'
    ];
    const rand = Math.floor(Math.random() * (calls.length + 1));
    const simulationName = evolution.category.toLowerCase();
    let type = '';
    if (simulationName.includes('family')) {
      type = 'Residential';
    } else {
      type = 'Commercial';
    }
    const phrase = `${type} Structure fire, ${alarms.alarm1} at ${evolution.street}.`;
    const speakPhrase = [phrase, `Repeating. ${phrase}`, calls[rand]];
    const scrollText = [
      'Dispatch Information:',
      phrase,
      `Repeating. ${phrase}`
    ];
    this.setState({ scrollText: scrollText, speakPhrases: speakPhrase });
  }

  setEducationText() {
    const { alarms, evolution } = this.state;
    const phrases = education(evolution, alarms);
    this.setState({ scrollText: phrases, speakPhrases: phrases });
  }

  handleDispatchLoopComplete = () => {
    //this.setState({ isSpeaking: false });
    const dispatchLoop = this.dispatchLoop.current;
    const approach = this.approach.current;
    this.setState(
      {
        currentVideo: 'approach',
        scrollText: [],
        speakPhrases: [],
        canTalk: true
      },
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

  handleStep4Assignment = () => {
    // this.handleSpeechComplete();
    // this.setState({ isSpeaking: false });
  };

  handleStepUpdate = step => {
    this.setState({ step: step });
  };

  speakCallback = () => {
    this.setState({ isSpeaking: true });
  };

  handleSpeak = (phrases, voice = 'enUS_Male', timeout = 0) => {
    console.log('INSIDE HANDLESPEAK');
    this.setState({
      speakPhrases: phrases,
      speakVoice: voice,
      speakTimeout: timeout
    });
  };

  handleSpeechComplete = () => {
    console.log('handleSpeechComplete');
    const {
      step,
      assignmentCheck,
      startArrival,
      wait,
      threeSixtyComplete,
      arrivalsComplete,
      step4Index,
      firstAlarm
    } = this.state;
    let newStep = step;
    console.log('CURRENT STEP IS : ' + newStep);
    console.log('STEP 4 Index is ' + step4Index);
    this.setState({ isSpeaking: true });
    if (step < 4 && step !== 1) {
      console.log('if step is less than 4 and increment');
      newStep++;
    }
    if (step4Index > firstAlarm.length) {
      newStep++;
      console.log('STEP INCREMENT');
      this.setState({ step: newStep }, () => {
        console.log('State is set');
      });
    }
    console.log(step);
    if (newStep === 5) {
      console.log('Inside step 5');
      this.setState({ isSpeaking: true, arrivalsComplete: true });
      this.faceToFace();
    }

    if (!this.state.startArrival) {
      console.log('NOT START ARRIVAL');
      this.setState({ isSpeaking: true });
    }

    if (threeSixtyComplete && assignmentCheck && !arrivalsComplete && !wait) {
      console.log('FOR DECISION');
      this.setState({ isSpeaking: false });
    } else if (
      startArrival &&
      !assignmentCheck &&
      !wait &&
      !arrivalsComplete &&
      newStep !== 5
    ) {
      console.log('FOR ARRIVAL');
      if (newStep === 3) {
        this.setState({ step: 4 });
      }
      console.log('GOING TO CALL PROCESS ARRIVAL');
      this.processArrivals();
    }

    this.setState({ speakPhrases: [], step: newStep, transcript: '' });
  };

  processArrivals() {
    const {
      firstAlarm,
      step4Index,
      step,
      assignmentCheck,
      callingUnits
    } = this.state;
    if (assignmentCheck === 0) {
      const phrase = `${firstAlarm[step4Index]} staged and awaiting assignment.`;
      this.setState({ speakPhrases: phrase });
      setTimeout(() => {
        this.handleSpeak(phrase, 'enUS_Male', 5000);
        this.setState({
          // assignmentCheck: 1,
          step: step,
          transcript: '',
          wait: 1
        });
        // this.handleProcessSpeechComplete(updates);
      }, 500);
    }
  }

  faceToFace() {
    console.log('Insdei face to face');
    setTimeout(() => {
      const { chief } = this.state;
      const phrase = `${chief} requesting face to face`;
      this.handleSpeak(phrase);
    }, 5000);
  }

  handleListenComplete = () => {
    console.log('Handle Listen Complete');

    const { speechRecognitionResult, step } = this.state;
    if (step < 4) {
      this.setState(
        {
          transcript: speechRecognitionResult,
          speechRecognitionResult: '',
          speakPhrases: speechRecognitionResult
        },

        () => {
          console.log(this.state.transcript);
          this.setState({ isSpeaking: false });
        }
      );
    } else {
      this.setState({
        transcript: speechRecognitionResult,
        step4Speak: true,
        isSpeaking: false
      });
    }
    if (step === 1) {
      console.log('Step increment');
      this.handleStepUpdate(2);
    }
  };

  handleProcessSpeechComplete = updates => {
    if ('faceToFaceComplete' in updates) {
      this.setEducationText();
    }
    this.setState(updates);
    console.log(updates);
  };

  handleListenResponse = response => {
    // const { speechRecognitionResult } = this.state;
    // const newResult = `${speechRecognitionResult} ${response}`.trim();
    this.setState({
      speechRecognitionResult: response,
      // isSpeaking: false,
      step4Speak: false
    });
  };

  handleKeyDown = event => {
    const { speakPhrases, recognition, canTalk, step4Speak } = this.state;
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
            // console.log('HandleKeydown transcript is ' + results[0][0].transcript);
          };
          recognition.start();
          this.setState({
            recognition: recognition,
            isSpeaking: true,
            step4Speak: false
          });
        }
      }
      if (event.repeat && !step4Speak) {
        recognition.start();
        this.setState({
          isSpeaking: true,
          step4Speak: true
        });
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
      chief,
      incidentCommander,
      secondAlarm,
      step,
      transcript,
      isSpeaking,
      preloadPercentage,
      initialReportComplete,
      threeSixtyComplete,
      arrivalsComplete,
      startArrival,
      assignmentsComplete,
      faceToFaceRequestComplete,
      faceToFaceComplete,
      parSpeech,
      parSpeechIndex,
      callingUnits,
      step4Index,
      assignmentCheck,
      groups,
      wait,
      commadingUnitComplete
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    let processSpeechChildProps = {};
    if (alarms) {
      processSpeechChildProps = {
        initialReportComplete: initialReportComplete,
        threeSixtyComplete: threeSixtyComplete,
        arrivalsComplete: arrivalsComplete,
        startArrival: startArrival,
        assignmentsComplete: assignmentsComplete,
        faceToFaceRequestComplete: faceToFaceRequestComplete,
        faceToFaceComplete: faceToFaceComplete,
        firstAlarm: firstAlarm,
        chief: chief,
        alarms: alarms,
        dispatchCenter: alarms.dispatchCenter,
        transcript: transcript,
        incidentCommander: incidentCommander,
        secondAlarm: secondAlarm,
        parSpeech: parSpeech,
        parSpeechIndex: parSpeechIndex,
        callingUnits: callingUnits,
        step4Index: step4Index,
        assignmentCheck: assignmentCheck,
        groups: groups,
        handleSpeak: this.handleSpeak,
        handleProcessSpeechComplete: this.handleProcessSpeechComplete,
        handleStep4Assignment: this.handleStep4Assignment,
        step: step,
        wait: wait,
        commadingUnitComplete: commadingUnitComplete
      };
    }

    return (
      !isLoadingEvolution && (
        <div>
          {speakPhrases.length > 0 && (
            <Speak
              phrases={speakPhrases}
              voice={speakVoice}
              timeout={speakTimeout}
              handleSpeechComplete={this.handleSpeechComplete}
              step={step}
              assignmentCheck={assignmentCheck}
              speakCallback={this.speakCallback}
            />
          )}
          {(transcript !== '' || step >= 1) && !isSpeaking && (
            <ProcessSpeech childProps={processSpeechChildProps} />
          )}
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
