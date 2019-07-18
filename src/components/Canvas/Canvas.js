import React, { Component } from 'react';
import axios from '../../axios';
//import Videos from './Videos/Videos';
//import VideoCanvas from './VideoCanvas/VideoCanvas';
//import TextCanvas from './TextCanvas/TextCanvas';
import './Canvas.css';
import playButton from './play.svg';

class Canvas extends Component {
  state = {
    evolution: null,
    videos: [],
    timerId: null,
    isPlaying: false,
    isReady: false,
    preloadedVideoCount: 0
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
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      if (
        !this.state.evolution ||
        (this.state.evolution &&
          this.state.evolution.evolutionId !== this.props.match.params.id)
      ) {
        axios
          .get('/evolutions/' + this.props.match.params.id)
          .then(response => {
            this.setState({ evolution: response.data });
            this.getVideos();
          });
      }
    }
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
        src: bucket + 'CTT Dispatch no Label' + fileType,
        next: 'approach'
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
    this.setState({ videos: videos });
  };

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
    const video = this[next].current;
    this.stopTimer();
    video.play();
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

  render() {
    const { videos, isPlaying, isReady } = this.state;

    return (
      <div>
        {videos.map(video => (
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
          {/*<TextCanvas />*/}
          <canvas
            id='videoCanvas'
            ref={this.videoCanvas}
            width='800'
            height='450'
            onClick={this.handlePlayClicked}
          />
        </div>
      </div>
    );
  }
}

export default Canvas;
