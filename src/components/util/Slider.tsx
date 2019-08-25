import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';

const items = [
  {
    src: require("../../assets/images/mff-tours-logo.jpg"),
    altText: 'MMF-TOURS',
    caption: ''
  },
  {
    src: require("../../assets/images/mff-tours-vehicle.jpg"),
    altText: 'MFF-TOURS BEHICLE',
    caption: ''
  }
];

export const Slider = () => <UncontrolledCarousel items={items}/>;
