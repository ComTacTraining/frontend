import React, { Component } from "react";
import "./VideoCanvas.css";

class VideoCanvas extends Component {
  render() {
    return (
      <canvas ref="videoCanvas" className="videoCanvas"></canvas>
    );
  }
}

export default VideoCanvas;