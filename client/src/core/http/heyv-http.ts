import axios, { AxiosInstance } from 'axios';

const heyvHttp: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default heyvHttp;
