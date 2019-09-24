import React, { Component } from 'react';
import mic from 'microphone-stream';
import v4 from './aws-signature-v4';
import { EventStreamMarshaller } from '@aws-sdk/eventstream-marshaller';
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node';
import crypto from 'crypto';
import config from '../../../config';

const eventStreamMarshaller = new EventStreamMarshaller(toUtf8, fromUtf8);

export default class SpeechToText extends Component {
  state = {
    response: '',
    recording: false,
    micStream: null,
    buffer: [],
    transcription: '',
    socket: null,
    socketError: false,
    transcribeException: false
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

  async startRecording() {
    // first we get the microphone input from the browser (as a promise)...
    this.setState({ response: '' });
    window.navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true
      })
      // ...then we convert the mic stream to binary event stream messages when the promise resolves
      .then(async stream => {
        await this.streamAudioToWebSocket(stream);
      })
      .catch(function(error) {
        console.log(
          'There was an error streaming your audio to Amazon Transcribe. Please try again.'
        );
      });
  }

  async stopRecording() {
    this.setState({ recording: false });
    this.closeSocket();
  }

  streamAudioToWebSocket = async userMediaStream => {
    let { micStream, socket } = this.state;
    micStream = new mic();
    micStream.setStream(userMediaStream);
    this.setState({ micStream: micStream });
    let url = await this.createPresignedUrl();
    socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';
    this.setState({ socket: socket });
    console.log('Socket Opened');
    socket.onopen = () => {
      micStream.on('data', async rawAudioChunk => {
        let binary = await this.convertAudioToBinaryMessage(rawAudioChunk);
        if (socket.OPEN) {
          socket.send(binary);
          this.setState({ socket: socket });
        }
      });
    };
    // handle messages, errors, and close events
    this.wireSocketEvents();
  };

  async createPresignedUrl() {
    let v5 = new v4();
    let endpoint = 'transcribestreaming.us-west-2.amazonaws.com:8443';
    return await v5.createPresignedURL(
      'GET',
      endpoint,
      '/stream-transcription-websocket',
      'transcribe',
      crypto
        .createHash('sha256')
        .update('', 'utf8')
        .digest('hex'),
      {
        key: config.sockets.accessId,
        secret: config.sockets.secretKey,
        protocol: 'wss',
        expires: 15,
        region: 'us-west-2',
        query: 'language-code=en-US&media-encoding=pcm&sample-rate=44100'
      }
    );
  }

  async convertAudioToBinaryMessage(audioChunk) {
    let raw = mic.toRaw(audioChunk);
    if (raw == null) return;
    // downsample and convert the raw audio bytes to PCM
    let downsampledBuffer = await this.downsampleBuffer(raw, 44100);
    let pcmEncodedBuffer = await this.pcmEncode(downsampledBuffer);
    // add the right JSON headers and structure to the message
    let audioEventMessage = await this.getAudioEventMessage(
      Buffer.from(pcmEncodedBuffer)
    );
    //convert the JSON object + headers into a binary event stream message
    let binary = eventStreamMarshaller.marshall(audioEventMessage);
    return binary;
  }

  downsampleBuffer(buffer, outputSampleRate = 16000) {
    var inputSampleRate = 44100;
    if (outputSampleRate === inputSampleRate) {
      return buffer;
    }
    var sampleRateRatio = inputSampleRate / outputSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  async pcmEncode(input) {
    var offset = 0;
    var buffer = new ArrayBuffer(input.length * 2);
    var view = new DataView(buffer);
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  getAudioEventMessage = async buffer => {
    return {
      headers: {
        ':message-type': {
          type: 'string',
          value: 'event'
        },
        ':event-type': {
          type: 'string',
          value: 'AudioEvent'
        }
      },
      body: buffer
    };
  };

  wireSocketEvents() {
    let { socket, micStream, transcribeException, socketError } = this.state;
    // handle inbound messages from Amazon Transcribe
    socket.onmessage = message => {
      //convert the binary event stream message to JSON
      let messageWrapper = eventStreamMarshaller.unmarshall(
        Buffer(message.data)
      );
      let messageBody = JSON.parse(
        String.fromCharCode.apply(String, messageWrapper.body)
      );
      if (messageWrapper.headers[':message-type'].value === 'event') {
        this.handleEventStreamMessage(messageBody);
      } else {
        transcribeException = true;
        this.setState({ transcribeException: transcribeException });
        console.log(messageBody.Message);
      }
    };

    socket.onerror = function() {
      socketError = true;
      this.setState({ socketError: socketError });
      console.log('WebSocket connection error. Try again.');
    };

    socket.onclose = closeEvent => {
      console.log('Socket Closed');
      micStream.stop();
      this.props.handleListenComplete(this.state.response);

      // the close event immediately follows the error event; only handle one.
      if (!socketError && !transcribeException) {
        if (closeEvent.code !== 1000) {
          console.log('Streaming Exception : ' + closeEvent.reason);
        }
      }
    };
  }

  handleEventStreamMessage = function(messageJson) {
    let { response } = this.state;
    let results = messageJson.Transcript.Results;

    if (results.length > 0) {
      if (results[0].Alternatives.length > 0) {
        let transcript = results[0].Alternatives[0].Transcript;
        // fix encoding for accented characters
        transcript = decodeURIComponent(escape(transcript));

        if (!results[0].IsPartial) {
          response = response + transcript;
          this.setState({ response: response });
        }
      }
    }
  };

  closeSocket = async () => {
    let { socket, micStream } = this.state;
    if (socket.OPEN) {
      micStream.stop();
      // Send an empty frame so that Transcribe initiates a closure of the WebSocket after submitting all transcripts
      let emptyMessage = await this.getAudioEventMessage(
        Buffer.from(new Buffer([]))
      );
      let emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
      socket.send(emptyBuffer);
    }
    this.setState({ socket: socket, micStream: null });
  };

  showError(message) {
    console.log(message);
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
