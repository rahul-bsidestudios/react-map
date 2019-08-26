import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SUGGESTION_ERROR } from '../../constants';
import { getSuggestions } from '../../services';
import './autoComplete.css';

const MapboxAutoComplete = (props) => {
  const [error, setError] = useState('');
  const [queryResults, setQueryResults] = useState([]);

  /**
   * @description fetch maching results through mapbox api
   * @param {object} event 
   */
  const updateQuery = async (event) => {
    props.onChange(event);
    if (event.target.value) {
      try {
        const response = await getSuggestions(event.target.value);
        setError('');
        setQueryResults(response.features);
      }
      catch (err) {
        setError(SUGGESTION_ERROR);
        setQueryResults([]);
      }
    } else {
      setQueryResults([]);
      setError('');
    }
  }
  /**
   * @description reset query results
   */
  const resetSearch = () => {
    setQueryResults([]);
  }

  /**
   * @description pass the selected value
   * @param {object} event 
   */
  const onSuggestionSelect = event => {
    props.onSuggestionSelect(
      event.target.getAttribute('data-suggestion')
    )
  }

  /**
   * @description clear search results and the text field
   */
  const clearSearch = () => {
    setQueryResults([]);
    props.clear();
  }

  /**
   * @description render the html for autocomplete
   */
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
      {props.query && <button type="button" className="btn close-icon" onClick={clearSearch.bind(this)} >X</button>}
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
          {error && <div className="text-danger react-mapbox-ac-suggestion">{error}</div>}
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
  clear: PropTypes.func.isRequired,
  inputClass: PropTypes.string,
  placeholder: PropTypes.string,
  onSuggestionSelect: PropTypes.func.isRequired,
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default MapboxAutoComplete;