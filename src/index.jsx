import React from 'react';
import { render } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faKey } from '@fortawesome/free-solid-svg-icons';
import App from './pages/app';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

/**
 * @description add cross icon in font awesome library
 */
library.add(faTimes, faKey);

render(<App />, document.getElementById('root'));