import React from 'react';
import renderer from 'react-test-renderer';
import Loader from './index';

test('renders Loader component', () => {
  const tree = renderer.create(<Loader />).toJSON();
  expect(tree).toMatchSnapshot();
});