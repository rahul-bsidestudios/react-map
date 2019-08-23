import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { post, get } from '../../services';
import MapboxAutoComplete from '../../components/autoComplete';
import { MAPBOX_KEY } from '../../config';
import './filters.css';

const Filters = (props) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setOrigin('');
    setDestination('');
    resetResults();
  }

  /**
   * @description get the distance and time through the api and passing the path
   * @param {string} token 
   */
  const getDistanceAndPath = async (token) => {
    try {
      const response = await get(token);
      if (response.status === 'in progress') {
        return getDistanceAndPath(token);
      }
      setLoading(false);
      props.setLoading(false);
      if (response.status === 'success') {
        setDistance(response.total_distance);
        setDuration(response.total_time);
        props.createPath(response.path, origin, destination);
      }
      else {
        setError(response.error);
      }
    }
    catch (err) {
      setLoading(false);
      props.setLoading(false);
      setError(err.message);
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
    setLoading(true);
    props.setLoading(true);
    try {
      const result = await post(origin, destination);
      if (result.token) {
        getDistanceAndPath(result.token);
      }
      else {
        setLoading(false);
        props.setLoading(false);
      }
    }
    catch (err) {
      setError(err.message);
      setLoading(false);
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
   * @param {string} result 
   */
  const originSelect = (result) => {
    setOrigin(result);
  }

  /**
   * @description set destination
   * @param {string} result 
   */
  const destinationSelect = (result) => {
    setDestination(result);
  }

  /**
   * @description set origin
   * @param {object} e 
   */
  const changeOrigin = (e) => {
    setOrigin(e.target.value);
    setSubmitted(false);
  }

  /**
   * @description set destination
   * @param {object} e 
   */
  const changeDestination = (e) => {
    setDestination(e.target.value);
    setSubmitted(false);
  }

  /**
   * @description render the form
   */
  return (
    <form className="filters">
      <div className="form-group">
        <label>Starting location</label>
        <MapboxAutoComplete publicKey={MAPBOX_KEY}
          inputClass='form-control search'
          onSuggestionSelect={originSelect}
          inputId='origin'
          country='HK'
          clear={clearOrigin}
          query={origin}
          onChange={changeOrigin.bind(this)}
        />
        {submitted && !origin && <div className="text-danger">Starting location is required</div>}
      </div>
      <div className="form-group last-control">
        <label>Drop-off location</label>
        <MapboxAutoComplete publicKey={MAPBOX_KEY}
          inputClass='form-control search'
          inputId='destination'
          onSuggestionSelect={destinationSelect}
          country='HK'
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
      <div className="text-danger error">{error}</div>
      <div className="buttons">
        <button className="btn btn-primary" type="button" disabled={loading} onClick={submit.bind(this)}>
          {!loading && ((error || distance) ? 'Re-Submit' : 'Submit')}
          {loading && 'Loading'}
        </button>
        <button type="button" className="btn btn-secondary" disabled={loading} onClick={reset.bind(this)}>Reset</button>
      </div>
    </form>
  );
}

Filters.propTypes = {
  clear: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  createPath: PropTypes.func.isRequired
}

export default Filters;