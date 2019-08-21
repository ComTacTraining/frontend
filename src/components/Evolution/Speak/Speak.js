import { Component } from 'react';
import CognitiveSpeech from './CognitiveSpeech/CognitiveSpeech';
import { isArray } from 'util';
import config from '../../../config';

class Speak extends Component {
  state = {
    voices: []
  };

  componentDidMount() {
    this.setupClient();
    console.log('Inside speak');
    let firstAlarm = ['This is test'];
    this.props.callbackFromParent(firstAlarm);
  }

  setupClient() {
    const client = new CognitiveSpeech.TTSClient(config.COGNITIVE_SPEECH_KEY);
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
    this.setState({ voices: voices }, async () => {
      await this.handleVoicePlay();
      this.props.handleSpeechComplete();
    });
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
