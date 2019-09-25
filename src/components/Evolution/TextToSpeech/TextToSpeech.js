import React, { Component } from 'react';
import { Predictions } from 'aws-amplify';

export default class TextToSpeech extends Component {
  state = {
    textToGenerateSpeech: ''
  };

  componentDidMount() {
    console.log('TextToSpeech()');
    const { phrases } = this.props;
    let phrase = '';
    if (phrases instanceof Array) {
      phrase = phrases.join(' ').trim();
    } else {
      phrase = phrases;
    }

    this.setState({ textToGenerateSpeech: phrase }, () => {
      this.generateTextToSpeech();
    });
  }

  generateTextToSpeech() {
    const { textToGenerateSpeech } = this.state;
    const { voiceId } = this.props;

    Predictions.convert({
      textToSpeech: {
        source: {
          text: textToGenerateSpeech
        },
        voiceId: voiceId // default configured on aws-exports.js
        // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
      }
    })
      .then(result => {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const source = audioCtx.createBufferSource();
        audioCtx.decodeAudioData(
          result.audioStream,
          buffer => {
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);
            setTimeout(() => {
              this.props.handleSpeechComplete();
            }, (buffer.duration + 1) * 1000);
          },
          err => console.log({ err })
        );
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className='TextToSpeech' style={{ visibility: 'hidden' }}></div>
    );
  }
}
