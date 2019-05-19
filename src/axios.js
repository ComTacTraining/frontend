import axios from "axios";

const instance = axios.create({
  //baseURL: `${process.env.REACT_APP_API_URI}`
  baseURL: "https://xr3d87synd.execute-api.us-west-2.amazonaws.com/dev"
  //baseURL: "http://localhost:3000"
});

export default instance;
