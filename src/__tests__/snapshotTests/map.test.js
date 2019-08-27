import React from 'react';
import renderer from 'react-test-renderer';
import Map from '../../components/map';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: function () {
    this.on = jest.fn();
  }
}));

test('renders Map component', () => {
  const tree = renderer.create(<Map />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders Map component with props', () => {
  const tree = renderer.create(<Map path={[[22.2855200, 114.1576900], [22.2855210, 114.1576910], [22.2855220, 114.1576920]]} origin='test' destination='test' />).toJSON();
  expect(tree).toMatchSnapshot();
});