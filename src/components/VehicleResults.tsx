import React from 'react';
import { Col, Button, Card, Row, CardImg, CardBody, CardSubtitle, CardTitle, Alert, CardText } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VehicleSearchContainer = styled.div`
  margin: 8%;

  @media screen and (max-width: 600px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 500px) {
    margin-top: 25%;
  }
`;

const CardContainer = styled.div`
  margin-top: 3%;
  margin-bottom: 3%;
`;

export default class VehicleResults extends React.Component<any, any> {
  public state = {
    moreDetails: false,
    searched: false,
    vehicle: {},
  }
  

  render() {
    const { location, user, vehicles, pickupDate, returnDate } = this.props;
    const { moreDetails, vehicle } = this.state;

    if (moreDetails && Object.keys(vehicle).length && user && user.role === "ADMIN") {
      return <Redirect to={{
        pathname: "/admin-vehicle-booking",
        state: {
          user, 
          vehicle,
          pickupDate,
          returnDate
        }
      }} />
    }

    if (moreDetails && Object.keys(vehicle).length) {
      return <Redirect to={{
        pathname: "/client-vehicle-booking",
        state: {
          user, 
          vehicle,
          pickupDate,
          returnDate
        }
      }} />
    }
 
    return (
      <VehicleSearchContainer>
        <Col sm={12} md={12} lg={{size: 8, offset: 2}}>
          {!vehicles.length ?
            <Alert color={"info"}>
              Sorry, no vehicles available {location === "EMPANGENI" ? "at a" : "at the"} {location} for the specified dates.<br />
            </Alert> :
            <Alert color={"success"}>
              Vehicle{vehicles.length > 1 ? "s" : null} available at {location}.
            </Alert>
          }
        
          {vehicles.map((vehicle: any, index: number) => {
            return (
              <CardContainer key={`${vehicle.id}-${index}`}>
                <Card>
                  <Row>
                    <Col sm={12} md={6} lg={5}>
                      <CardImg width="100%" src={vehicle.imageURI} alt="Card image cap" />
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                      <CardBody className="text-left">
                        <CardSubtitle style={{fontWeight: "bold"}}>
                          {vehicle.size}
                        </CardSubtitle>
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>
                          {vehicle.name} {vehicle.make}
                        </CardTitle>
                        <CardText>Or similar group {vehicle.group} car</CardText>
                        <hr />
                        <CardText>
                          <p style={{fontSize: "1.5em"}}> 
                            <span>ZAR</span><span>899</span>.<span style={{fontSize: "0.7em"}}>99</span>
                          </p>
                        </CardText>
                        <hr />
                        <Button 
                          size={"sm"} 
                          color={"success"}
                          onClick={() => this.setState({vehicle, moreDetails: true})}
                        >{"More details "}<FontAwesomeIcon
                        icon="angle-right"
                      /></Button>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </CardContainer>
            )}
          )}
        </Col>
      </VehicleSearchContainer>
    );
  }
}

