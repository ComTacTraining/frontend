import React, { Component } from "react";
import axios from "../../axios";
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';
//import SayButton from 'react-say';
import DictateButton from 'react-dictate-button';

class Speech extends Component {
    state = {
        authorizationToken: '',
        dictate: ''
    };
    
    componentDidMount() {
        const authToken = this.authorizationToken;
        const tokenPromise = new Promise(function(resolve, reject) {
            if (!authToken) {
                axios.post("/speech")
                    .then(response => {
                        resolve(response.data);
                    });
            } else {
                resolve(this.authorizationToken);
            }
        });

        tokenPromise.then(token => {
            this.setState({ authorizationToken: token });
            const ponyfillPromise = createPonyfill({
                authorizationToken: token,
                region: 'westus',
            });
            ponyfillPromise.then(ponyfill => {
                console.log(ponyfill);
                this.setState({ ponyfill: ponyfill })
                this.setState(() => ({ ponyfill }));
            });
        });
    }

    render() {
        const { ponyfill } = this.state;
        /*const { 
            state: { ponyfill }
        } = this;
        <SayButton speechSynthesis={ ponyfill.speechSynthesis } speechSynthesisUtterance={ ponyfill.SpeechSynthesisUtterance } text="Hello, World!" />
        */

      
        return (
            <div>
                <div>{this.state.dictate}</div>
            { ponyfill &&
            <DictateButton 
                onDictate={ ({ result }) => {
                    this.setState({ dictate: this.state.dictate + ' ' + result.transcript });
                } } 
                speechGrammarList={ ponyfill.SpeechGrammarList } 
                speechRecognition={ ponyfill.SpeechRecognition }>
                Start dictation
            </DictateButton>
            
            }
            </div>
        );
    }
}

export default Speech;