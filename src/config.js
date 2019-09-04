export default {
  STRIPE_KEY: 'pk_test_SdjnHScZnZMzPIk4Y5jHXo4H00gR6cyGFH',
  COGNITIVE_SPEECH_KEY: '702243bec2934359a0d4ea8db32aef38',
  s3: {
    REGION: 'us-west-2',
    BUCKET: 'ctt-video'
  },
  apiGateway: {
    REGION: 'us-west-2',
    URL: 'https://u2z0rz9asj.execute-api.us-west-2.amazonaws.com/prod'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_0QOvAuKl9',
    APP_CLIENT_ID: '72j28lpr3ne78v476r763c6ln7',
    IDENTITY_POOL_ID: 'us-west-2:35b463c7-d4a7-4dcf-ba01-fa76f1728313'
  },
  polly: {
    REGION: 'us-west-2',
    PROXY: false,
    DEFAULT_VOICE_ID: 'Matthew',
    LANGUAGE_CODE: 'en-US'
  },
  transcribe: {
    REGION: 'us-west-2',
    PROXY: false,
    LANGUAGE_CODE: 'en-US'
  },
  comprehend: {
    REGION: 'us-west-2',
    PROXY: false,
    TYPE: 'ALL'
  }
};
