import React from 'react';
import styled from 'styled-components';
import { Card, CardBody, CardTitle, CardText, Row, Col, CardImg } from 'reactstrap';

const AboutContainer = styled.div`
  margin: 10%;
`;

export default class About extends React.Component<any, {}> {
  render() {
    return (
      <AboutContainer style={{textAlign: "left"}}>
        <Card style={{background: "hsl(0, 0%, 96%)"}}>
          <Row>
            <Col sm={12} md={6}>
              <CardImg height="100%" src={require("../assets/images/mff-tours-logo.jpg")} alt="MFF-TOUR LOGO" />
            </Col>
            <Col sm={12} md={6}>
              <CardBody>
                <CardTitle>
                  <strong>MFF-TOURS VISSION</strong>
                </CardTitle>
                <CardText>
                Be the leading touring service provider nation wide.
                </CardText>
              </CardBody>
              <hr />
              <CardBody>
                <CardTitle>
                  <strong>MFF-TOURS MISSION</strong>
                </CardTitle>
                <CardText>
                  To provide the best comfortable touring service nation wide.
                </CardText>
              </CardBody>
              <hr />
              <CardBody>
                <CardTitle>
                  <strong>MFF-TOURS CURRENT STATE</strong>
                </CardTitle>
                <CardText>
                  Currently operating nation wide.
                </CardText>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </AboutContainer>
    );
  }
}
