import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Spinner } from 'reactstrap';
import styled from 'styled-components';
import moment from "moment";
import { Mutation, Query } from 'react-apollo';
import { CANCEL_VEHICLE_BOOKING_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';

const CarsContainer = styled.div`
  margin: 3%;
`;

const CardContainer = styled.div`
  margin-bottom: 5%;
`;

export default class Bookings extends React.Component<any, {}> {
  public state = {
    cancelled: false,
    selected: ""
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

  render() {

    const { user } = this.props;
    const { selected } = this.state;
 
    return (
      <CarsContainer>
        <Col sm="12" md="12" lg="12">
          <Query
            query={VEHICLE_BOOKINGS_QUERY}
          >
            {({data, loading}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }

              const bookings: any = data && data.bookings ? data.bookings.filter((booking: any) => (booking.status === "BOOKED")) : [];

              if (!bookings.length) {
                return (<p>No bookings</p>)
              }

              const userBookings: any = bookings.filter((booking: any) => (booking.user.id === user.id))

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
                                        <CardImg width="100%" src={require(`../${booking.vehicle.imageURI}`)} alt="Card image cap" />
                                      </Col>
                                      <Col sm={12} md={6} lg={7}>
                                        <CardBody className="text-left">
                                          <CardTitle style={{fontWeight: "bold", fontSize: 20}}>{booking.vehicle.name}</CardTitle>
                                          <CardSubtitle style={{fontWeight: "bold"}}>{booking.vehicle.model} | {booking.vehicle.make} | {moment(booking.vehicle.year).format("YYYY-MM-DD")}</CardSubtitle>
                                          <CardText>More car details</CardText>
                                          <hr />
                                          <Button 
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
      </CarsContainer>
    );
  }
}
