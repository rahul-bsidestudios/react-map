import React from 'react';
import { shallow } from 'enzyme';
import App from './index';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
}));

let component = null;

beforeAll(() => {
  component = shallow(<App />);
});

test('render container', () => {
  expect(component.find('.container-fluid').length).toEqual(1);
});

test('does not render loader', () => {
  expect(component.find('Loader').length).toEqual(0);
});

test('render a row', () => {
  expect(component.find('.row').length).toEqual(1);
});

test('render left col', () => {
  expect(component.find('.col-sm-4').length).toEqual(1);
});

test('render right col', () => {
  expect(component.find('.col-sm-8').length).toEqual(1);
});

test('render map', () => {
  expect(component.find('Map').length).toEqual(1);
});

test('render path form', () => {
  expect(component.find('PathForm').length).toEqual(1);
});

test('render loader', () => {
  component.find('PathForm').prop('setLoading')(true);
  expect(component.find('Loader').length).toEqual(1);
});

test('create path', () => {
  component.find('PathForm').prop('createPath')([[22.2855200, 114.1576900], [22.2855210, 114.1576910], [22.2855220, 114.1576920]], 'innocentre', 'terminal 1');
});

test('clear path', () => {
  component.find('PathForm').prop('clear')();
});