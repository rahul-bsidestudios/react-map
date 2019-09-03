import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SUGGESTION_ERROR } from '../../constants';
import { getSuggestions } from '../../services';
import './autoComplete.css';

const MapboxAutoComplete = (props) => {
  const [error, setError] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const { inputClass, placeholder, query } = props;

  /**
   * @description fetch maching results through mapbox api
   * @param {object} event 
   */
  const updateQuery = async (event) => {
    props.onChange(event);
    const { value } = event.target;
    if (value) {
      try {
        const { features } = await getSuggestions(value);
        setError('');
        setQueryResults(features);
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
   * @description clear search results and the text field
   */
  const clearSearch = () => {
    setQueryResults([]);
    props.clear();
  }

  /**
   * @description focus on first suggestion on down key press
   * @param {object} e 
   */
  const inputKeyDown = (e) => {
    if(e.keyCode === 40 && queryResults.length > 0) {
      document.getElementsByClassName('react-mapbox-ac-input')[0].blur();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[0].focus();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[0].classList.add('active');
    }
  }

  /**
   * @description focus on next suggestion on down key and previous suggestion on up key
   * @param {object} e 
   */
  const listKeyDown = (e) => {
    const { tabIndex } = e.target;
    if(e.keyCode === 40 && tabIndex < queryResults.length-1 ) {
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex + 1].focus();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex + 1].classList.add('active');
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex].blur();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex].classList.remove('active');
      return;
    }
    if(e.keyCode === 38 && tabIndex > 0) {
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex - 1].focus();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex - 1].classList.add('active');
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex].blur();
      document.querySelectorAll('.react-mapbox-ac-suggestion')[tabIndex].classList.remove('active');
      return;
    }
    if(e.keyCode === 13) {
      props.onSuggestionSelect(
        e.target.getAttribute('data-suggestion')
      );
      setQueryResults([]);
    }
  }

  /**
   * @description hide the suggestion list on clicking outside
   * @param {object} e 
   */
  const documentClicked = (e) => {
    e.preventDefault();
    setQueryResults([]);
  }

  useEffect(() => {
    document.addEventListener('click', documentClicked);
    return () => document.removeEventListener('click', documentClicked);
  });

  /**
   * @description render the html for autocomplete
   */
  return (
    <div>
      <input placeholder={placeholder || 'Search'}
        className={inputClass ?
          inputClass + ' react-mapbox-ac-input'
          : 'react-mapbox-ac-input'}
        onChange={updateQuery.bind(this)}
        value={query}
        type='text'
        autoComplete="off"
        onKeyDown={inputKeyDown.bind(this)}
      />
      {query && <button type="button" className="btn close-icon" onClick={clearSearch.bind(this)} >X</button>}
      <span>
        <div className='react-mapbox-ac-menu'
          style={queryResults.length > 0 || error ? { display: 'block' }
            : { display: 'none' }}
          onClick={() => setQueryResults([])}
          >
          {
            queryResults.map((place, i) => {
              const { place_name, center, text } = place;
              return (
                <div className='react-mapbox-ac-suggestion'
                  onClick={(event) => props.onSuggestionSelect(
                    event.target.getAttribute('data-suggestion')
                  )}
                  key={place_name}
                  tabIndex={i}
                  data-suggestion={place_name}
                  data-lng={center[0]}
                  data-lat={center[1]}
                  data-text={text}
                  onKeyDown={listKeyDown.bind(this)}>
                  {place_name}
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

MapboxAutoComplete.propTypes = {
  clear: PropTypes.func.isRequired,
  inputClass: PropTypes.string,
  placeholder: PropTypes.string,
  onSuggestionSelect: PropTypes.func.isRequired,
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default MapboxAutoComplete;