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
import Checkout from './Checkout';

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
    beyondKZN: false,
    email: "",
    signed: false,
    book: false,
    booked: false,
    modal: false,
    firstTimeBook: false,
    notFirstTimeBook: false,
    terms: false,
    goToSearch: false,
    pickupDate: '',
    returnDate: '',
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
    } else if (name === "signed") {
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
      goToSearch: true
    }))
  }

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  toggleBook = () => {
    if (JSON.parse((localStorage as any).getItem('vehicle')) && Object.keys(JSON.parse((localStorage as any).getItem('vehicle'))).length) {
      const pickupDate = JSON.parse((localStorage as any).getItem('pickupDate'))
      const returnDate = JSON.parse((localStorage as any).getItem('returnDate'))
      const { email } = this.state;

      // Validate the user input fields
      const errors: object = validateCarField({email, pickupDate, returnDate});
      this.setState({ errors });

      // Check if there is an error, if there is abort booking.
      if (Object.keys(errors).length > 0) {
        return;
      }

      this.setState({
        ...this.state,
        errors: {
          email: "",
          pickupDate: "",
          returnDate: "",
          responseError: ""
        },
        modal: !this.state.modal,
        book: true,
        firstTimeBook: false,
        terms: false,
        notFirstTimeBook: false
      });
    } else {
      const { pickupDate, returnDate } = this.props
      const { email } = this.state;

      // Validate the user input fields
      const errors: object = validateCarField({email, pickupDate, returnDate});
      this.setState({ errors });

      // Check if there is an error, if there is abort booking.
      if (Object.keys(errors).length > 0) {
        return;
      }

      this.setState({
        ...this.state,
        errors: {
          email: "",
          pickupDate: "",
          returnDate: "",
          responseError: ""
        },
        modal: !this.state.modal,
        book: true,
        firstTimeBook: false,
        terms: false,
        notFirstTimeBook: false
      });
    }
  }

  toggleFirstTimeBook = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      firstTimeBook: true,
      book: false,
      terms: false,
      notFirstTimeBook: false
    });
  }

  toggleNotFirstTimeBook = () => {
    this.setState({
      ...this.state,
      notFirstTimeBook: true,
      firstTimeBook: false,
      book: false,
      terms: false
    });
  }

  toggleTerms = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      terms: true,
      firstTimeBook: false,
      notFirstTimeBook: false,
      book: false
    });
  }

  render() {
    let { user, vehicle, pickupDate, returnDate, success } = this.props;
    let { beyondKZN } = this.state
    const { booked, book, email, firstTimeBook, notFirstTimeBook, goToSearch, signed, terms, errors } = this.state;
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
            if (loading) {
              return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
            }

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
              <ClientBookContainer>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={"lg"}>

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
                          email={email}
                        />
                      </ModalBody>
                    </>
                  }

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
                            <br />
                            {!notFirstTimeBook && errors.email && <Alert color={"danger"}>{errors.email}</Alert>}
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
                                <Label for="signed" check>
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
                              onClick={this.toggleBook}
                            >{"Checkout"}</Button>
                          </FormGroup>
                        </CardBody>
                      </Form>
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
