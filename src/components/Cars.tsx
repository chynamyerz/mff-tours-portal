import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, Button, Row, Spinner } from 'reactstrap';
import styled from 'styled-components';
import moment from "moment";
import { Query } from 'react-apollo';
import { VEHICLE_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import ClientBook from './ClientBook';
import UserBook from './UserBook';

const CarsContainer = styled.div`
  margin: 5%;
`;

const CardContainer = styled.div`
  margin-top: 3%;
  margin-bottom: 3%;
`;

export default class Cars extends React.Component<any, {}> {
  public state = {
    moreDetails: false,
    selectedVehicle: null
  }

  render() {
    const { user } = this.props;
    const { moreDetails, selectedVehicle } = this.state;

    if (moreDetails && selectedVehicle && (user && user.role === "ADMIN")) {
      return (
        <CarsContainer style={{textAlign: "left"}}>
          <Col sm="12" md="12" lg="12">
            <Button 
              style={{ marginBottom: "1%"}}
              size={"sm"} 
              color={"primary"}
              onClick={() => this.setState({selectedVehicle: null, moreDetails: false})}
            >{"Go back to cars selection"}</Button>
          </Col>
          <UserBook user={user} vehicle={selectedVehicle}/>
        </CarsContainer>
      )
    }

    if (moreDetails && selectedVehicle) {
      return (
        <CarsContainer style={{textAlign: "left"}}>
          <Col sm={12} md={{size: 8, offset: 2}} lg={{ size: 10, offset: 1}}>
            <Button 
              style={{ marginBottom: "1%"}}
              size={"sm"} 
              color={"primary"}
              onClick={() => this.setState({selectedVehicle: null, moreDetails: false})}
            >{"Go back to cars selection"}</Button>
          </Col>
          <ClientBook user={user} vehicle={selectedVehicle}/>
        </CarsContainer>
      )
    }
 
    return (
      <CarsContainer>
        <Col sm="12" md="12" lg="12">
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
                  {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                  {
                    availableVehicles.map((vehicle: any) => {
                      return (
                        <CardContainer key={vehicle.id}>
                          <Card>
                            <Row>
                              <Col sm={12} md={6} lg={5}>
                                <CardImg width="100%" src={require(`../${vehicle.imageURI}`)} alt="Card image cap" />
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
