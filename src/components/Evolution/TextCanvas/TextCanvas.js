import React, { Component } from 'react';
import './TextCanvas.css';
import { isArray } from 'util';

class TextCanvas extends Component {
  state = {
    lines: [],
    currentYLocation: 0,
    endingYLocation: 0,
    isFinished: false
  };

  constructor(props) {
    super(props);
    this.textCanvas = React.createRef();
    this.padding = 20;
    this.leading = 10;
    this.fontSize = 32;
    this.font = `${this.fontSize}px Anton`;
    this.textColor = '#86352C';
    this.outlineColor = '#FFF';
    this.rate = 0.4;
  }

  componentDidMount() {
    this.textToLines();
  }

  componentWillUnmount() {
    const { animateId } = this.state;
    cancelAnimationFrame(animateId);
  }

  textToLines() {
    const canvas = this.textCanvas.current;
    const ctx = canvas.getContext('2d');
    ctx.font = this.font;
    const text = isArray(this.props.text) ? this.props.text : [this.props.text];
    const currentYLocation = canvas.height;
    var lines = [];
    text.forEach(phrase => {
      let words = phrase.toUpperCase().split(' ');
      let line = '';
      let space = '';

      while (words.length > 0) {
        let word = words.shift();
        let width = ctx.measureText(line + space + word + this.padding).width;
        if (width < canvas.width) {
          line += space + word;
          space = ' ';
        } else {
          if (space === '') {
            line += word;
          } else {
            words.unshift(word);
          }

          lines.push(line);
          space = '';
          line = '';
        }
      }

      if (line !== '') {
        lines.push(line);
      }
      lines.push(' ');
    });
    const endingYLocation =
      -(lines.length + 0.5) * (this.fontSize + this.leading);

    this.setState(
      {
        lines: lines,
        currentYLocation: currentYLocation,
        endingYLocation: endingYLocation
      },
      () => {
        this.animate();
      }
    );
  }

  finishAnimate() {
    const { isFinished } = this.state;
    if (!isFinished) {
      this.setState({ isFinished: true }, () => {
        this.props.handleCallback();
      });
    }
  }

  animate() {
    const { endingYLocation } = this.state;
    let { currentYLocation } = this.state;
    const animateId = requestAnimationFrame(() => {
      if (currentYLocation > endingYLocation) {
        this.animate();
      } else {
        this.finishAnimate();
      }
    });
    if (currentYLocation > endingYLocation) {
      currentYLocation -= this.rate;
    }
    this.setState({
      animateId: animateId,
      currentYLocation: currentYLocation
    });
    this.drawText();
  }

  drawText() {
    const { lines, currentYLocation } = this.state;
    const canvas = this.textCanvas.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = this.font;
    ctx.fillStyle = this.textColor;
    ctx.strokeStyle = this.outlineColor;
    let currentLineX = 0;
    let currentLineY = currentYLocation;
    lines.forEach(line => {
      currentLineX = Math.floor(
        (canvas.width - ctx.measureText(line).width) / 2
      );
      currentLineY += this.fontSize + this.leading;
      ctx.fillText(line, currentLineX, currentLineY);
      ctx.strokeText(line, currentLineX, currentLineY);
    });
  }

  render() {
    return (
      <canvas
        ref={this.textCanvas}
        width='800'
        height='450'
        className='textCanvas'
      />
    );
  }
}

export default TextCanvas;
