import React from 'react';
import styled from 'styled-components';
import { Slider } from './util/Slider';

const HomeContainer = styled.div`
  width: 100%;
`;

export default class Home extends React.Component<any, {}> {
  render() {
    return (
      <HomeContainer>
        <h1><strong>MFF-TOURS</strong></h1>
        <Slider />
        <h4 style={{marginTop: "2%"}}>ALWAYS THERE TO DRIVE YOU AND YOUR PEOPLE TO YOUR CHOICE OF GREATNESS</h4>
      </HomeContainer>
    );
  }
}
