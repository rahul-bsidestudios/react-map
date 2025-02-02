import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { lineString, bbox } from '@turf/turf';
import { MAPBOX_KEY, MAP_STYLE } from '../../constants';

const Mapbox = ReactMapboxGl({
  accessToken: MAPBOX_KEY
});

const Map = (props) => {
  const [map, setMap] = useState(null);
  const center = [114.1576900, 22.2855200];
  const zoom = [12];
  const containerStyle = {
    height: '100vh',
    width: '100%'
  };
  const { path, origin, destination, setLoading } = props;

  useEffect(() => {
    if (path && map) {
      const boundingBox = bbox(lineString(path));
      map.fitBounds(boundingBox, { padding: 30 });
    }
  }, [map, path]);
  
  /**
   * @description initialize map after mapbox instance loaded
   * @param {object} map 
   */
  const onMapLoaded = (map) => {
    setMap(map);
    setLoading(false);
  }

  /**
   * @description render map using mapbox
   */
  return (
    <Mapbox
      center={center}
      zoom={zoom}
      onStyleLoad={onMapLoaded}
      //eslint-disable-next-line
      style={MAP_STYLE}
      containerStyle={containerStyle}>
      {path && <Layer
        type="line"
        paint={{
          'line-color': '#4264fb',
          'line-width': 6
        }}
        id="path">
        <Feature coordinates={path} />
      </Layer>}
      {path && <Layer
        type="symbol"
        id="marker"
        textField={props.origin}
        layout={{ 'icon-image': 'marker-15', 'text-field': origin, 'text-size': 13, 'text-anchor': 'top' }}>
        <Feature coordinates={path[0]} />
      </Layer>}
      {props.path && <Layer
        type="symbol"
        id="marker1"
        layout={{ 'icon-image': 'harbor-15', 'text-field': destination, 'text-size': 13, 'text-anchor': 'top' }}>
        <Feature coordinates={path[path.length - 1]} />
      </Layer>}
    </Mapbox>
  );
}

Map.propTypes = {
  path: PropTypes.array,
  origin: PropTypes.string,
  setLoading: PropTypes.func,
  destination: PropTypes.string
}

export default Map;