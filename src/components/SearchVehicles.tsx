import React from 'react';
import { Col, Button, Spinner, Form, FormGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, Row, Label, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { SEARCH_VEHICLE_MUTATION } from '../graphql/Mutation';
import moment from 'moment';
import '../css/DatePicker.css'
import Datetime from 'react-datetime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VehicleSearchContainer = styled.div`
`;

const validateVehicleSearchField = (
  bookInput: any
) => {
  // An object to store errors for all fields.
  const errors: any = {};
  
  // Check if pick up date is chosen
  if (!bookInput.location || (bookInput.location && bookInput.location === "Start here. Select a location.")) {
    errors.location = "Pick up location required";
  }

  // Check if pick up date is chosen
  if (!bookInput.pickupDate) {
    errors.pickupDate = "Pick up date required";
  }

  // Check if return date is chosen
  if (!bookInput.returnDate) {
    errors.returnDate = "Return date required";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class SearchVehicles extends React.Component<any, any> {
  public state = {
    errors: {
      responseError: "",
      location: "",
      pickupDate: "",
      returnDate: ""
    },
    dropdownOpen: false,
    location: "Start here. Select a location.",
    searched: false,
    vehicles: [],
    pickupDate: "",
    returnDate: ""
  }

  /**
   * Update the form content according to the user select.
   */
  onInputClick = (
    e: React.FormEvent<EventTarget>
  ) => {
    // Update the location property of the state when input field values change
    this.setState({
      ...this.state,
      location: (e.currentTarget as any).innerText
    });
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

  handleSubmit = async (e: React.FormEvent<EventTarget>, searchVehicles: any) => {
    e.preventDefault();

    const { location, pickupDate, returnDate } = this.state

    // Validate the vehicle search input fields
    const errors: object = validateVehicleSearchField({location, pickupDate, returnDate});
    this.setState({ errors });

    // Check if there is an error, if there is abort searching.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Search for vehicles
      const vehicles = await searchVehicles({
        variables: { location, pickupDate, returnDate }
      });

      this.setState({
        errors: {
          responseError: "",
          location: "",
          pickupDate: "",
          returnDate: ""
        },
        searched: true,
        vehicles: vehicles.data.searchVehicles
      });

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

  toggle = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const { user } = this.props;
    const { errors, location, pickupDate, returnDate, searched, vehicles } = this.state;

    const minPickUpDate: any = moment(Date.now()).format("YYYY-MM-DDTHH:mm")
    const minReturnDate: any = moment(pickupDate).format("YYYY-MM-DDTHH:mm")

    if (searched) {
      return <Redirect to={{
        pathname: "/vehicle-results",
        state: {
          user, 
          vehicles,
          location,
          pickupDate,
          returnDate
        }
      }} />
    }
 
    return (
      <VehicleSearchContainer>
        <Col sm={12} md={12} lg={12}>
          <Mutation
            mutation={SEARCH_VEHICLE_MUTATION}
          >
            {(searchVehicles: any, {loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }

              return (
                <Form style={{ textAlign: "left"}}> 
                  {error && <Alert color={"danger"}>{this.state.errors.responseError}</Alert>}
                  <Card style={{background: "transparent", backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                    <CardBody>
                    <Col sm={12} md={12} lg={{size: 10, offset: 1}}>
                      <FormGroup>
                        <Label for="pickupLocation" style={{color: "white"}}>Pick-up location</Label>
                        <Col sm={12}>
                          <Dropdown size={"sm"} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle size={"sm"} block outline style={{color: "white"}}>
                              {location}
                            </DropdownToggle>
                            <DropdownMenu style={{
                              width: "100%",
                              background: "transparent",
                              backgroundColor: "rgba(0, 0, 0, 1)"
                            }}
                            > 
                              <DropdownItem style={{color: "white", background: "transparent", backgroundColor: "rgba(0, 0, 0, 0.1)"}} onClick={(e) => this.onInputClick(e)}>EMPANGENI</DropdownItem>
                              <DropdownItem style={{color: "white", background: "transparent", backgroundColor: "rgba(0, 0, 0, 0.1)"}} onClick={(e) => this.onInputClick(e)}>RICHARDS_BAY</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          {errors.location && <Alert color={"danger"}>{ errors.location }</Alert>}
                        </Col>
                      </FormGroup>
                      <Row>
                        <Col sm= {12} md={6}>
                          <FormGroup>
                            <Label style={{color: "white"}}>Pick-up date</Label>
                            <Col>
                              <div>
                                <Datetime
                                  inputProps={{
                                    style: {
                                      color: "white",
                                      background: "transparent", 
                                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                                    },
                                  }}
                                  
                                  defaultValue={moment(minPickUpDate).format("YYYY/MM/DD LT")}
                                  isValidDate={(current) => current.isAfter(minPickUpDate)}
                                  dateFormat={"YYYY/MM/DD"}
                                  onChange={(date: any) => this.setState({
                                    pickupDate: moment(date).format("YYYY-MM-DDTHH:mm")
                                  })}
                                />
                              </div>
                              {errors.pickupDate && <Alert color={"danger"}>{ errors.pickupDate }</Alert>}
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col sm= {12} md={6}>
                          <FormGroup>
                            <Label style={{color: "white"}}>Return date</Label>
                            <Col>
                              <div>
                                <Datetime
                                  inputProps={{
                                    style: {
                                      color: "white",
                                      background: "transparent", 
                                      backgroundColor: "rgba(0, 0, 0, 0.2)"
                                    }
                                  }}

                                  defaultValue={moment(minPickUpDate).format("YYYY/MM/DD LT")}
                                  isValidDate={(current) => current.isAfter(minReturnDate)}
                                  dateFormat={"YYYY/MM/DD"}
                                  onChange={(date: any) => this.setState({
                                    returnDate: moment(date).format("YYYY-MM-DDTHH:mm")
                                  })}
                                />
                              </div>
                              {errors.returnDate && <Alert color={"danger"}>{ errors.returnDate }</Alert>}
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Col sm={12} md={{size: 10, offset: 1}} lg={{size: 8, offset: 2}}>
                        <FormGroup>
                          <Button
                            outline
                            size={"sm"}
                            block
                            color={"success"}
                            onClick={(e) => this.handleSubmit(e, searchVehicles)}
                          >{ loading ? "Searching..." : "Search " }{!loading && <FontAwesomeIcon
                            icon="search"
                          />}</Button>
                        </FormGroup>
                      </Col>
                      
                    </Col>
                    </CardBody>
                  </Card>
                </Form>
              )
            }
          }
          </Mutation>
        </Col>
      </VehicleSearchContainer>
    );
  }
}
