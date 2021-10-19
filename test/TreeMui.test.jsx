import React from 'react';
import TreeMui from '../src/TreeMui';
import { shallow } from 'enzyme';

describe('Test in <TreeMui />', () => {
  const data = [];
  const wrapper = shallow(<TreeMui data={data}  />);

  test('should show the component correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // test('should have a paragraf with title', () => {
  //   const p = wrapper.find('p');

  //   expect(p.text().trim()).toBe(title);
  // });

  // test('should have a image with url and alt from props', () => {
  //   const img = wrapper.find('img');

  //   expect(img.prop('src')).toBe(src);
  //   expect(img.prop('alt')).toBe(title);
  // });

  // test('should have class animate__fadeIn', () => {
  //   const div = wrapper.find('div');
  //   const className = div.prop('className');

  //   expect(className.includes('animate__fadeIn')).toBe(true);
  // });
})