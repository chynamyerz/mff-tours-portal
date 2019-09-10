import React from 'react';
import styled from 'styled-components';
import { Col } from 'reactstrap';

const ServicesContainer = styled.div`
  @media screen and (max-width: 500px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 600px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 10%;
  }
`;

export default class Services extends React.Component<any, {}> {
  render() {
    return (
      <ServicesContainer>
        <Col sm={12} md={{size: 10, offset: 1}} lg={{size: 8, offset: 2}}>
          <h3 style={{paddingTop: "10%"}}><strong>Services under construction</strong></h3>
          </Col>
      </ServicesContainer>
    );
  }
}
