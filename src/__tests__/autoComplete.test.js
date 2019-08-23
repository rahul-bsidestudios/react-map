import React from 'react';
import { shallow } from 'enzyme';
import MapboxAutoComplete from '../components/autoComplete';
import { MAPBOX_KEY } from '../config';

let component = null;
beforeAll(() => {
  const mockSelect = jest.fn();
  component = shallow(<MapboxAutoComplete publicKey={MAPBOX_KEY} onSuggestionSelect={mockSelect} />);
});

test('renders input box', () => {
  expect(component.find('input').length).toEqual(1);
})