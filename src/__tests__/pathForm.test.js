import React from 'react';
import { shallow } from 'enzyme';
import mockAxios from 'jest-mock-axios';
import PathForm from '../components/pathForm';

let component = null;
const mockPath = jest.fn();
const mockClear = jest.fn();
const mockLoading = jest.fn();

beforeAll(() => {
  component = shallow(<PathForm createPath={mockPath} setLoading={mockLoading} clear={mockClear} />);
});

test('render filter form', () => {
  expect(component.find('form.filters').length).toEqual(1);
});

test('render 2 autocomplete', () => {
  expect(component.find('MapboxAutoComplete').length).toEqual(2);
});

test('render first label', () => {
  expect(component.find('.form-group').at(0).children('label').text()).toEqual('Starting location');
});

test('render second label', () => {
  expect(component.find('.form-group').at(1).children('label').text()).toEqual('Drop-off location');
});

test('do not render any errors', () => {
  expect(component.find('.text-danger').length).toEqual(0);
});

test('do not render results', () => {
  expect(component.find('.results').length).toEqual(0);
});

test('render 2 buttons', () => {
  expect(component.find('.btn').length).toEqual(2);
});

test('show origin error', () => {
  component.find('.btn-primary').simulate('click');
  expect(component.find('.text-danger').at(0).text()).toEqual('Starting location is required');
});

test('show drop-off error', () => {
  expect(component.find('.text-danger').at(1).text()).toEqual('Drop-off location is required');
});

test('set origin and remove errors', () => {
  component.find('MapboxAutoComplete').at(0).prop('onChange')({ target: { value: 'innocenter' } });
  expect(component.find('.text-danger').length).toEqual(0);
});

test('clear origin', () => {
  component.find('MapboxAutoComplete').at(0).prop('clear')();
  expect(mockClear.mock.calls.length).toBe(2);
});

describe('set origin and drop off then submit', () => {
  beforeAll(() => {
    component.find('MapboxAutoComplete').at(0).prop('onChange')({ target: { value: 'innocenter' } });
    component.find('MapboxAutoComplete').at(1).prop('onChange')({ target: { value: 'terminal 1' } });
    component.find('.btn-primary').simulate('click');
    const firstRequest = mockAxios.lastReqGet();
    mockAxios.mockResponse({ data: { token: '123' } }, firstRequest);
  });
  test('set loader', () => {
    expect(mockLoading.mock.calls.length).toBe(1);
  });
  test('call clear', () => {
    expect(mockClear.mock.calls.length).toBe(3);
    //eslint-disable-next-line
    mockAxios.mockResponse({ data: { status: 'success', total_time: 1000, total_distance: 10000, path: [['22.2855200', '114.1576900'], ['22.2855210', '114.1576910'], ['22.2855220', '114.1576920']] } });
  });
  test('set loader', () => {
    expect(mockLoading.mock.calls.length).toBe(2);
  });
  test('get path', () => {
    expect(mockPath.mock.calls.length).toBe(1);
  });
});


