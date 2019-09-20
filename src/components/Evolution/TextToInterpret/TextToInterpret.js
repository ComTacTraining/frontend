import React, { Component } from 'react';
import { Predictions } from 'aws-amplify';

export default class TextToInterpret extends Component {
  state = {
    result: null
  };

  componentDidMount() {
    this.generateInterpretation();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.transcript !== this.props.transcript) {
      this.generateInterpretation();
    }
  }

  generateInterpretation() {
    const { transcript } = this.props;
    Predictions.interpret({
      text: {
        source: {
          text: transcript
        },
        type: 'ALL'
      }
    })
      .then(result => {
        console.log(result);
        this.setState({ result: JSON.stringify(result, null, 2) });
      })
      .catch(err => this.setState({ result: JSON.stringify(err, null, 2) }));
  }

  render() {
    const { result } = this.state;
    return (
      <div className='Comprehend'>
        <pre>{result !== null ? result : ''}</pre>
      </div>
    );
  }
}
