import React, { Component, Fragment } from 'react';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
import RadioButton from './RadioButton/RadioButton';
import config from '../../../config';

export default class Listen extends Component {
  state = {
    ponyfill: null
  };

  async componentDidMount() {
    const ponyfill = await createPonyfill({
      region: 'westus',
      subscriptionKey: config.COGNITIVE_SPEECH_KEY
    });
    this.setState(() => ({ ponyfill }));
  }

  handleDictate = result => {
    this.props.handleListenResponse(result);
  };

  render() {
    const { ponyfill } = this.state;
    return (
      <Fragment>
        {ponyfill && (
          <RadioButton
            onDictate={({ result }) => this.handleDictate(result.transcript)}
            speechGrammarList={ponyfill.SpeechGrammarList}
            speechRecognition={ponyfill.SpeechRecognition}
          >
            Start dictation
          </RadioButton>
        )}
      </Fragment>
    );
  }
}
