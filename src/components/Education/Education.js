import React, { Component } from "react";
import axios from "../../axios";
import videojs from "video.js";
import Captions from '../Captions/Captions';
import "videojs-playlist";
import "./videojs-caption"
import "video.js/dist/video-js.css";
import "videojs-caption/dist/videojs.caption.css";
import "../VideoPlayer/VideoPlayer.css";

class Education extends Component {
  state = {
    evolution: null,
  };

  componentDidMount() {
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
    const {evolution} = this.state;
    const captions = new Captions(evolution);
    const options = {
      autoplay: false,
      controls: true,
      textTrackSettings: false
    };
    this.player = videojs(this.videoNode, options, () => {});
    /*this.player.playlist([
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      },
      {
        name: "Background",
        sources: [{ src: 'https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4', type: "video/mp4" }]
      }
    ]);
    this.player.playlist.autoadvance(0);*/
    //this.player.src('https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4');
    this.player.src('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4');
    this.player.muted(true);
    this.player.caption({
      data: captions.getCaptions(),
      setting: {
        captionSize: 6,
        captionStyle: {
          'background-color': "rgba(255,255,255,0.8)",
          'color': "rgba(134,53,44,1)",
          'padding': "3px",
          'font-family': "'Anton', sans-serif",
          'text-transform': 'uppercase'
        },
        captionType: 'roll-up'
      }
    });
  };

  

  render() {
    return (
      <div className="video-js-container">
        <div data-vjs-player>
          <video
            ref={node => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-16-9" />
        </div>
        <div className="vjs-playlist" />
      </div>
    );
  }
}

export default Education;
