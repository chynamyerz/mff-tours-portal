import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, Button, Row, Spinner } from 'reactstrap';
import styled from 'styled-components';
import moment from "moment";
import { Query } from 'react-apollo';
import { VEHICLE_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router';

const CarsContainer = styled.div`
  margin: 5%;
`;

const CardContainer = styled.div`
  margin-top: 3%;
  margin-bottom: 3%;
`;

export default class Cars extends React.Component<any, {}> {
  public state = {
    addVehicle: false,
    moreDetails: false,
    selectedVehicle: {}
  }

  render() {
    const { user } = this.props;
    const { addVehicle, moreDetails, selectedVehicle } = this.state;

    if (addVehicle) {
      return <Redirect to={{
        pathname: "/add-vehicle",
        state: {
          user
        }
      }} />
    }

    if (moreDetails && selectedVehicle && (user && user.role === "ADMIN")) {
      return <Redirect to={{
        pathname: "/admin-vehicle-booking",
        state: {
          user, 
          vehicle:{selectedVehicle}
        }
      }} />
    }

    if (moreDetails && Object.keys(selectedVehicle).length) {
      return <Redirect to={{
        pathname: "/client-vehicle-booking",
        state: {
          user, 
          vehicle:{selectedVehicle}
        }
      }} />
    }
 
    return (
      <CarsContainer>
        <Col sm={12} md={12} lg={{size: 8, offset: 2}}>
          <Query
            query={VEHICLE_QUERY}
          >
            {({data, loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }
              const vehicles: any = data && data.vehicles ? data.vehicles : []

              const availableVehicles: any = vehicles.filter((vehicle: any) => vehicle.status === "AVAILABLE")

              if (!availableVehicles.length) {
                return <p>All cars are booked, please come back check later...</p>
              }

              return (
                <>
                {(user && user.role === "ADMIN") &&
                  <div style={{textAlign: "left"}}>
                    <Button
                      size={"sm"} 
                      color={"info"}
                      onClick={() => this.setState({addVehicle: true})}
                    >
                      Add a new vehicle
                    </Button>
                  </div>
                }
                  
                  {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                  {
                    availableVehicles.map((vehicle: any) => {
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
                                    disabled={loading}
                                    size={"sm"} 
                                    color={"success"}
                                    onClick={() => this.setState({selectedVehicle: vehicle, moreDetails: true})}
                                  >{"More details"}</Button>
                                </CardBody>
                              </Col>
                            </Row>
                          </Card>
                        </CardContainer>
                      )
                    })
                  }
                </>
              )
            }}
          </Query>
        </Col>
      </CarsContainer>
    );
  }
}
