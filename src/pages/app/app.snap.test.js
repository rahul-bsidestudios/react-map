import React from 'react';
import renderer from 'react-test-renderer';
import App from './index';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: function () {
    this.on = jest.fn();
  }
}));

test('renders App component', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});