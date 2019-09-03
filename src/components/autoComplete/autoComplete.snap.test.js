import React from 'react';
import renderer from 'react-test-renderer';
import MapboxAutoComplete from './index';

const mockSelect = jest.fn();
const mockClear = jest.fn();
const mockChange = jest.fn();

test('renders AutoComplete component', () => {
  const tree = renderer.create(<MapboxAutoComplete onSuggestionSelect={mockSelect} onChange={mockChange} clear={mockClear} />).toJSON();
  expect(tree).toMatchSnapshot();
});