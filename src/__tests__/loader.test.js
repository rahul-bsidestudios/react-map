import React from 'react';
import { shallow } from 'enzyme';
import Loader from '../components/loader';

test('render loading div', () => {
  const component = shallow(<Loader />);
  expect(component.find('.loading').length).toEqual(1);
});