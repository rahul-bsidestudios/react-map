import React from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { MAPBOX_KEY } from '../../config';
import './map.css';

const Mapbox = ReactMapboxGl({
  accessToken: MAPBOX_KEY
});

const Map = (props) => {
  const center = [114.1576900, 22.2855200];
  return (
    <Mapbox
      center={center}
      //eslint-disable-next-line
      style='mapbox://styles/mapbox/streets-v8'
      containerStyle={{
        height: '100vh',
        width: '100%'
      }}>
      {props.path && <Layer
        type="line"
        paint={{
          'line-color': '#4264fb',
          'line-width': 6
        }}
        id="path">
        <Feature coordinates={props.path} />
      </Layer>}
      {props.path && <Layer
        type="symbol"
        id="marker"
        textField={props.origin}
        layout={{ 'icon-image': 'marker-15', 'text-field': props.origin, 'text-size': 13, 'text-anchor': 'top' }}>
        <Feature coordinates={props.path[0]} />
      </Layer>}
      {props.path && <Layer
        type="symbol"
        id="marker1"
        layout={{ 'icon-image': 'harbor-15', 'text-field': props.destination, 'text-size': 13, 'text-anchor': 'top' }}>
        <Feature coordinates={props.path[props.path.length - 1]} />
      </Layer>}
    </Mapbox>
  );
}

Map.propTypes = {
  path: PropTypes.array,
  origin: PropTypes.string,
  destination: PropTypes.string
}

export default Map;