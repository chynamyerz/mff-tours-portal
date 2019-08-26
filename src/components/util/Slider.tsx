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
    altText: 'MFF-TOURS VEHICLE',
    caption: ''
  },
  {
    src: require("../../assets/images/mff-tours-vehicles.jpg"),
    altText: 'MFF-TOURS VEHICLES',
    caption: ''
  },
  {
    src: require("../../assets/images/mff-tours-vehicles1.jpg"),
    altText: 'MFF-TOURS VEHICLES',
    caption: ''
  }
];

export const Slider = () => <UncontrolledCarousel items={items}/>;
