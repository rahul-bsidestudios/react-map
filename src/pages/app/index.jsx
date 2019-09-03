import React, { useState } from 'react';
import PathForm from '../../components/pathForm';
import Loader from '../../components/loader';
import Map from '../../components/map';

/**
 * @description convert coordinaties into float values
 * @param {object} path
 */
const convertPath = path => {
  const arr = [];
  path.map(item => {
    return arr.push([parseFloat(item[1]), parseFloat(item[0])]);
  });
  return arr;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  /**
   * @description creat path and set origin and destination
   * @param {object} _path 
   * @param {string} _origin 
   * @param {string} _destination 
   */
  const createPath = (_path, _origin, _destination) => {
    setPath(convertPath(_path));
    setOrigin(_origin);
    setDestination(_destination);
  }

  /**
   * @description clear path
   */
  const clear = () => {
    setPath(null);
    setLoading(false);
  }

  /**
   * @description render the application
   */
  return (
    <div className="container-fluid">
      {loading && <Loader />}
      <div className="row">
        <div className="col-sm-4">
          <PathForm
            setLoading={setLoading.bind(this)}
            clear={clear.bind(this)}
            createPath={createPath.bind(this)}
            loading={loading}
          />
        </div>
        <div className="col-sm-8">
          <Map path={path} origin={origin} destination={destination} setLoading={(val) => setLoading(val)} />
        </div>
      </div>
    </div>
  );
}

export default App;
