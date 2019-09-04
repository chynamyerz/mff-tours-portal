import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Form, FormGroup, Label, Input, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from "moment";
import { Mutation } from 'react-apollo';
import { BOOK_VEHICLE_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';
import TermsAndConditions from './TermsAndConditions';

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

export default class ClientBook extends React.Component<any, any> {
  public state = {
    errors: {
      pickupDate: "",
      returnDate: ""
    },
    signed: false,
    booked: false,
    modal: false,
    goToSearch: false,
    pickupDate: "",
    returnDate: "",
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, user: any, vehicle: any, bookVehicle: any) => {
    e.preventDefault();

    const { pickupDate, returnDate } = this.props.location.state

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
    if (name === "signed") {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        signed: !this.state.signed
      });
    } else {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        [name]: value
      });
    }
  };

  goToSearch = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      goToSearch: true,
    }))
  }

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  render() {
    const { user, vehicle } = this.props;
    const { goToSearch, booked, signed } = this.state;

    if (goToSearch) {
      return <Redirect to={"/"} />
    }

    if (booked) {
      return (<Redirect to="/bookings" />)
    }

    if (!Object.keys(vehicle).length) {
      return (
        <>
          <Alert color={"danger"}>Something doesn't seem right.</Alert>
          <Button
            outline
            size={"sm"}
            onClick={this.goToSearch}
          >Click here to search for available vehicles</Button>
        </>
      )
    }
 
    return (
      <Col sm={12} md={12} lg={{size: 8, offset: 2}}>
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
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={"lg"}>

                    <ModalHeader toggle={this.toggle}><strong>MFF Cars Rental Terms and Conditions</strong></ModalHeader>
                    
                    <ModalBody>
                      <TermsAndConditions />
                    </ModalBody>

                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    
                  </Modal>
                {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                <Card>
                  <Row>
                    <Col sm={12} md={6} lg={5}>
                      <CardImg width="100%" src={vehicle.imageURI} alt="MFF TOURS VEHICLE" />
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                      <CardBody className="text-left">
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>{vehicle.name}</CardTitle>
                        <CardSubtitle style={{fontWeight: "bold"}}>{vehicle.model} | {vehicle.make} | {moment(vehicle.year).format("YYYY-MM-DD")}</CardSubtitle>
                        <hr />
                        <CardText>Car details</CardText>
                        <hr />
                        <Form style={{ textAlign: "left"}}> 
                          <FormGroup check>
                            <Row>
                              <Col>
                                <Label for="returnDate" check>
                                  <Input 
                                    checked={signed}
                                    name="signed" 
                                    id="signed" 
                                    type="checkbox" 
                                    onChange={this.onInputChange}
                                  />{'  '}
                                  Agree
                                </Label>
                              </Col>

                              <Col>
                                <Button
                                  style={{ padding: 0 }}
                                  color={"link"}
                                  onClick={this.toggle}
                                >View terms and conditions</Button> <br />
                              </Col>
                            </Row>
                          </FormGroup>

                          <Button 
                            outline
                            disabled={loading || !signed}
                            size={"sm"} 
                            color={"success"}
                            onClick={(e) => this.handleSubmit(e, user, vehicle, bookVehicle)}
                          >{loading ? "Booking..." : "Book"}</Button>
                        </Form>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </>
            )
          }}
        </Mutation>
      </Col>
    );
  }
}
