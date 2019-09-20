import React, { Component } from 'react';
import { Predictions } from 'aws-amplify';
import mic from 'microphone-stream';

export default class SpeechToText extends Component {
  state = {
    response: '',
    recording: false,
    micStream: null,
    buffer: []
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.isRecording !== this.props.isRecording ||
      prevProps.endRecording !== this.props.endRecording
    ) {
      this.processRecording();
    }
  }

  processRecording() {
    const { isRecording, endRecording } = this.props;
    if (isRecording && !endRecording) {
      this.startRecording();
    }
    if (isRecording && endRecording) {
      this.stopRecording();
    }
  }

  addToBuffer(raw) {
    let { buffer } = this.state;
    buffer = buffer.concat(...raw);
    this.setState({ buffer: buffer });
  }

  async startRecording() {
    this.setState({ buffer: [] });

    window.navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(stream => {
        const startMic = new mic();

        startMic.setStream(stream);
        startMic.on('data', chunk => {
          var raw = mic.toRaw(chunk);
          if (raw == null) {
            return;
          }
          this.addToBuffer(raw);
        });

        this.setState({ recording: true, micStream: startMic });
      })
      .catch(error => {
        console.log(error);
      });
  }

  async stopRecording() {
    const { micStream, buffer } = this.state;

    micStream.stop();
    this.setState({ recording: false, micStream: null });

    this.convertFromBuffer(buffer);
  }

  convertFromBuffer(bytes) {
    Predictions.convert({
      transcription: {
        source: {
          bytes
        },
        language: 'en-US'
      }
    })
      .then(({ transcription: { fullText } }) => {
        this.setState({ response: fullText });
        this.props.handleSpeechToTextComplete(fullText);
      })
      .catch(err => this.setState({ response: JSON.stringify(err, null, 2) }));
  }

  render() {
    const { response } = this.state;
    return (
      <div className='SpeechToText'>
        <pre>{response}</pre>
      </div>
    );
  }
}
