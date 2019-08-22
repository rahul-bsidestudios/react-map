import React, { useState } from 'react';
import Filters from '../components/filters';
import Loader from '../components/loader';
import Map from '../components/map';
import './app.css';

const convertPath = path => {
  const arr = [];
  path.map(item => {
    return arr.push([parseFloat(item[1]), parseFloat(item[0])]);
  });
  return arr;
}

const App = (props) => {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const createPath = (_path, _origin, _destination) => {
    setPath(convertPath(_path));
    setOrigin(_origin);
    setDestination(_destination);
  }

  const clear = () => {
    setPath(null);
    setLoading(false);
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-4">
          <Filters
            setLoading={setLoading.bind(this)}
            clear={clear.bind(this)}
            createPath={createPath.bind(this)}
          />
        </div>
        <div className="col-sm-8">
          {loading && <Loader />}
          <Map path={path} origin={origin} destination={destination} />
        </div>
      </div>
    </div>
  );
}

export default App;
