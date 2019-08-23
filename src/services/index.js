import axios from 'axios';
import { API_URL } from '../config';

/**
 * @description create axios instance
 */
const instance = axios.create({
  baseURL: API_URL
});

/**
 * @description get the token
 * @param {string} origin 
 * @param {string} destination 
 */
export const post = async (origin, destination) => {
  const response = await instance.post('route', { origin, destination });
  return response.data;
};

/**
 * @description get the time, distance and path
 * @param {string} token 
 */
export const get = async (token) => {
  const response = await instance.get(`route/${token}`);
  return response.data;
};