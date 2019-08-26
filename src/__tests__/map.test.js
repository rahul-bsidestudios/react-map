import React from 'react';
import { shallow } from 'enzyme';
import Map from '../components/map';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

test('should render map without crashing', () => {
  shallow(<Map path={null} origin='' destination='' />);
});