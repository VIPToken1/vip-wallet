import axios from 'axios';
// const API_URL = 'http://162.0.208.8:3000';

// DEV
// const API_URL = 'https://vip-tokens.herokuapp.com/';

//PROD
const API_URL = 'https://api.viptoken.io//';
export const configAxios = () => {
  axios.defaults.baseURL = API_URL;
  axios.defaults.headers['Content-Type'] = 'application/json';
};

export const setAuthToken = (token: string) =>
  (axios.defaults.headers.Authorization = `Bearer ${token}`);
