import React from 'react';
import { Col, Button, Card, Row, CardImg, CardBody, CardSubtitle, CardTitle, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

const VehicleSearchContainer = styled.div`
  margin: 5%;
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
          <Alert color={"success"}>
            Vehicle{vehicles.length > 1 ? "s" : null} available at {location === "ANY LOCATION" ? "all branches" :  location}
          </Alert>
          {vehicles.map((vehicle: any) => {
            return (
              <CardContainer key={vehicle.id}>
                <Card>
                  <Row>
                    <Col sm={12} md={6} lg={5}>
                      <CardImg width="100%" src={vehicle.imageURI} alt="Card image cap" />
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                      <CardBody className="text-left">
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>{vehicle.name}</CardTitle>
                        <CardSubtitle style={{fontWeight: "bold"}}>{vehicle.model} | {vehicle.make} | {moment(vehicle.year).format("YYYY-MM-DD")}</CardSubtitle>
                        <hr />
                        <Button 
                          size={"sm"} 
                          color={"success"}
                          onClick={() => this.setState({vehicle, moreDetails: true})}
                        >{"More details"}</Button>
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

