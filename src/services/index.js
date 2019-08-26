import axios from 'axios';
import { API_URL, MAPBOX_URL, MAPBOX_KEY } from '../constants';

/**
 * @description create axios instance for mock api
 */
const instance = axios.create({
  baseURL: API_URL
});

/**
 * @description create axios instance for mapbox api
 */
const mapboxInstance = axios.create({
  baseURL: MAPBOX_URL
});

/**
 * @description get the token
 * @param {string} origin 
 * @param {string} destination 
 */
export const getToken = async (origin, destination) => {
  const response = await instance.post('route', { origin, destination });
  return response.data;
};

/**
 * @description get the time, distance and path
 * @param {string} token 
 */
export const getPath = async (token) => {
  const response = await instance.get(`route/${token}`);
  return response.data;
};

/**
 * @description get the matching address suggestions
 * @param {string} address 
 */
export const getSuggestions = async (address) => {
  const response = await mapboxInstance.get(`${address}.json?access_token=${MAPBOX_KEY}`);
  return response.data;
};