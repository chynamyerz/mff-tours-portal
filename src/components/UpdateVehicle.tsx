import React from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Mutation } from 'react-apollo';
import { UPDATE_VEHICLE_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import { VEHICLE_QUERY } from '../graphql/Query';
import { Redirect } from 'react-router-dom';

interface IUpdateVehicleFormInput {
  password: string;
  group?: string;
  size?: string;
  name?: string;
  model?: string;
  make?: string;
  year?: string;
  imageURI?: string;
  status?: string;
  location?: string;
  doors?: string;
  seaters?: string;
  fuelType?: string;
  transmissionType?: string;
  airType?: string;
  bags?: string;
  price?: string;
}

interface IUpdateVehicleState {
  updated: boolean;
  dropdownOpen: boolean;
  errors: Partial<IUpdateVehicleFormInput> & { responseError?: string };
  vehicleInput: IUpdateVehicleFormInput;
};

const validateUpdateVehicleField = (
  updateVehicleInput: IUpdateVehicleFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IUpdateVehicleFormInput> = {};

  // Check if the submitted group is not empty.
  if (!updateVehicleInput.password) {
    errors.password = "Password is required";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class UpdateVehicle extends React.Component<any, IUpdateVehicleState> {
  public state = {
    errors: {
      password: "",
      responseError: ""
    },
    updated: false,
    dropdownOpen: false,
    vehicleInput: {
      group: "",
      size: "",
      name: "",
      model: "",
      make: "",
      year: "",
      imageURI: "",
      status: "",
      location: "Vehicle location",
      doors: "",
      seaters: "",
      fuelType: "",
      transmissionType: "",
      airType: "",
      bags: "",
      price: "",
      password: ""
    }
  };

  handleSubmit = async (e: React.FormEvent<EventTarget>, updateVehicle: any) => {
    e.preventDefault();

    // Validate the vehicle input fields
    const errors: object = validateUpdateVehicleField(this.state.vehicleInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort updating a vehicle.
    if (Object.keys(errors).length > 0) {
      return;
    }

    const { doors, seaters, bags } = this.state.vehicleInput
    const { id } = this.props.vehicle

    try {
      // If all fields are validated, add the vehicle
      const vehicleDetails = { ...this.state.vehicleInput, vehicleId: id, doors: Number(doors), seaters: Number(seaters), bags: Number(bags) };

      await updateVehicle({ variables: vehicleDetails });

      // Update the form according to whether logging in was successful
      this.setState({
        errors: {
          responseError: "",
          password: ""
        },
        updated: true,
        dropdownOpen: false,
        vehicleInput: {
          group: "",
          size: "",
          name: "",
          model: "",
          make: "",
          year: "",
          imageURI: "",
          status: "",
          location: "Vehicle location",
          doors: "",
          seaters: "",
          fuelType: "",
          transmissionType: "",
          airType: "",
          bags: "",
          price: "",
          password: ""
        }
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

  /**
   * Update the form content according to the user input.
   */
  onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    // Update the vehicleInput property of the state when input field values change
    this.setState({
      ...this.state,
      vehicleInput: {
        ...this.state.vehicleInput,
        [name]: value
      }
    });
  };

  /**
   * Update the form content according to the user select.
   */
  onInputClick = (
    e: React.FormEvent<EventTarget>
  ) => {
    // Update the location property of the state when input field values change
    this.setState({
      ...this.state,
      vehicleInput: {
        ...this.state.vehicleInput,
        location: (e.currentTarget as any).innerText
      }
    });
  };

  toggle = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const { user } = this.props;
    const { updated ,errors } = this.state;
    const {
      group,
      size,
      name,
      model,
      make,
      year,
      imageURI,
      status,
      location,
      doors,
      seaters,
      fuelType,
      transmissionType,
      airType,
      bags,
      price,
      password
    } = this.state.vehicleInput;

    if (user && user.role !== "ADMIN") {
      alert("Only admin can add a new vehicle.")
      return <Redirect to="/vehicle-results" />
    }

    return (
      <Mutation 
        mutation={UPDATE_VEHICLE_MUTATION}
        refetchQueries={[
          {query: VEHICLE_QUERY}
        ]}
      >
        { (updateVehicle: any, { loading, error }: any) => {
          return (
            <Form style={{ textAlign: "left"}}>
              {updated && <Alert color={"success"}>Successfully updated vehicle information</Alert>}

              {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}

              <Alert color={"info"}>TO DO UPDATE FORM PROPERLY</Alert>

              <Row>
                <Col sm= {12} md={6}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input 
                      type="text" 
                      name="name"
                      d="name" 
                      placeholder="" 
                      value={name}
                      onChange={this.onInputChange}
                      />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={6}>
                  <FormGroup>
                    <Label for="model">Model</Label>
                    <Input 
                      type="text" 
                      name="model" 
                      id="model" 
                      placeholder="" 
                      value={model}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm= {12} md={6}>
                <FormGroup>
                  <Label for="group">GROUP</Label>
                  <Input 
                    type="text" 
                    name="group" 
                    id="group" 
                    placeholder="e.g. A"
                    value={group}
                    onChange={this.onInputChange}
                  />
                </FormGroup>
                </Col>
                <Col sm= {12} md={6}>
                  <FormGroup>
                    <Label for="size">Size</Label>
                    <Input 
                      type="text" 
                      name="size" 
                      id="size" 
                      placeholder="e.g. SMALL" 
                      value={size}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="doors">Doors</Label>
                    <Input 
                      type="text" 
                      name="doors" 
                      id="doors"
                      placeholder="E.g. 5"
                      value={doors}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="seaters">Seaters</Label>
                    <Input 
                      type="text" 
                      name="seaters" 
                      id="seaters"
                      placeholder="E.g. 9"
                      value={seaters}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="bags">Bags</Label>
                    <Input 
                      type="text" 
                      name="bags" 
                      id="bags"
                      placeholder="E.g. 2"
                      value={bags}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>  
                </Col>
              </Row>
              <Row>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="fuelType">Fuel</Label>
                    <Input 
                      type="text" 
                      name="fuelType" 
                      id="fuelType"
                      placeholder="E.g. Petrol"
                      value={fuelType}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="transmissionType">Transmission</Label>
                    <Input 
                      type="text" 
                      name="transmissionType" 
                      id="transmissionType"
                      placeholder="E.g. Manual"
                      value={transmissionType}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="bags">Air</Label>
                    <Input 
                      type="text" 
                      name="airType" 
                      id="airType"
                      placeholder="E.g. Aircon"
                      value={airType}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>  
                </Col>
              </Row>
              <Row>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="make">Make</Label>
                    <Input 
                      type="text" 
                      name="make" 
                      id="make"
                      value={make}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="year">year</Label>
                    <Input 
                      type="text" 
                      name="year" 
                      id="year"
                      value={year}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input 
                      type="text" 
                      name="status" 
                      id="status"
                      value={status}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>  
                </Col>
              </Row>
              <Row>
                <Col sm= {12} md={4}>
                  <FormGroup>
                      <Label for="location">Location</Label>
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle size={"sm"} block outline>
                          {location}
                        </DropdownToggle>
                        <DropdownMenu> 
                          <DropdownItem onClick={(e) => this.onInputClick(e)}>EMPANGENI</DropdownItem>
                          <DropdownItem onClick={(e) => this.onInputClick(e)}>RICHARDS_BAY</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="price">Price</Label>
                    <Input 
                      type="text" 
                      name="price" 
                      id="price"
                      value={price}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col sm= {12} md={4}>
                  <FormGroup>
                    <Label for="imageURI">Image uri</Label>
                    <Input 
                      type="text" 
                      name="imageURI" 
                      id="imageURI" 
                      placeholder="" 
                      value={imageURI}
                      onChange={this.onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="" 
                  value={password}
                  onChange={this.onInputChange}
                />
                {errors.password && <Error>{ errors.password }</Error>}
              </FormGroup>
              <Button
                outline
                disabled={loading}
                block
                size={"sm"}
                color={'success'}
                onClick={(e) => this.handleSubmit(e, updateVehicle)}
              >{ loading ? "Updating vehicle..." : "Update vehicle" }</Button>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}
