import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getToken, getPath } from '../../services';
import MapboxAutoComplete from '../autoComplete';
import { SERVER_ERROR, RETRY_LIMIT, RETRY_LIMIT_ERROR } from '../../constants';
import './pathForm.css';

const PathForm = (props) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { loading } = props;

  /**
   * @description reset the results and error
   */
  const resetResults = () => {
    setDuration('');
    setDistance('');
    setError('');
    props.clear();
  }

  /**
   * @description clear the origin and destination text fields and reset results
   */
  const reset = () => {
    setSubmitted(false);
    setOrigin('');
    setDestination('');
    resetResults();
  }

  /**
   * @description get the distance and time through the api and passing the path
   * @param {string} token 
   */
  const getDistanceAndPath = async (token, attempts) => {
    try {
      const { status, total_distance: totalDistance, total_time: totalTime, path, error } = await getPath(token);
      if (status === 'in progress') {
        if (attempts < RETRY_LIMIT) {
          return getDistanceAndPath(token, attempts + 1);
        }
        else {
          props.setLoading(false);
          setError(RETRY_LIMIT_ERROR);
          return;
        }
      }
      props.setLoading(false);
      if (status === 'success') {
        setDistance(totalDistance);
        setDuration(totalTime);
        props.createPath(path, origin, destination);
      }
      else {
        setError(error);
      }
    }
    catch (err) {
      props.setLoading(false);
      const { message } = err;
      if (!message || message.indexOf('500') > -1) {
        setError(SERVER_ERROR);
      } else {
        setError(message);
      }
    }
  }

  /**
   * @description fetch the token
   */
  const submit = async () => {
    resetResults();
    setSubmitted(true);
    if (!origin || !destination) {
      return;
    }
    props.setLoading(true);
    try {
      const result = await getToken(origin, destination);
      if (result.token) {
        getDistanceAndPath(result.token, 0);
      }
      else {
        props.setLoading(false);
      }
    }
    catch (err) {
      const { message } = err;
      if (!message || message.indexOf('500') > -1) {
        setError(SERVER_ERROR);
      } else {
        setError(message);
      }
      props.setLoading(false);
    }
  }

  /**
   * @description clear origin input
   */
  const clearOrigin = () => {
    setOrigin('');
    resetResults();
  }

  /**
   * @description clear destination input
   */
  const clearDestination = () => {
    setDestination('');
    resetResults();
  }

  /**
   * @description set origin
   * @param {object} e 
   */
  const changeOrigin = (e) => {
    const { value } = e.target;
    setOrigin(value);
    setSubmitted(false);
  }

  /**
   * @description set destination
   * @param {object} e 
   */
  const changeDestination = (e) => {
    const { value } = e.target;
    setDestination(value);
    setSubmitted(false);
  }

  /**
   * @description render the form
   */
  return (
    <div className="filters">
      <div className="form-group">
        <label>Starting location</label>
        <MapboxAutoComplete
          inputClass='form-control search'
          onSuggestionSelect={(origin) => setOrigin(origin)}
          clear={clearOrigin}
          query={origin}
          onChange={changeOrigin.bind(this)}
        />
        {submitted && !origin && <div className="text-danger">Starting location is required</div>}
      </div>
      <div className="form-group last-control">
        <label>Drop-off location</label>
        <MapboxAutoComplete
          inputClass='form-control search'
          onSuggestionSelect={(destination) => setOrigin(destination)}
          clear={clearDestination}
          query={destination}
          onChange={changeDestination.bind(this)}
        />
        {submitted && !destination && <div className="text-danger">Drop-off location is required</div>}
      </div>
      {distance && <div className="results">
        <div>Total distance: {distance}</div>
        <div>Total time: {duration}</div>
      </div>}
      {error && <div className="text-danger error">{error}</div>}
      <div className="buttons">
        <button className="btn btn-primary" type="button" disabled={loading} onClick={submit.bind(this)}>
          {!loading && ((error || distance) ? 'Re-Submit' : 'Submit')}
          {loading && 'Loading'}
        </button>
        <button type="button" className="btn btn-secondary" disabled={loading} onClick={reset.bind(this)}>Reset</button>
      </div>
    </div>
  );
}

PathForm.propTypes = {
  clear: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  createPath: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default PathForm;