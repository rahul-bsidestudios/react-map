import React from 'react';
import renderer from 'react-test-renderer';
import Loader from '../../components/loader';

test('renders Loader component', () => {
  const tree = renderer.create(<Loader />).toJSON();
  expect(tree).toMatchSnapshot();
});