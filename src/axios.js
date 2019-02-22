import axios from "axios";

const instance = axios.create({
  //baseURL: `${process.env.REACT_APP_API_URI}`
  baseURL: "https://xux70h3bc1.execute-api.us-west-2.amazonaws.com/dev"
});

export default instance;
