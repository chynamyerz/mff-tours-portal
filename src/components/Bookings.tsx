import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Spinner, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Mutation, Query } from 'react-apollo';
import { CANCEL_VEHICLE_BOOKING_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';

const VehicleContainer = styled.div`
  @media screen and (max-width: 500px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 600px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 6%;
  }
`;

const CardContainer = styled.div`
  margin-bottom: 5%;
`;

export default class Bookings extends React.Component<any, {}> {
  public state = {
    cancelled: false,
    selected: "",
    goToSearch: false
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, user: any, booking: any, cancelVehicleBooking: any) => {
    e.preventDefault();

    this.setState({ selected: booking.id });

    if (!user) {
      alert("You must be logged in to cancel booking")
      return;
    }

    try {
      // Book the car
      await cancelVehicleBooking({
        variables: { bookingId: booking.id }
      });

      this.setState({
        selected: false
      })

      alert("Booking has been cancelled!");
    } catch (error) {
      return
    }
  };

  goToSearch = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      goToSearch: true,
    }))
  }

  render() {

    const { user } = this.props;
    const { goToSearch, selected } = this.state;

    if (goToSearch) {
      return <Redirect to={"/"} />
    }
 
    return (
      <VehicleContainer>
        <Col sm={{size: 8, offset: 2}} md={{size: 8, offset: 2}} lg={{size: 6, offset: 3}}>
          <h3 style={{paddingTop: "15%"}}><strong>Your bookings</strong></h3>
          <Query
            query={VEHICLE_BOOKINGS_QUERY}
          >
            {({data, loading}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }

              const bookings: any = data && data.bookings ? data.bookings.filter((booking: any) => (booking.status === "BOOKED")) : [];              

              const userBookings: any = bookings.filter((booking: any) => (booking.user.id === user.id))

              if (!userBookings.length) {
                return (
                  <Col sm={{size: 6, offset: 3}} md={{size: 6, offset: 3}} lg={{size: 4, offset: 4}}>
                    <Col>
                      <Alert color={"danger"} style={{padding: "0px", textAlign: "left"}}>You currently have no bookings</Alert>
                    </Col>
                    <Col>
                      <Button
                        outline
                        size={"sm"}
                        onClick={this.goToSearch}
                      >Click here to search for available vehicles</Button>
                    </Col>
                  </Col>
                )
              }

              return (
                <Mutation
                  mutation={CANCEL_VEHICLE_BOOKING_MUTATION}
                  refetchQueries={[
                    { query: USER_QUERY },
                    { query: VEHICLE_QUERY },
                    { query: VEHICLE_BOOKINGS_QUERY }
                  ]}
                >
                  {(cancelBooking: any, {loading, error}: any) => {
                    if (loading) {
                      return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
                    }
                    return (
                      <>
                        {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                        <Row>
                          {
                            userBookings.map((booking: any) => {
                              return (
                                <CardContainer key={booking.id}>
                                  <Card>
                                    <Row>
                                      <Col sm={12} md={6} lg={5}>
                                        <CardImg src={booking.vehicle.imageURI} alt="Card image cap" />
                                      </Col>
                                      <Col sm={12} md={6} lg={7}>
                                        <CardBody className="text-left">
                                        <CardSubtitle style={{fontWeight: "bold"}}>
                                          {booking.vehicle.size}
                                        </CardSubtitle>
                                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>
                                          {booking.vehicle.name} {booking.vehicle.make}
                                        </CardTitle>
                                        <CardText>Or similar group {booking.vehicle.group} car</CardText>
                                          <hr />
                                          <Button 
                                            outline
                                            disabled={loading}
                                            size={"sm"} 
                                            color={"danger"}
                                            onClick={(e) => this.handleSubmit(e, user, booking, cancelBooking)}
                                          >{selected === booking.id && loading ? "Canceling booking..." : "Cancel booking"}</Button>
                                        </CardBody>
                                      </Col>
                                    </Row>
                                  </Card>
                                </CardContainer>
                              )
                            })
                          }
                        </Row>
                      </>
                    )
                  }}
                </Mutation>
              )
            }}
          </Query>
        </Col>
      </VehicleContainer>
    );
  }
}
