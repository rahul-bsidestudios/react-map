import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div className="text-center loader">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;