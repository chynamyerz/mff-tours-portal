import React from 'react';
import { Col, Button, Spinner, Form, FormGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';
import { SEARCH_VEHICLE_MUTATION } from '../graphql/Mutation';

const VehicleSearchContainer = styled.div`
  margin-top: 10%;
  margin: 5%;
`;

export default class SearchVehicles extends React.Component<any, any> {
  public state = {
    errors: {
      responseError: "",
    },
    dropdownOpen: false,
    location: "ANY LOCATION",
    searched: false,
    vehicles: []
  }

  /**
   * Update the form content according to the user input.
   */
  onInputChange = (
    e: React.FormEvent<EventTarget>
  ) => {
    // Update the location property of the state when input field values change
    this.setState({
      ...this.state,
      location: (e.currentTarget as any).innerText
    });
  };

  handleSubmit = async (e: React.FormEvent<EventTarget>, searchVehicles: any) => {
    e.preventDefault();

    try {
      // Search for vehicles
      const vehicles = await searchVehicles({
        variables: { location: this.state.location }
      });

      this.setState({
        errors: {
          responseError: ""
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
    const { location, searched, vehicles } = this.state;

    if (user && (user.role === "ADMIN")) {
      return <Redirect to={{
        pathname: "/manage-vehicle",
        state: {
          user
        }
      }} />
    }

    if (searched) {
      return <Redirect to={{
        pathname: "/vehicle-results",
        state: {
          user, 
          vehicles,
          location
        }
      }} />
    }
 
    return (
      <VehicleSearchContainer>
        <Col sm={12} md={12} lg={{size: 8, offset: 2}}>
          <Mutation
            mutation={SEARCH_VEHICLE_MUTATION}
          >
            {(searchVehicles: any, {loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }

              return (
                <Form style={{ textAlign: "left"}}> 
                  {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}
                  <Card style={{background: "hsl(0, 0%, 96%)"}}>
                    <CardBody>
                    <Col sm={12} md={{size: 10, offset: 1}} lg={{size: 10, offset: 1}}>
                      <FormGroup>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                          <DropdownToggle size={"sm"} block outline caret>
                            {location}
                          </DropdownToggle>
                          <DropdownMenu style={{width: "100%"}}> 
                            <DropdownItem onClick={(e) => this.onInputChange(e)}>ANY LOCATION</DropdownItem>
                            <DropdownItem onClick={(e) => this.onInputChange(e)}>EMPANGENI</DropdownItem>
                            <DropdownItem onClick={(e) => this.onInputChange(e)}>RICHARDS_BAY</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
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
