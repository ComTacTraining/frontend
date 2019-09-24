import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
//import axios from 'axios';
import Amplify from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import config from './config';

/*axios.interceptors.request.use(
  request => {
    console.log(request);
    // Edit request config
    return request;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(response);
    return response;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);*/

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  predictions: {
    convert: {
      speechGenerator: {
        region: config.polly.REGION,
        proxy: config.polly.PROXY,
        defaults: {
          VoiceId: config.polly.DEFAULT_VOICE_ID,
          LanguageCode: config.polly.LANGUAGE_CODE
        }
      },
      transcription: {
        region: config.transcribe.REGION,
        proxy: config.transcribe.PROXY,
        defaults: {
          language: config.transcribe.LANGUAGE_CODE
        }
      }
    },
    interpret: {
      interpretText: {
        region: config.comprehend.REGION,
        proxy: config.comprehend.PROXY,
        defaults: {
          type: config.comprehend.TYPE
        }
      }
    }
  },
  /*Storage: {
    AWSS3: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET
    }
  },*/
  API: {
    endpoints: [
      {
        name: 'comtac',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});
Amplify.addPluggable(new AmazonAIPredictionsProvider());

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
