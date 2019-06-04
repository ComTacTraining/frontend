import React, { Component } from "react";
import axios from "../../axios";
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
//import { createSpeechRecognitionPonyfill } from 'web-speech-cognitive-services/lib/SpeechServices/SpeechToText';
//import SayButton from 'react-say';
//import DictateButton from 'react-dictate-button';

import videojs from "video.js";
import "videojs-playlist";
import "videojs-playlist-ui";
import "videojs-contextmenu-ui";
import "videojs-overlay";
//import Record from "videojs-record";

//import "webrtc-adapter";
//import RecordRTC from "recordrtc";

import "video.js/dist/video-js.css";
import "videojs-playlist-ui/dist/videojs-playlist-ui.vertical.css";
import "videojs-contextmenu-ui/dist/videojs-contextmenu-ui.css";
import "videojs-overlay/dist/videojs-overlay.css";
//import "videojs-record/dist/css/videojs.record.css";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  state = {
    evolution: null,
    playlist: [],
    authorizationToken: '',
    dictate: '',
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.match.params.id) {
      if (
        !this.state.evolution ||
        (this.state.evolution &&
          this.state.evolution.evolutionId !== this.props.match.params.id)
      ) {
        axios
          .get("/evolutions/" + this.props.match.params.id)
          .then(response => {
            this.setState({ evolution: response.data });
            
          });
      }
    }
    const authToken = this.authorizationToken;
    const tokenPromise = new Promise(function(resolve, reject) {
        if (!authToken) {
            axios.post("/speech")
                .then(response => {
                    resolve(response.data);
                });
        } else {
            resolve(this.authorizationToken);
        }
    });

    tokenPromise.then(token => {
        this.setState({ authorizationToken: token });
        /*const speechRecognitionPromise = createSpeechRecognitionPonyfill({
          authorizationToken: token,
          region: 'westus',
        });
        speechRecognitionPromise.then(SpeechRecognition => {
          const recognition = new SpeechRecognition();
          this.setState({ recognition: recognition});
        });*/
        const ponyfillPromise = createPonyfill({
            authorizationToken: token,
            region: 'westus',
        });
        ponyfillPromise.then(ponyfill => {
            //console.log(ponyfill);
            this.setState({ ponyfill: ponyfill });
            this.initPlayer();
            //this.setState(() => ({ ponyfill }));
        });
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  initPlayer = () => {
    // const options = this.props;
    const options = {
      autoplay: false,
      controls: true,
      textTrackSettings: false
    };
    
    this.player = videojs(this.videoNode, options, () => {});
    this.player.playlistUi();
    //this.addPlayerContextMenu();
    this.addPlayerRecordButton();
    //this.addPlayerClosedCaptions();
    const playlist = this.getPlaylist();
    console.log(playlist);
    this.player.playlist(playlist);
    this.player.playlist.autoadvance(0);
    this.player.on("deviceReady", () => {
      console.log("device is ready!");
    });

    this.player.on("startRecord", () => {
      console.log("started recording!");
    });

    this.player.on("finishRecord", () => {
      console.log("finished recording: ", this.player.recordedData);
    });

    this.player.on("error", error => {
      console.warn(error);
    });
  };

  addPlayerContextMenu = () => {
    this.player.contextmenuUI({
      content: [
        {
          href: "https://comtactraining.com",
          label: "Command Tactical Training"
        },
        {
          label: "Next Video",
          listener: function() {
            alert("Redirecting to next video...");
          }
        },
        {
          label: "Log out",
          listener: function() {
            alert("Signing you out of your comtac account.");
          }
        }
      ]
    });
  };

  addPlayerRecordButton = () => {
    //const { recognition } = this.state;
    const { ponyfill } = this.state;
    const recognition = new ponyfill.SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = ({ dictate }) => {
      console.log(dictate);
      this.setState({ dictate: dictate });
    };
    const btnClass = videojs.getComponent("Button");
    const recordBtn = videojs.extend(btnClass, {
      constructor: function() {
        //btnClass.call(this, this.player);
        btnClass.apply(this, arguments);
        this.addClass("vjs-icon-circle");
        this.on(['mousedown', 'touchstart'], this.handleMouseDown);
        this.on(['mouseup', 'touchend'], this.handleMouseUp);
      },
      handleMouseDown: function() {
        console.log("Recording start...");
        recognition.start();
      },
      handleMouseUp: function() {
        console.log("Recording stopped...");
        recognition.stop();
      }
    });

    videojs.registerComponent("recordBtn", recordBtn);

    const recordBtnInstance = this.player.controlBar.addChild(new recordBtn());
    recordBtnInstance.addClass("vjs-record-control");
  };

  addPlayerClosedCaptions = () => {
    /*this.player.addTextTrack(
      "subtitles",
      "WEBVTT\n00:00:00.000 --> 00:00:00.500\n\n00:00:02.000 --> 00:00:05.900\nThis is example of video captions.\n\n00:00:07.045 --> 00:00:12.900\nCaptions (subtitles) can be supplied with XML file in Web Video Text Track (VTT) format."
    );*/
    const track = this.player.addRemoteTextTrack({src: 'subtitle.vtt'}, false);
    track.addEventListener('load', function() {
      //textTrackSettings: false
    });
  };

  getPlaylist = () => {
    const { evolution } = this.state;

    const bucketDomain = 'https://s3-us-west-2.amazonaws.com/ctt-video/';
    const fileType = '.mp4';

    const dispatcherIntro = bucketDomain + "CTT+Dispatch+with+Label.mp4";
    const dispatcherLoop = bucketDomain + "CTT+Dispatch+no+Tag.mp4";
    const credits = bucketDomain + "Credits.mp4";
    const playlist = [
      {
        name: "Intro",
        sources: [{ src: bucketDomain + evolution.intro + fileType, type: "video/mp4" }]
      },
      {
        name: "Dispatcher Intro",
        sources: [{ src: dispatcherIntro, type: "video/mp4" }]
      },
      {
        name: "Dispatcher Loop",
        sources: [{ src: dispatcherLoop, type: "video/mp4" }]
      },
      {
        name: "Approach",
        sources: [{ src: bucketDomain + evolution.approach + fileType, type: "video/mp4" }]
      },
      {
        name: "Alpha (No Title)",
        sources: [{ src: bucketDomain + evolution.loop + fileType, type: "video/mp4" }]
      },
      {
        name: "Bravo",
        sources: [{ src: bucketDomain + evolution.bravo + fileType, type: "video/mp4" }]
      },
      {
        name: "Charlie",
        sources: [{ src: bucketDomain + evolution.charlie + fileType, type: "video/mp4" }]
      },
      {
        name: "Delta",
        sources: [{ src: bucketDomain + evolution.delta + fileType, type: "video/mp4" }]
      },
      {
        name: "Alpha (Title)",
        sources: [{ src: bucketDomain + evolution.alpha + fileType, type: "video/mp4" }]
      },
      {
        name: "Loop",
        sources: [{ src: bucketDomain + evolution.loop + fileType, type: "video/mp4" }]
      },
      { name: "Credits", sources: [{ src: credits, type: "video/mp4" }] }
    ];
    return playlist;
  };

  render() {
    const {dictate} = this.state;
    return (
      <div className="video-js-container">
        <div>{dictate}</div>
        <div data-vjs-player>
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-16-9" />
          {/* <track kind="captions" src="subtitle.vtt" srcLang="en" label="English" default/> */}
        </div>
        <div className="vjs-playlist" />
      </div>
    );
  }
}

export default VideoPlayer;
