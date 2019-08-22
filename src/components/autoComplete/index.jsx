import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './autoComplete.css';

const MapboxAutoComplete = (props) => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMessage] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [publicKey] = useState(props.publicKey);

  const updateQuery = event => {
    props.onChange(event);
    const header = { 'Content-Type': 'application/json' };
    let path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + event.target.value + '.json?access_token=' + publicKey;

    if (props.country) {
      path = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + event.target.value + '.json?access_token=' + publicKey + '&country=' + props.country;
    }

    if (event.target.value.length > 2) {
      return fetch(path, {
        headers: header,
      }).then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      }).then(json => {
        setError(false);
        setQueryResults(json.features);
      }).catch(err => {
        setError(true);
        setErrorMessage('There was a problem retrieving data from mapbox');
        setQueryResults([]);
      })
    } else {
      setQueryResults([]);
      setError(false);
    }
  }

  const resetSearch = () => {
    setQueryResults([]);
  }

  const onSuggestionSelect = event => {
    props.onSuggestionSelect(
      event.target.getAttribute('data-suggestion')
    )
  }

  const clearSearch = () => {
    setQueryResults([]);
    props.clear();
  }

  return (
    <div>
      <input placeholder={props.placeholder || 'Search'}
        id={props.inputId}
        onClick={props.inputOnClick}
        onBlur={props.inputOnBlur}
        onFocus={props.inputOnFocus}
        className={props.inputClass ?
          props.inputClass + ' react-mapbox-ac-input'
          : 'react-mapbox-ac-input'}
        onChange={updateQuery.bind(this)}
        value={props.query}
        type='text'
        autoComplete="off"
      />
      {props.query && <button type="button" className="btn close-icon" onClick={clearSearch.bind(this)} >
        <FontAwesomeIcon
          icon="times"
          color="#000000"
          size="sm"
        />
      </button>}
      <span>
        <div className='react-mapbox-ac-menu'
          style={queryResults.length > 0 || error ? { display: 'block' }
            : { display: 'none' }}
          onClick={resetSearch}>
          {
            queryResults.map((place, i) => {
              return (
                <div className='react-mapbox-ac-suggestion'
                  onClick={onSuggestionSelect}
                  key={place.place_name}
                  data-suggestion={place.place_name}
                  data-lng={place.center[0]}
                  data-lat={place.center[1]}
                  data-text={place.text}>

                  {place.place_name}

                </div>
              )
            })
          }
          {error && <div className="react-mapbox-ac-suggestion">{errorMsg}</div>}
        </div>
      </span>
    </div>
  );
}

MapboxAutoComplete.defaultProps = {
  inputId: null,
  inputOnFocus: null,
  inputOnBlur: null,
  inputOnClick: null
};

MapboxAutoComplete.propTypes = {
  inputId: PropTypes.string,
  inputOnFocus: PropTypes.func,
  inputOnBlur: PropTypes.func,
  inputOnClick: PropTypes.func,
  clear: PropTypes.func,
  inputClass: PropTypes.string,
  publicKey: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onSuggestionSelect: PropTypes.func.isRequired,
  country: PropTypes.string,
  query: PropTypes.string,
  onChange: PropTypes.func
}

export default MapboxAutoComplete;