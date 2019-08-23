import React from 'react';
import './loader.css';

const Loader = () => {
  /**
   * @description render loader
   */
  return (
    <div className="text-center loader">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;