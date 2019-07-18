import React, { Component } from "react";
import axios from "../../axios";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerSample.css";

class PlayerSample extends Component {
  state = {
    currentVideo: 0,
    videos: []
  };

  componentDidMount() {
    this.getVideos();
    //this.initPlayer();
  }

  async getVideos() {
    this.getVideo('https://s3-us-west-2.amazonaws.com/ctt-video/CTT Intros/CM/Commercial Modern 31.mp4');
    //this.getVideo('https://s3-us-west-2.amazonaws.com/ctt-video/CTT Dispatch with Label.mp4');
    this.initPlayer();
  }

  getVideo = (url) => {
    console.log("Fetching video: " + url);
    axios
      .get(url)
      .then(response => {
        const videos = this.state.videos;
        videos.push(response.data);
        this.setState({ videos: videos });
        if (vid == 0) {
          this.player.src({
            type: "video/mp4",
            src: response.data
          });
        }
      });
    
    /*var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function() {
      
      if (this.status === 200) {
        var blob = this.response;
        var vid = URL.createObjectURL(blob);
        const videos = this.state.videos;
        videos.push(vid);
        this.setState({ videos: videos });
      }
    }*/
  };

  initPlayer = () => {
    const { videos, currentVideo } = this.state;
    // const options = this.props;
    /*const options = {
      autoplay: true,
      controls: true,
    };*/

    /*const videos = [
      "https://s3-us-west-2.amazonaws.com/ctt-video/CTT Intros/CM/Commercial Modern 31.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+with+Label.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/CTT+Dispatch+no+Tag.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Approaches/Approach 6.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31A.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31B.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31C.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31D.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31A w tag.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Commercial Modern/CTT CM 31/CM 31A.mp4",
      "https://s3-us-west-2.amazonaws.com/ctt-video/Credits.mp4"
    ];*/

    this.player = videojs(this.videoPlayer, {
        autoplay: false,
        controls: true
      }, () => {});
    
    /*this.player.src = {
      type: "video/mp4",
      src: videos[0]
    }*/

    this.player.on('ended', () => {
      const curr = currentVideo + 1;
      this.player.src = {
        type: "video/mp4",
        src: videos[curr]
      }
    })
    
    /*this.player0.on('ended', () => {
      //this.player0.dispose();
      alert('Player 0 ended');
      this.setState({currentVideo: 1});
      this.player1.play();
    });

    this.player1 = videojs(this.refs.video1, {
        autoplay: false,
        controls: true,
        preload: 'auto',
        sources: [{
          src: videos[1],
          type: "video/mp4"
        }]
      }, () => {
    });*/
  };

  render() {
    //const { videos } = this.state;
    /*var vid0 = "hidden";
    var vid1 = "hidden";
    //var vid0 = '';
    //var vid1 = '';

    switch(currentVideo) {
      case 0: vid0 = ''; alert("vid 0 shown"); break;
      case 1: vid1 = ''; alert("vid 1 shown"); break;
      default: break;
    }*/

    return (
      <div className="video-js-container">
        <div data-vjs-player>
          <video
            ref={node => (this.videoPlayer = node)}
            className="video-js vjs-default-skin vjs-16-9" />
          {/*<video
            //ref={node => (this.video1 = node)}
            ref="video1"
          className={"video-js vjs-default-skin vjs-16-9 " + vid1} />*/}
        </div>
      </div>
    );
  }
}

export default PlayerSample;
