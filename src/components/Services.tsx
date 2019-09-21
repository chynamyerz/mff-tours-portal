import React from 'react';
import styled from 'styled-components';
import { Col, Card, CardBody, CardTitle, CardText, Alert } from 'reactstrap';

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
        <Col sm={12} md={{size: 6, offset: 3}} lg={{size: 6, offset: 3}}>
          <h3 style={{paddingTop: "10%", marginBottom: "2%"}}><strong>Our Services</strong></h3>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              {/* <CardImg width="100%" src={require("../assets/images/mff-tours-logo.jpg")} alt="MFF-TOUR LOGO" /> */}
              <CardBody>
                <CardTitle>
                  <strong>Business Travel</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    Co- ordination of travel needs 
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <CardTitle>
                  <strong>Events Co-ordination</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    Business retreats, team building and year end parties.
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <CardTitle>
                  <strong>Procurement of event passes</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    Sports, special events, concerts etc
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <CardTitle>
                  <strong>VIP Travel services that range from security required to vehicle specifications</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    Providing transport for conference, events and any other special projects

                    Services to executives and non-exclusive groups and individuals to their desired destination
                    Scheduled tours from half day or up to weeks (depending on the client)
                    Private tour
                    Itinerary planning
                    Shuttle Service
                    Vehicle Rentals
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Col>
      </ServicesContainer>
    );
  }
}
