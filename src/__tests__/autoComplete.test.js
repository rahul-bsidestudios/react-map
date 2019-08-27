import React from 'react';
import { shallow } from 'enzyme';
import mockAxios from 'jest-mock-axios';
import MapboxAutoComplete from '../components/autoComplete';

let component = null;
const mockSelect = jest.fn();
const mockClear = jest.fn();
const mockChange = jest.fn();

beforeAll(() => {
  component = shallow(<MapboxAutoComplete query='' onSuggestionSelect={mockSelect} onChange={mockChange} clear={mockClear} />);
});

afterEach(() => {
  mockAxios.reset();
});

test('render an input box', () => {
  expect(component.find('input').length).toEqual(1);
});

test('do not populate any items', () => {
  expect(component.find('.react-mapbox-ac-suggestion').length).toEqual(0);
});

test('do not render cross icon', () => {
  expect(component.find('.close-icon').length).toEqual(0);
});

test('show clear buttons', () => {
  component.find('input').simulate('change', { target: { value: 'innocenter' } });
  component.setProps({ query: 'innocenter' });
  expect(component.find('.close-icon').length).toEqual(1);
  mockAxios.mockResponse({
    data: {
      features: [{
        place_name: 'Innocenter',
        text: 'Innocenter',
        center: [0, 1]
      }]
    }
  });
});

test('show suggestion list on input', () => {
  expect(component.find('.react-mapbox-ac-suggestion').exists()).toEqual(true);
});

test('send the selected item', () => {
  component.find('.react-mapbox-ac-suggestion').simulate('click', { target: { getAttribute: () => { return 'Innocenter' } } });
  expect(mockSelect.mock.calls.length).toBe(1);
});

test('clear the text field', () => {
  component.find('.close-icon').simulate('click');
  expect(component.find('.react-mapbox-ac-suggestion').exists()).toEqual(false);
  expect(mockClear.mock.calls.length).toBe(1);
});

describe('show error', () => {
  beforeAll(() => {
    component.find('input').simulate('change', { target: { value: 'garbage' } });
    component.setProps({ query: 'garbage' });
    mockAxios.mockError({ message: 'Error' });
  });
  test('show error', () => {
    expect(component.find('.text-danger').length).toEqual(1);
  });
});
