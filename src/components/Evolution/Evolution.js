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
    chief: '',
    incidentCommander: '',
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
    initialReportComplete: false,
    threeSixtyComplete: false,
    faceToFaceComplete: false
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
          () => {
            this.getVideos();
            this.setupAlarms();
            this.setupIncidentCommander();
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
      firstAlarm.shift();
      const chief = firstAlarm.pop();
      this.setState(
        { alarms: alarms, firstAlarm: firstAlarm, chief: chief },
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

  componentWillUnmount() {
    this.stopTimer();
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

    const phrase = `Structure fire, ${alarms.alarm1} at ${evolution.street}.`;
    const scrollText = [
      'Dispatch Information:',
      phrase,
      `Repeating. ${phrase}`,
      calls[rand]
    ];
    const speakPhrases = [phrase, `Repeating. ${phrase}`, calls[rand]];
    this.setState({ scrollText: scrollText, speakPhrases: speakPhrases });
  }

  setEducationText() {
    const { alarms, evolution } = this.state;
    const phrases = education(evolution, alarms);
    this.setState({ scrollText: phrases, speakPhrases: phrases });
  }

  processArrivals() {
    const { firstAlarm } = this.props.childProps;
    const phrase = `${firstAlarm[0]} staged and awaiting assignment.`;
    this.props.childProps.handleSpeak(phrase, 'enUS_Female', 5000);
  }

  handleDispatchLoopComplete = () => {
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

  handleSpeak = (phrases, voice = 'enUS_Male', timeout = 0) => {
    this.setState({
      speakPhrases: phrases,
      speakVoice: voice,
      speakTimeout: timeout
    });
  };

  handleSpeechComplete = () => {
    const { step } = this.state;
    let newStep = step;
    if (step < 3) {
      newStep++;
    }
    this.setState({ speakPhrases: [], step: newStep });
  };

  handleListenComplete = () => {
    const { speechRecognitionResult, step } = this.state;
    this.setState({
      transcript: speechRecognitionResult,
      speechRecognitionResult: ''
    });
    if (step === 0) {
      this.handleStepUpdate(1);
    }
  };

  handleProcessSpeechComplete = updates => {
    if ('faceToFaceComplete' in updates) {
      this.setEducationText();
    }
    this.setState(updates);
  };

  handleListenResponse = response => {
    console.log(response);
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
      incidentCommander,
      transcript,
      isSpeaking,
      preloadPercentage,
      initialReportComplete,
      threeSixtyComplete
    } = this.state;
    let handleCallback = this.handleDispatchLoopComplete;
    if (currentVideo === 'alphaLoop') {
      handleCallback = this.handleAlphaLoopComplete;
    }
    let processSpeechChildProps = {};
    if (alarms) {
      processSpeechChildProps = {
        initialReportComplete,
        threeSixtyComplete,
        firstAlarm: firstAlarm,
        alarms: alarms,
        dispatchCenter: alarms.dispatchCenter,
        transcript: transcript,
        incidentCommander: incidentCommander,
        handleSpeak: this.handleSpeak,
        handleProcessSpeechComplete: this.handleProcessSpeechComplete
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
            />
          )}
          {transcript !== '' && !isSpeaking && alarms !== null && (
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
