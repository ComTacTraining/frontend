import React, { Component } from "react";
import "./TextCanvas.css";

class TextCanvas extends Component {
  render() {
    return (
      <canvas ref="textCanvas" className="textCanvas"></canvas>
    );
  }
}

export default TextCanvas;