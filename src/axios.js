import axios from 'axios';

const instance = axios.create({
  //baseURL: `${process.env.REACT_APP_API_URI}`
  baseURL: 'https://u2z0rz9asj.execute-api.us-west-2.amazonaws.com/prod/'
});

export default instance;
