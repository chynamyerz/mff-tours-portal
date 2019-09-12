import React from 'react';
import { Col, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Row, Form, FormGroup, Label, Input, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Mutation } from 'react-apollo';
import { BOOK_VEHICLE_MUTATION } from '../graphql/Mutation';
import { USER_QUERY, VEHICLE_QUERY, VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { Redirect } from 'react-router-dom';
import TermsAndConditions from './TermsAndConditions';
import { validate } from 'isemail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FirstTimeUser from './FirstTimeUser';
import styled from 'styled-components';
import moment from 'moment';
import VehicleDetails from './vehicle/VehicleDetails';

const ClientBookContainer = styled.div`
  @media screen and (max-width: 600px) {
    margin-top: 12%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 6%;
  }

  @media screen and (max-width: 500px) {
    margin-top: 10%;
  }
`;


const validateCarField = (
  bookInput: any
) => {
  // An object to store errors for all fields.
  const errors: any = {};

  // Check if the submitted email address is valid.
  if (!validate(bookInput.email, { minDomainAtoms: 2 })) {
    errors.email = "Email address is invalid";
  }

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
      email: "",
      pickupDate: "",
      returnDate: "",
      responseError: ""
    },
    email: "",
    signed: false,
    booked: false,
    modal: false,
    firstTimeBook: false,
    notFirstTimeBook: false,
    terms: false,
    goToSearch: false,
    pickupDate: "",
    returnDate: "",
  }

  handleSubmit = async (e: React.FormEvent<EventTarget>, user: any, vehicle: any, bookVehicle: any) => {
    e.preventDefault();

    const { pickupDate, returnDate } = this.props
    const { email } = this.state;

    // Validate the user input fields
    const errors: object = validateCarField({email, pickupDate, returnDate});
    this.setState({ errors });

    // Check if there is an error, if there is abort booking.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Book the car
      await bookVehicle({
        variables: { vehicleId: vehicle.id, pickupDate, returnDate, email }
      });

      this.setState({
        booked: true,
        email: "",
        pickupDate: "",
        returnDate: "",
      })

      alert("Booked successfully!");
    } catch (error) {
      this.setState({
        errors: {
          ...this.state.errors,
          responseError: error.message
            .replace("Network error: ", "")
            .replace("GraphQL error: ", "")
        }
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

  toggleFirstTimeBook = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      firstTimeBook: true,
      terms: false,
      notFirstTimeBook: false
    });
  }

  toggleNotFirstTimeBook = () => {
    this.setState({
      ...this.state,
      notFirstTimeBook: true,
      firstTimeBook: false,
      terms: false
    });
  }

  toggleTerms = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      terms: true,
      firstTimeBook: false,
      notFirstTimeBook: false
    });
  }

  render() {
    const { user, vehicle, pickupDate, returnDate } = this.props;
    const { email, firstTimeBook, notFirstTimeBook, goToSearch, booked, signed, terms, errors } = this.state;

    if (goToSearch) {
      return <Redirect to={"/"} />
    }

    if (booked) {
      return (<Redirect to="/" />)
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
    const rands = String(vehicle.price).split(".")[0]
    const cents = String(vehicle.price).split(".")[1]
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
              <ClientBookContainer>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={"lg"}>

                  { firstTimeBook &&
                    <>
                      <ModalHeader toggle={this.toggle}><strong>Let get to know each other.</strong></ModalHeader>
                    
                      <ModalBody>
                        <FirstTimeUser 
                          closeModal={this.toggle} 
                          newEmail={(email: string) => this.setState({email})}
                        />
                      </ModalBody>
                    </>
                  }
                  { terms &&
                    <>
                      <ModalHeader toggle={this.toggle}><strong>MFF Cars Rental Terms and Conditions</strong></ModalHeader>
                    
                      <ModalBody>
                        <TermsAndConditions />
                      </ModalBody>
                    </>
                  }

                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                  </ModalFooter>
                  
                </Modal>
                {error && <Alert color={"danger"}>{this.state.errors.responseError}</Alert>}
                <h3 style={{paddingTop: "8%"}}><strong>Complete the booking</strong></h3>
                <Card>
                  <Row>
                    <Col sm={12} md={6} lg={5}>
                      <CardImg width="100%" src={vehicle.imageURI} alt="MFF TOURS VEHICLE" />
                    </Col>
                    <Col sm={12} md={6} lg={7}>
                      <CardBody className="text-left">
                        <CardSubtitle style={{fontWeight: "bold"}}>
                          {vehicle.size}
                        </CardSubtitle>
                        <CardTitle style={{fontWeight: "bold", fontSize: 20}}>
                          {vehicle.name} {vehicle.make}
                        </CardTitle>
                        <hr />
                        <CardText style={{color: "hsl(0, 0%, 71%)"}}>From: {vehicle.location} {moment(pickupDate).format("YYYY-MM-DD LT")}</CardText>
                        <CardText style={{color: "hsl(0, 0%, 71%)"}}>To: {vehicle.location} {moment(returnDate).format("YYYY-MM-DD LT")}</CardText>
                        <CardText style={{color: "hsl(348, 100%, 61%)"}}>
                          <span style={{fontSize: "1.5em"}}>@ZAR {rands}</span>.<span style={{fontSize: "0.7em"}}>{cents}</span>
                        </CardText>
                        <hr />
                        <VehicleDetails vehicle={vehicle}/>
                        <hr />
                        <Form style={{ textAlign: "left"}}> 
                          <FormGroup>
                            <Row>
                              <Col>
                                <Button 
                                  outline
                                  size={"sm"} 
                                  color={"secondary"}
                                  onClick={this.toggleFirstTimeBook}
                                >First time booking?</Button>
                              </Col>

                              <Col>
                                <Button 
                                  outline
                                  size={"sm"} 
                                  color={"secondary"}
                                  onClick={this.toggleNotFirstTimeBook}
                                >Booked before?</Button>
                              </Col>
                            </Row>
                            
                          </FormGroup>
                          {
                            notFirstTimeBook &&
                            <FormGroup>
                              <Label for="email">
                                <FontAwesomeIcon
                                  icon="envelope"
                                />
                                Please, provide an email address was used when booking previously.
                              </Label>
                              <Input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="e.g. example@mail.com" 
                                value={email}
                                onChange={this.onInputChange}
                              />
                              {errors.email && <Alert color={"danger"}>{ errors.email }</Alert>}
                            </FormGroup>
                          }

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
                                  onClick={this.toggleTerms}
                                >View terms and conditions</Button> <br />
                              </Col>
                            </Row>
                          </FormGroup>
                          <FormGroup>
                            <Button 
                              outline
                              disabled={loading || !signed}
                              size={"sm"} 
                              color={"success"}
                              onClick={(e) => this.handleSubmit(e, user, vehicle, bookVehicle)}
                            >{loading ? "Booking..." : "Book"}</Button>
                          </FormGroup>
                        </Form>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </ClientBookContainer>
            )
          }}
        </Mutation>
      </Col>
    );
  }
}
