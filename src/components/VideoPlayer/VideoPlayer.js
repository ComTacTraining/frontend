import React, { Component } from "react";
import axios from "../../axios";

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
    playlist: []
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
            this.initPlayer();
          });
      }
    }
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
      controls: true
    };
    this.player = videojs(this.videoNode, options, () => {});
    this.player.playlistUi();
    this.addPlayerOverlay();
    this.addPlayerContextMenu();
    this.addPlayerRecordButton();
    //this.addPlayerClosedCaptions();
    this.player.playlist(this.getPlaylist());
    this.player.playlist.autoadvance(0);
  };

  addPlayerOverlay = () => {
    this.player.overlay({
      overlays: [
        {
          start: "playing",
          end: "pause",
          content: "Microphone recording..."
        },
        {
          start: "pause",
          end: "play",
          content: "Microphone paused..."
        }
      ]
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
    const btnClass = videojs.getComponent("Button");
    const recordBtn = videojs.extend(btnClass, {
      constructor: function() {
        //btnClass.call(this, this.player);
        btnClass.apply(this, arguments);
        this.addClass("vjs-icon-circle");
      },
      handleClick: function() {
        alert("Recording start...");
      }
    });

    videojs.registerComponent("recordBtn", recordBtn);

    const recordBtnInstance = this.player.controlBar.addChild(new recordBtn());
    recordBtnInstance.addClass("vjs-record-control");

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

  addPlayerClosedCaptions = () => {
    this.player.addTextTrack(
      "subtitles",
      "WEBVTT\n001\n00:00:00.010 --> 00:00:08.150\n( <i>Mozart's Marriage of Figaro</i>\n<i>orchestral arrangement</i> )\n\n2\n00:00:08.150 --> 00:00:11.200\nINSTRUCTOR:\nPut the B-line right there\nover your shoulder."
    );
  };

  getPlaylist = () => {
    const { evolution } = this.state;

    const dispatcherIntro =
      "https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+with+Label.mp4";
    const dispatcherLoop =
      "https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4";
    const credits = "https://s3-us-west-2.amazonaws.com/ctt-video/Credits.mp4";
    const playlist = [
      {
        name: "Intro",
        sources: [{ src: evolution.intro, type: "video/mp4" }]
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
        sources: [{ src: evolution.approach, type: "video/mp4" }]
      },
      {
        name: "Alpha",
        sources: [{ src: evolution.alpha, type: "video/mp4" }]
      },
      {
        name: "Bravo",
        sources: [{ src: evolution.bravo, type: "video/mp4" }]
      },
      {
        name: "Charlie",
        sources: [{ src: evolution.charlie, type: "video/mp4" }]
      },
      {
        name: "Delta",
        sources: [{ src: evolution.delta, type: "video/mp4" }]
      },
      {
        name: "Loop",
        sources: [{ src: evolution.alpha, type: "video/mp4" }]
      },
      { name: "Credits", sources: [{ src: credits, type: "video/mp4" }] }
    ];
    return playlist;
  };

  render() {
    return (
      <div className="video-js-container">
        <div data-vjs-player>
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-16-9"
          />
        </div>
        <div className="vjs-playlist" />
      </div>
    );
  }
}

export default VideoPlayer;
