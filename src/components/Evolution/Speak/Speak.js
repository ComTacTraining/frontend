import { Component } from 'react';
import CognitiveSpeech from './CognitiveSpeech/CognitiveSpeech';
import { isArray } from 'util';

class Speak extends Component {
  state = {
    voices: []
  };

  componentDidMount() {
    this.setupClient();
  }

  setupClient() {
    const speechKey = '702243bec2934359a0d4ea8db32aef38';

    const client = new CognitiveSpeech.TTSClient(speechKey);
    client.multipleXHR = false;
    this.setState({ client: client }, this.setupVoices);
  }

  setupVoices() {
    const voices = [
      {
        id: 'enAU_Female',
        voice: CognitiveSpeech.SupportedLocales.enAU_Female
      },
      {
        id: 'enCA_Female',
        voice: CognitiveSpeech.SupportedLocales.enCA_Female
      },
      {
        id: 'enGB_Female',
        voice: CognitiveSpeech.SupportedLocales.enGB_Female
      },
      { id: 'enGB_Male', voice: CognitiveSpeech.SupportedLocales.enGB_Male },
      { id: 'enIN_Male', voice: CognitiveSpeech.SupportedLocales.enIN_Male },
      {
        id: 'enUS_Female',
        voice: CognitiveSpeech.SupportedLocales.enUS_Female
      },
      { id: 'enUS_Male', voice: CognitiveSpeech.SupportedLocales.enUS_Male }
    ];
    this.setState({ voices: voices }, this.handleVoicePlay);
  }

  getVoice(key) {
    const { voices } = this.state;
    const voice = voices.filter(item => item.id === key);
    return voice[0].voice;
  }

  handleVoicePlay = () => {
    const { client } = this.state;
    const phrases = isArray(this.props.phrases)
      ? this.props.phrases
      : [this.props.phrases];
    const timeout = parseInt(this.props.timeout) || 0;
    const voiceString = this.props.voice || 'enUS_Male';
    const voice = this.getVoice(voiceString);
    phrases.forEach(phrase => {
      console.log(phrase, voice, timeout);
      setTimeout(function() {
        client.synthesize(phrase, voice);
      }, timeout);
    });
  };

  render() {
    return null;
  }
}

export default Speak;
