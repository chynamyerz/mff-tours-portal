import React from 'react';
import { Slider } from './util/Slider';
import { Col } from 'reactstrap';


export default class Home extends React.Component<any, {}> {
  render() {
    return (
      <Col>
        <h1><strong>MFF-TOURS</strong></h1>
        <Slider />
        <h4 style={{marginTop: "2%"}}>ALWAYS THERE TO DRIVE YOU AND YOUR PEOPLE TO YOUR CHOICE OF GREATNESS</h4>
      </Col>
    );
  }
}
