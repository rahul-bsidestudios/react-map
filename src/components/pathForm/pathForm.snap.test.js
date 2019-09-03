import React from 'react';
import renderer from 'react-test-renderer';
import PathForm from './index';

const mockPath = jest.fn();
const mockClear = jest.fn();
const mockLoading = jest.fn();

test('renders PathForm component', () => {
  const tree = renderer.create(<PathForm createPath={mockPath} setLoading={mockLoading} clear={mockClear} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders Pthform component with loading property', () => {
  const tree = renderer.create(<PathForm loading={true} createPath={mockPath} setLoading={mockLoading} clear={mockClear} />).toJSON();
  expect(tree).toMatchSnapshot();
});