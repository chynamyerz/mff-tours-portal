import React from 'react';
import styled from 'styled-components';
import { Card, CardBody, CardTitle, CardText, Col, Alert } from 'reactstrap';

const AboutContainer = styled.div`
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

export default class About extends React.Component<any, {}> {
  render() {
    return (
      <AboutContainer>
        <Col sm={12} md={{size: 6, offset: 3}} lg={{size: 6, offset: 3}}>
          <h3 style={{paddingTop: "10%", marginBottom: "2%"}}><strong>About MFF Car Rental</strong></h3>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              {/* <CardImg width="100%" src={require("../assets/images/mff-tours-logo.jpg")} alt="MFF-TOUR LOGO" /> */}
              <CardBody>
                <CardTitle>
                  <strong>Background</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    I Sizwe Thabiso Mnguni and my partner Khulekani Mnguni own and run MFF TOURS LTD PTY. <br />
                    It operates in Richards Bay with clients from Richards bay and the surrounding areas. <br />
                    This company was founded by <strong>Sizwe</strong> in 2018. Since then,<br />
                    it has grown its client base greatly within the first year of operation. <br /> 
                    MFF RENTALS/TOURS is still in the planning stages of opening branches in different towns/cities.
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <CardTitle>
                  <strong>Vesion</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    Our vision is to be the biggest Black Owned Vehicle Rental/Tour Company with clients all around South Africa. <br />
                    By providing tailored, affordable, safe and reliable transportation.
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <CardTitle>
                  <strong>Goals</strong>
                </CardTitle>
                <CardText>
                  <Alert color="light">
                    To have a fleet of all vehicle classes (A - N). <br />
                    To maintain our client happy to grow word of mouth.
                  </Alert>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Col>
      </AboutContainer>
    );
  }
}
