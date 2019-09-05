import React from 'react';
import { Col, Button, Spinner, Form, FormGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, Row, Input, Label, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { SEARCH_VEHICLE_MUTATION } from '../graphql/Mutation';
import moment from 'moment';

const VehicleSearchContainer = styled.div`
  margin-top: 10%;
  margin: 5%;
`;

const validateVehicleSearchField = (
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

  // Check if pick up time is set
  if (!bookInput.pickupTime) {
    errors.pickupTime = "What time will you pick it?";
  }

  // Check if return time is set
  if (!bookInput.returnTime) {
    errors.returnTime = "What time will you return it?";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class SearchVehicles extends React.Component<any, any> {
  public state = {
    errors: {
      responseError: "",
      pickupDate: "",
      returnDate: "",
      pickupTime: "",
      returnTime: ""
    },
    date: [new Date(), new Date()],
    dropdownOpen: false,
    location: "ANY LOCATION",
    searched: false,
    vehicles: [],
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: ""
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

  onChange = (date: any) => this.setState({ date })

  handleSubmit = async (e: React.FormEvent<EventTarget>, searchVehicles: any) => {
    e.preventDefault();

    const { location, pickupDate, returnDate, pickupTime, returnTime } = this.state

    console.log((pickupTime))

    // Validate the vehicle search input fields
    const errors: object = validateVehicleSearchField({pickupDate, returnDate, pickupTime, returnTime});
    this.setState({ errors });

    // Check if there is an error, if there is abort searching.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const pickupDateTime = pickupDate.concat(" ", pickupTime)
      const returnDateTime = returnDate.concat(" ", returnTime)
      // Search for vehicles
      const vehicles = await searchVehicles({
        variables: { location, pickupDate: pickupDateTime, returnDate: returnDateTime }
      });

      this.setState({
        errors: {
          responseError: "",
          pickupDate: "",
          returnDate: "",
          pickupTime: "",
          returnTime: ""
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
    const { errors, location, pickupDate, returnDate, searched, vehicles, pickupTime, returnTime } = this.state;

    const minPickUpDate: any = moment(Date.now()).add(1, "day").format("YYYY-MM-DD")
    const minReturnDate: any = moment(pickupDate).add(1, "day").format("YYYY-MM-DD")

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
                  <Card style={{background: "hsl(0, 0%, 96%)"}}>
                    <CardBody>
                    <Col sm={12} md={12} lg={12}>
                      <FormGroup>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                          <DropdownToggle size={"sm"} block outline caret>
                            {location}
                          </DropdownToggle>
                          <DropdownMenu style={{width: "100%"}}> 
                            <DropdownItem onClick={(e) => this.onInputClick(e)}>ANY LOCATION</DropdownItem>
                            <DropdownItem onClick={(e) => this.onInputClick(e)}>EMPANGENI</DropdownItem>
                            <DropdownItem onClick={(e) => this.onInputClick(e)}>RICHARDS_BAY</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                      <Row>
                        <Col sm= {12} md={6}>
                          <FormGroup>
                            <Label for="pickupDate">Pick up date</Label>
                            <Input 
                              style={{textAlign: "center"}}
                              type="date" 
                              name="pickupDate" 
                              id="pickupDate"
                              min={minPickUpDate}
                              value={pickupDate}  
                              onChange={this.onInputChange}
                            />
                            {errors.pickupDate && <Alert color={"danger"}>{ errors.pickupDate }</Alert>}
                          </FormGroup>
                          <FormGroup>
                            <Label for="pickupTime">Pick up time</Label>
                            <Input 
                              style={{width: "50%", textAlign: "center"}}
                              type="time" 
                              name="pickupTime" 
                              id="pickupTime"
                              value={pickupTime}  
                              onChange={this.onInputChange}
                            />
                            {errors.pickupTime && <Alert color={"danger"}>{ errors.pickupTime }</Alert>}
                          </FormGroup>
                        </Col>
                        <Col sm= {12} md={6}>
                          <FormGroup>
                            <Label for="returnDate">Return date</Label>
                            <Input 
                              style={{textAlign: "center"}}
                              disabled={!pickupDate}
                              type="date" 
                              name="returnDate" 
                              id="returnDate" 
                              min={minReturnDate}
                              value={returnDate} 
                              onChange={this.onInputChange}
                            />
                            {errors.returnDate && <Alert color={"danger"}>{ errors.returnDate }</Alert>}
                          </FormGroup>
                          <FormGroup>
                            <Label for="returnTime">Return time</Label>
                            <Input 
                              style={{width: "50%", textAlign: "center"}}
                              type="time" 
                              name="returnTime" 
                              id="returnTime" 
                              value={returnTime} 
                              onChange={this.onInputChange}
                            />
                            {errors.returnTime && <Alert color={"danger"}>{ errors.returnTime }</Alert>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup>
                        <Button
                          outline
                          size={"sm"}
                          block
                          color={"success"}
                          onClick={(e) => this.handleSubmit(e, searchVehicles)}
                        >{ loading ? "Searching..." : "Search" }</Button>
                      </FormGroup>
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
