import React, { Component } from 'react';
import { API } from 'aws-amplify';
//import Videos from './Videos/Videos';
//import VideoCanvas from './VideoCanvas/VideoCanvas';
import TextCanvas from './TextCanvas/TextCanvas';
import './Evolution.css';
import playButton from './play.svg';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ProcessSpeech from './ProcessSpeech/ProcessSpeech';
import { education } from './Education/Education';
import SpeechToText from './SpeechToText/SpeechToText';
import TextToSpeech from './TextToSpeech/TextToSpeech';
// import TextToInterpret from './TextToInterpret/TextToInterpret';
import Evaluation from './Evaluation/Evaluation';

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
    speakVoice: 'Kendra',
    speakTimeout: 0,
    step: 1,
    transcript: '',
    recognition: null,
    speechRecognitionResult: '',
    isSpeaking: true,
    canTalk: false,
    videosLoaded: 0,
    preloadPercentage: 0,
    initialSpeech: '',
    secondarySpeech: '',
    //STEPS
    dispatchInfoComplete: false, //Step 1
    initialReportComplete: false, //Step 2
    threeSixtyComplete: false, //Step 3
    startArrival: false, //Step 4 Starting
    arrivalsComplete: false, //Step 4 Complete
    assignmentsComplete: false, //Step 4 Complete
    faceToFaceRequestComplete: false, //Step 5 Request
    faceToFaceComplete: false, //Step 5 Complete
    commandingUnitRequest: false, //Step 6 Request
    commandingUnitComplete: false, //Step 6 Complete
    educationRequest: false, //Step 7 Request
    educationComplete: false, //Step 7 Complete
    evaluationComplete: false,

    flag: true,
    assignmentCheck: 0,
    initialCheck: 0,
    finalJsonOutput: [],
    finalJsonOutputIndex: 0,
    parSpeech: '',
    groups: [],
    callingUnits: [],
    step4Index: 0,
    step4Speak: false,
    wait: false,
    initialMatched: [], //QUESTION 1-8
    secondaryMatched: [], //QUESTION 9-12
    processArrivalMatched: [], //QUESTION 18
    slicerMatched: [], //QUESTION 14
    rectoMatched: [], //QUESTION 15
    commandingUnitMatched: [], //QUESTION 17,19
    isEvaluation: false,
    alarmTwoIncident: false,
    incidentReportRequest: false,
    isRecording: false,
    endRecording: false,
    evaluationPage: false
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
    if (this.props.match.params.id) {
      try {
        const evolution = await this.getEvolution(this.props.match.params.id);
        this.setState(
          { evolution: evolution, isLoadingEvolution: false },
          async () => {
            this.getVideos();
            await this.setupAlarms();
            await this.loadVariables();
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

  componentWillUnmount() {
    this.stopTimer();
  }

  async loadVariables() {
    const groupNames = [
      'Fire Attack',
      'Exposure Group',
      'Ventilation Group',
      'RIC Group'
    ];
    const {
      groups,
      firstAlarm,
      callingUnits,
      initialMatched,
      secondaryMatched,
      slicerMatched,
      rectoMatched,
      commandingUnitMatched,
      processArrivalMatched
    } = this.state;

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
      callingUnits[index].voice = this.assignRandomVoices(8); //8 because we have 8 voices
    });
    /////////////////EVALUATION VARIABLES/////////////////
    for (var i = 0; i < 8; i++) {
      initialMatched[i] = {};
      initialMatched[i].matched = 0;
      initialMatched[i].matchKeyword = '';
    }

    for (i = 0; i < 4; i++) {
      secondaryMatched[i] = {};
      secondaryMatched[i].matched = 0;
      secondaryMatched[i].matchKeyword = '';
    }

    for (i = 0; i <= 6; i++) {
      slicerMatched[i] = {};
      slicerMatched[i].matched = 0;
      slicerMatched[i].matchKeyword = '';

      rectoMatched[i] = {};
      rectoMatched[i].matched = 0;
      rectoMatched[i].matchKeyword = '';
    } //Initialize SLICER and RECTO-VS array

    for (i = 0; i <= 1; i++) {
      commandingUnitMatched[i] = {};
      commandingUnitMatched[i].matched = 0;
      commandingUnitMatched[i].matchKeyword = '';
    }

    processArrivalMatched[0] = {};
    processArrivalMatched[0].matched = 0;
    processArrivalMatched[0].matchKeyword = '';
    /////////////////EVALUATION VARIABLES/////////////////

    this.setState({
      groups: groups,
      callingUnits: callingUnits,
      secondaryMatched: secondaryMatched,
      initialMatched: initialMatched,
      slicerMatched: slicerMatched,
      rectoMatched: rectoMatched,
      commandingUnitMatched: commandingUnitMatched
    });
  }

  assignRandomVoices = max => {
    const voices = [
      'Salli',
      'Joanna',
      'Ivy',
      'Kendra',
      'Kimberly',
      'Matthew',
      'Justin',
      'Joey'
    ];

    const random = Math.floor(Math.random() * Math.floor(max));
    return voices[random];
  };

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
    console.log('HandleEnded()');
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
    console.log('setEducationText()');
    const { alarms, evolution, educationRequest } = this.state;
    const phrases = education(evolution, alarms);
    var educationPhrase = '';
    phrases.forEach(item => {
      educationPhrase += item;
    });

    if (!educationRequest) {
      console.log('1st Chunk');
      console.log(this.state.speakPhrases);
      console.log(educationPhrase.substring(0, 200));
      setTimeout(() => {
        this.setState({
          educationRequest: true,
          scrollText: educationPhrase,
          speakPhrases: educationPhrase.substring(0, 200)
        }); //0, 2934
      }, 1500);
    } else {
      setTimeout(() => {
        this.setState({
          educationComplete: true,
          speakPhrases: educationPhrase.substring(201, 400)
        }); //2935, 5590
      }, 1000);
    }
  }

  handleDispatchLoopComplete = () => {
    console.log('handleDispatchLoopComplete()');
    const dispatchLoop = this.dispatchLoop.current;
    const approach = this.approach.current;
    this.setState(
      {
        currentVideo: 'approach',
        scrollText: [],
        speakPhrases: [],
        canTalk: true,
        dispatchInfoComplete: true
      },
      () => {
        this.stopTimer();
        dispatchLoop.pause();
        approach.play();
      }
    );
  };

  handleAlphaLoopComplete = () => {
    console.log('handleAlphaLoopComplete()');
    const alphaLoop = this.alphaLoop.current;
    const credits = this.credits.current;
    this.setState({ currentVideo: 'credits', scrollText: [] }, () => {
      this.stopTimer();
      alphaLoop.pause();
      credits.play();
    });
  };

  handleSpeak = (phrases, voice, timeout = 0) => {
    console.log('handleSpeak()');
    this.setState({
      speakPhrases: phrases,
      speakVoice: voice,
      speakTimeout: timeout
    });
  };

  handleSpeechComplete = () => {
    console.log('handleSpeechComplete()');
    const {
      step,
      assignmentCheck,
      startArrival,
      wait,
      threeSixtyComplete,
      step4Index,
      firstAlarm,
      dispatchInfoComplete,
      commandingUnitComplete,
      educationRequest,
      faceToFaceComplete,
      commandingUnitRequest,
      educationComplete,
      evaluationComplete
    } = this.state;
    let arrivalsComplete = this.state.arrivalsComplete;

    let newStep = step;
    this.setState({ isSpeaking: true });

    // FOR STEP 1,2,3
    if (!startArrival && dispatchInfoComplete) {
      //Increment the step if step is less than 4 and not 1
      newStep++;
    }

    // For Step less than 4
    if (!startArrival) {
      this.setState({ isSpeaking: true });
    }

    // When Step 4 is Completed
    if (step4Index >= firstAlarm.length && !arrivalsComplete) {
      newStep = 5;
      arrivalsComplete = true;
      this.setState({ step: newStep, arrivalsComplete: true });
    }

    // For Step 4
    if (threeSixtyComplete && assignmentCheck && !arrivalsComplete && !wait) {
      // For Calling Decision Function
      this.setState({ isSpeaking: false });
    } else if (startArrival && !arrivalsComplete && !assignmentCheck && !wait) {
      console.log('GOING TO CALL PROCESS ARRIVAL');
      newStep = 4;
      this.processArrivals();
    }

    // For Step 5
    if (arrivalsComplete && !faceToFaceComplete) {
      newStep = 6;
      this.setState({ isSpeaking: true, step: 6 });
      this.faceToFace();
    }
    console.log('New step is ' + newStep);
    // For Step 6 : Commanding Unit Report
    if (faceToFaceComplete && !commandingUnitRequest) {
      this.setState({ canTalk: true, commandingUnitRequest: true });
    }

    if (commandingUnitRequest && !commandingUnitComplete) {
      newStep = 7;
      this.setState({ isSpeaking: false });
    }

    // When Dispatch Info is Completed
    if (dispatchInfoComplete && !commandingUnitComplete) {
      console.log('When Dispatch Info is Completed');
      this.setState({ canTalk: true });
    }

    // For Step 7 2nd Chunk
    if (commandingUnitComplete && educationRequest && !educationComplete) {
      console.log('For Step 7 2nd Chunk');
      this.setEducationText();
    }

    // For Step 8 : Evaluation
    if (educationComplete && !evaluationComplete) {
      console.log('For Step 8 : Evaluation');
      this.setState({ evaluationComplete: true, evaluationPage: true});
    }

    this.setState({ speakPhrases: [], step: newStep, transcript: '' }, () => {
      console.log('=========STEP ' + this.state.step + ' ==========');
    });
  };

  incidentWithinIncident() {
    setTimeout(() => {
      var phrase =
        'Command from (unit on the interior) we have an excessive amount of ammunition discharging Hall around us we are evacuating';
      this.handleSpeak(phrase);
    }, 30000);
  }

  processArrivals() {
    const {
      firstAlarm,
      step4Index,
      assignmentCheck,
      callingUnits
    } = this.state;
    if (assignmentCheck === 0) {
      const phrase = `${firstAlarm[step4Index]} staged and awaiting assignment.`;
      //this.setState({ speakPhrases: phrase });
      setTimeout(() => {
        this.handleSpeak(phrase, callingUnits[step4Index].voice, 5000);
        this.setState({
          // assignmentCheck: 1,
          transcript: '',
          wait: 1
        });
        // this.handleProcessSpeechComplete(updates);
      }, 500);
    }
  }

  faceToFace() {
    const { chief } = this.state;
    setTimeout(() => {
      const phrase = `${chief} requesting face to face`;
      this.handleSpeak(phrase);
      this.setState({ faceToFaceComplete: true });
    }, 1500);
  }

  handleListenComplete = transcript => {
    transcript = transcript.split('.').join(". ");
    console.log('handleListenComplete()');
    console.log('--TRANSCRIPT--' + transcript);
    const {
      startArrival,
      commandingUnitComplete,
      incidentReportRequest
    } = this.state;

    this.setState({
      isRecording: false,
      endRecording: false
    });
    if (!startArrival) {
      this.setState(
        { transcript: transcript, speakPhrases: transcript },
        () => {
          this.setState({ isSpeaking: false });
        }
      );
    } else if (incidentReportRequest) {
      this.setState({ incidentReportRequest: false });
    } else if (!commandingUnitComplete) {
      this.setState({
        transcript: transcript,
        step4Speak: true,
        isSpeaking: false
      });
    }
  };

  handleProcessSpeechComplete = updates => {
    //const { alarmTwoIncident } = this.state;
    console.log('handleProcessSpeechComplete()');
    if (updates.commandingUnitComplete) {
      this.setEducationText();
    }
    this.setState(updates);
    this.setState({ isEvaluation: true }, () => {
      if (this.state.alarmTwoIncident) {
        this.incidentWithinIncident();
        this.setState({
          alarmTwoIncident: false,
          incidentReportRequest: true,
          canTalk: false
        });
      }
    });
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
    const { canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      event.preventDefault();
      if (!event.repeat) {
        this.setState({ isRecording: true });
      }
    }
  };

  handleKeyUp = event => {
    const { canTalk } = this.state;
    if (event.code === 'Space' && canTalk) {
      event.preventDefault();
      if (!event.repeat) {
        this.setState({ endRecording: true, canTalk: false });
      }
    }
  };

  handleEvaluationComplete = updates => {
    this.setState({ isEvaluation: false });
    this.setState({ updates });
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
      commandingUnitComplete,
      parSpeech,
      callingUnits,
      step4Index,
      assignmentCheck,
      groups,
      wait,
      //Evaluation
      initialMatched,
      secondaryMatched,
      slicerMatched,
      rectoMatched,
      processArrivalMatched,
      commandingUnitMatched,

      alarmTwoIncident,
      isRecording,
      endRecording,

      evaluationPage,
      initialSpeech,
      secondarySpeech,

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
        commandingUnitComplete: commandingUnitComplete,

        firstAlarm: firstAlarm,
        chief: chief,
        alarms: alarms,
        dispatchCenter: alarms.dispatchCenter,
        transcript: transcript,
        incidentCommander: incidentCommander,
        secondAlarm: secondAlarm,
        parSpeech: parSpeech,
        callingUnits: callingUnits,
        step4Index: step4Index,
        assignmentCheck: assignmentCheck,
        groups: groups,
        handleSpeak: this.handleSpeak,
        handleProcessSpeechComplete: this.handleProcessSpeechComplete,
        handleEvaluationComplete: this.handleEvaluationComplete,
        incidentWithinIncident: this.incidentWithinIncident,
        step: step,
        wait: wait,
        alarmTwoIncident: alarmTwoIncident,

        //Evaluation Variables
        initialMatched: { initialMatched },
        secondaryMatched: { secondaryMatched },
        processArrivalMatched: { processArrivalMatched },
        slicerMatched: { slicerMatched },
        rectoMatched: { rectoMatched },
        commandingUnitMatched: { commandingUnitMatched },
        initialSpeech: { initialSpeech },
        secondarySpeech: { secondarySpeech },
      };
    }
    return (
      !isLoadingEvolution && (
        <div>
          {evaluationPage && (
            <Evaluation 
              initialSpeech ={initialSpeech}
              secondarySpeech = {secondarySpeech}
              initialMatched = { initialMatched }
              secondaryMatched = { secondaryMatched }
              processArrivalMatched = { processArrivalMatched }
              slicerMatched = { slicerMatched }
              rectoMatched = { rectoMatched }
              commandingUnitMatched = {commandingUnitMatched}
              parSpeech = {parSpeech}
            />
          )}
          
          {speakPhrases.length > 0 && (
            <TextToSpeech
              phrases={speakPhrases}
              voiceId={speakVoice}
              timeout={speakTimeout}
              handleSpeechComplete={this.handleSpeechComplete}
            />
          )}
          <SpeechToText
            isRecording={isRecording}
            endRecording={endRecording}
            handleListenComplete={this.handleListenComplete}
          />
          {/* {transcript !== '' && <TextToInterpret transcript={transcript} />} */}
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
