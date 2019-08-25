import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import moment from "moment";
import { Mutation } from 'react-apollo';
import { BOOK_VEHICLE_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router';
import { Error } from './util/Error';

const validateCarField = (
  bookInput: any
) => {
  // An object to store errors for all fields.
  const errors: any = {};

  // Check if pick up date is chosen
  if (!bookInput.pickupDate) {
    errors.pickupDate = "Please choose pick up date";
  }

  // Check if return date is chosen
  if (!bookInput.returnDate) {
    errors.returnDate = "Please choose return date";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class ClientBook extends React.Component<any, {}> {
  public state = {
    errors: {
      pickupDate: "",
      returnDate: ""
    },
    booked: false,
    pickupDate: "",
    returnDate: "",
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, user: any, vehicle: any, bookVehicle: any) => {
    e.preventDefault();

    const { pickupDate, returnDate } = this.state

    // Validate the user input fields
    const errors: object = validateCarField({pickupDate, returnDate});
    this.setState({ errors });

    // Check if there is an error, if there is abort booking.
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!user) {
      alert("You must be logged in to book")
      return;
    }

    try {
      // Book the car
      await bookVehicle({
        variables: { vehicleId: vehicle.id, pickupDate, returnDate }
      });

      this.setState({
        booked: true,
        pickupDate: "",
        returnDate: "",
      })

      alert("Booked successfully!");
    } catch (error) {
      alert("Something went wrong, please try again later.")
    }
  };

  /**
   * Update the form content according to the user input.
   */
  onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    // Update the userInput property of the state when input field values change
    this.setState({
      ...this.state,
      [name]: value
    });
  };

  render() {
    if (this.state.booked) {
      return (<Redirect to="/bookings" />)
    }

    const { user, vehicle } = this.props;
    const { errors } = this.state;

    const minDate: any = moment(Date.now()).add(1, "day").format("YYYY-MM-DD")
 
    return (
      <Col sm="12" md="12" lg="12">
        <Mutation
          mutation={BOOK_VEHICLE_MUTATION}
          refetchQueries={[
            { query: USER_QUERY },
            { query: VEHICLE_BOOKINGS_QUERY },
            { query: VEHICLE_QUERY }
          ]}
        >
          {(bookVehicle: any, {loading, error}: any) => {
            if (loading) {
              return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
            }
            return (
              <>
                {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                <Row>
                  <Col sm={12} md={{size: 8, offset: 2}} lg={{ size: 10, offset: 1}}>
                    <Card>
                      <CardImg top width="400px" height="300px" src={require(`../${vehicle.imageURI}`)} alt="Card image cap" />
                      <CardBody className="text-left">
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>{vehicle.name}</CardTitle>
                        <CardSubtitle style={{fontWeight: "bold"}}>{vehicle.model} | {vehicle.make} | {moment(vehicle.year).format("YYYY-MM-DD")}</CardSubtitle>
                        <hr />
                        <CardText>Car details</CardText>
                        <hr />
                        <Form style={{ textAlign: "left"}}> 
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="pickupDate">Pick up date</Label>
                                <Input 
                                  type="date" 
                                  name="pickupDate" 
                                  id="pickupDate"
                                  min={minDate}  
                                  onChange={this.onInputChange}
                                />
                                {errors.pickupDate && <Error>{ errors.pickupDate }</Error>}
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="returnDate">Return date</Label>
                                <Input 
                                  type="date" 
                                  name="returnDate" 
                                  id="returnDate" 
                                  min={minDate} 
                                  onChange={this.onInputChange}
                                />
                                {errors.returnDate && <Error>{ errors.returnDate }</Error>}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Button 
                            disabled={loading}
                            size={"sm"} 
                            color={"success"}
                            onClick={(e) => this.handleSubmit(e, user, vehicle, bookVehicle)}
                          >{loading ? "Booking..." : "Book"}</Button>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            )
          }}
        </Mutation>
      </Col>
    );
  }
}
