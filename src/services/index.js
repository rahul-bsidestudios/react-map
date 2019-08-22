import axios from 'axios';
import { API_URL } from '../config';

const instance =  axios.create({
  baseURL: API_URL
});

export const post = async (origin, destination) => {
  const response = await instance.post('route', { origin, destination });
  console.log(response.data);
  return response.data;
};

export const get = async (token) => {
  const response = await instance.get(`route/${token}`);
  console.log(response.data);
  return response.data;
};