import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from "moment";
import { Mutation } from 'react-apollo';
import { BOOK_VEHICLE_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import AddUser from './AddUser';
import { validate } from 'isemail';

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

  // Check if the submitted email address is valid.
  if (!validate(bookInput.email1, { minDomainAtoms: 2 })) {
    errors.email1 = "Email address is invalid";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class UserBook extends React.Component<any, {}> {
  public state = {
    booked: false,
    errors: {
      pickupDate: "",
      returnDate: "",
      email1: "",
    },
    email1: "",
    modal: false,
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, user: any, vehicle: any, bookVehicle: any) => {
    e.preventDefault();

    const { email1 } = this.state
    const { pickupDate, returnDate } = this.props

    // Validate the user input fields
    const errors: object = validateCarField({email1, pickupDate, returnDate});
    this.setState({ errors });

    // Check if there is an error, if there is abort booking.
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!user) {
      alert("You must be logged in as an admin to book for a client")
      return;
    }

    try {
      // Book the car
      await bookVehicle({
        variables: { email: email1, vehicleId: vehicle.id, pickupDate, returnDate }
      });

      this.setState({
        booked: true,
        email1: "",
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

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  render() {
    const { user, vehicle } = this.props;
    const { email1, errors } = this.state;
 
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
            return (
              <>
                <div>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}><strong>Add a new client</strong></ModalHeader>
                    <ModalBody>
                      <AddUser 
                        closeModal={this.toggle} 
                        newEmail={(email1: string) => this.setState({email1})}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </div>
                {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                <div style={{textAlign: "left", marginBottom: "2%"}}>
                  <Button
                    outline
                    size={"sm"} 
                    color={"info"}
                    onClick={this.toggle}
                  >
                    Booking for a new client?
                  </Button>
                </div>
                <Card style={{marginBottom: "2%"}}>
                  <Row>
                    <Col sm={12} md={6} lg={5}>
                      <CardImg width="100%" src={vehicle.imageURI} alt="Card image cap" />
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                      <CardBody className="text-left">
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>{vehicle.name}</CardTitle>
                        <CardSubtitle style={{fontWeight: "bold"}}>{vehicle.model} | {vehicle.make} | {moment(vehicle.year).format("YYYY-MM-DD")}</CardSubtitle>
                        <hr />
                        <CardText>Car details</CardText>
                        <hr />
                        <Form style={{ textAlign: "left"}}> 
                          <Row>
                            <Col>
                              <FormGroup>
                                <Label for="email1">Email address</Label>
                                <Input 
                                  type="text" 
                                  name="email1" 
                                  id="email1" 
                                  placeholder="e.g smith@gmail.com"
                                  value={email1}
                                  onChange={this.onInputChange}
                                />
                                {errors.email1 && <Error>{ errors.email1 }</Error>}
                              </FormGroup>
                            </Col>
                          </Row>
                          <Button 
                            outline
                            disabled={loading}
                            block
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
