import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import moment from "moment";
import { Mutation } from 'react-apollo';
import { BOOK_VEHICLE_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import AddUser from './AddUser';
import { validate } from 'isemail';
import styled from 'styled-components';
import VehicleDetails from './vehicle/VehicleDetails';
import { Redirect } from 'react-router-dom';
import Checkout from './Checkout';

const UserBookContainer = styled.div`
  margin-top: 8%;
  margin-bottom: 3%;

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
      responseError: "",
      pickupDate: "",
      returnDate: "",
      email1: "",
    },
    book: false,
    addNewClient: false,
    goToSearch: false,
    beyondKZN: false,
    email1: "",
    modal: false,
  }

  handleBookVehicle = async (bookVehicle: any) => {
    const vehicle = JSON.parse((localStorage as any).getItem('vehicle'))
    const pickupDate = JSON.parse((localStorage as any).getItem('pickupDate'))
    const returnDate = JSON.parse((localStorage as any).getItem('returnDate'))
    const beyondKZN = JSON.parse((localStorage as any).getItem('beyondKZN'))
    const email = JSON.parse((localStorage as any).getItem('email'))

    try {
      // Book the car
      await bookVehicle({
        variables: { beyondKZN, vehicleId: vehicle.id, pickupDate, returnDate, email }
      });

      localStorage.removeItem('vehicle')
      localStorage.removeItem('pickupDate')
      localStorage.removeItem('returnDate')
      localStorage.removeItem('beyondKZN')
      localStorage.removeItem('email')
      localStorage.removeItem('user')

      this.setState({
        booked: true
      })

    } catch (error) {
      this.setState({
        ...this.state,
        responseError: error.message
          .replace("Network error: ", "")
          .replace("GraphQL error: ", "")
      });
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
    if (name === "beyondKZN") {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        beyondKZN: !this.state.beyondKZN
      });
    } else {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        [name]: value
      });
    }
  };

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  toggleForAddNewClient = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      addNewClient: true,
      book: false,
    });
  }

  goToSearch = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      goToSearch: true
    }))
  }


  toggleBook = () => {
    if (JSON.parse((localStorage as any).getItem('vehicle')) && Object.keys(JSON.parse((localStorage as any).getItem('vehicle'))).length) {
      const pickupDate = JSON.parse((localStorage as any).getItem('pickupDate'))
      const returnDate = JSON.parse((localStorage as any).getItem('returnDate'))
      const { email1 } = this.state;

      // Validate the user input fields
      const errors: object = validateCarField({email1, pickupDate, returnDate});
      this.setState({ errors });

      // Check if there is an error, if there is abort booking.
      if (Object.keys(errors).length > 0) {
        return;
      }

      this.setState({
        ...this.state,
        errors: {
          email1: "",
          pickupDate: "",
          returnDate: "",
          responseError: ""
        },
        modal: !this.state.modal,
        book: true,
        addNewClient: false
      });
    } else {
      const { pickupDate, returnDate } = this.props
      const { email1 } = this.state;

      // Validate the user input fields
      const errors: object = validateCarField({email1, pickupDate, returnDate});
      this.setState({ errors });

      // Check if there is an error, if there is abort booking.
      if (Object.keys(errors).length > 0) {
        return;
      }

      this.setState({
        ...this.state,
        errors: {
          email1: "",
          pickupDate: "",
          returnDate: "",
          responseError: ""
        },
        modal: !this.state.modal,
        book: true,
      });
    }
  }


  render() {
    let { user, vehicle, pickupDate, returnDate, success } = this.props;
    let { beyondKZN } = this.state
    const { addNewClient, book, booked, email1, errors, goToSearch } = this.state;

    let rands = beyondKZN ? "2000" : String(vehicle.price).split(".")[0]
    let cents = String(vehicle.price).split(".")[1]

    if (goToSearch) {
      return <Redirect to={"/"} />
    }

    if (booked) {
      return <>
        <Alert color={"success"}>Booked successfully!</Alert>
        <Button
          outline
          color={"info"}
          size={"sm"}
          onClick={this.goToSearch}
        >Done</Button>
      </>
    }

    if (!Object.keys(vehicle).length && document.referrer && !document.referrer.includes("payfast")) {
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

    if (JSON.parse((localStorage as any).getItem('vehicle')) && Object.keys(JSON.parse((localStorage as any).getItem('vehicle'))).length) {
      pickupDate = JSON.parse((localStorage as any).getItem('pickupDate'))
      returnDate = JSON.parse((localStorage as any).getItem('returnDate'))
      vehicle = JSON.parse((localStorage as any).getItem('vehicle'))
      beyondKZN = JSON.parse((localStorage as any).getItem('beyondKZN'))

      rands = beyondKZN ? "2000" : String(vehicle.price).split(".")[0]
      cents = String(vehicle.price).split(".")[1]
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
            if (document.referrer && document.referrer.includes("payfast") && success) {
              return <Col>
                <h3><strong>You are nearly done...</strong></h3>
                <Button 
                  style={{marginTop: "25%"}}
                  outline
                  disabled={loading}
                  size={"sm"} 
                  color={"success"}
                  onClick={() => this.handleBookVehicle(bookVehicle)}
                ><strong>Click here to complete your booking</strong></Button>
              </Col>
            }

            return (
              <UserBookContainer>
                <div>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    { book &&
                      <>
                        <ModalHeader toggle={this.toggle}><strong>Checkout.</strong></ModalHeader>
                      
                        <ModalBody>
                          <Checkout 
                            user={user} 
                            vehicle={vehicle} 
                            beyondKZN={beyondKZN} 
                            pickupDate={pickupDate}
                            returnDate={returnDate} 
                            email={email1}
                          />
                        </ModalBody>
                      </>
                    }
                    {addNewClient && 
                      <>
                        <ModalHeader toggle={this.toggle}><strong>Add a new client</strong></ModalHeader>
                        <ModalBody>
                          <AddUser 
                            closeModal={this.toggle} 
                            newEmail={(email1: string) => this.setState({email1})}
                          />
                        </ModalBody>
                      </>
                    }
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
                    onClick={this.toggleForAddNewClient}
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
                      <Form style={{ textAlign: "left"}}> 
                        <CardBody className="text-left">
                          <CardSubtitle style={{fontWeight: "bold"}}>
                            {vehicle.size}
                          </CardSubtitle>
                          <CardTitle style={{fontWeight: "bold", fontSize: 20}}>
                            {vehicle.name} {vehicle.make}
                          </CardTitle>
                          <hr />
                          <CardText style={{color: "hsl(0, 0%, 71%)"}}>From: {vehicle.location} {moment(pickupDate).format("YYYY-MM-DD LT")}</CardText>
                          <CardText style={{color: "hsl(0, 0%, 71%)"}}>Return: {vehicle.location} {moment(returnDate).format("YYYY-MM-DD LT")}</CardText>
                          <CardText style={{color: "hsl(348, 100%, 61%)"}}>
                            <span style={{fontSize: "1.5em"}}>@ZAR {rands}</span>.<span style={{fontSize: "0.7em"}}>{cents}</span>
                          </CardText>
                          {vehicle.transmissionType === "Manual" &&
                            <FormGroup check>
                              <Label check>
                                <Input 
                                  type="checkbox" 
                                  name="beyondKZN" 
                                  id="beyondKZN"
                                  checked={beyondKZN}
                                  onChange={this.onInputChange}
                                />{' '}
                                Is your destination outside of Kwa-Zulu Natal?
                              </Label>
                            </FormGroup>
                          }
                          <hr />
                            <VehicleDetails vehicle={vehicle}/>
                          <hr />
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
                              size={"sm"} 
                              color={"success"}
                              onClick={this.toggleBook}
                            >{"Checkout"}</Button>
                        </CardBody>
                      </Form>
                    </Col>
                  </Row>
                </Card>
              </UserBookContainer>
            )
          }}
        </Mutation>
      </Col>
    );
  }
}
