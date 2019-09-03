import React from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Mutation } from 'react-apollo';
import { ADD_VEHICLE_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import { VEHICLE_QUERY } from '../graphql/Query';
import { Redirect } from 'react-router-dom';

interface IAddVehicleFormInput {
  group: string;
  size: string;
  name: string;
  model: string;
  make: string;
  year: string;
  imageURI: string;
  status: string;
}

interface IAddVehicleState {
  added: boolean;
  errors: Partial<IAddVehicleFormInput> & { responseError?: string };
  vehicleInput: IAddVehicleFormInput;
};

const validateAddVehicleField = (
  addVehicleInput: IAddVehicleFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IAddVehicleFormInput> = {};

  // Check if the submitted group is not empty.
  if (!addVehicleInput.group) {
    errors.group = "Vehicle group is required";
  }

  // Check if the submitted size is not empty.
  if (!addVehicleInput.size) {
    errors.size = "Vehicle size is required";
  }

  // Check if the submitted name is not empty.
  if (!addVehicleInput.name) {
    errors.name = "Vehicle brand name is required";
  }

  // Check if the submitted model is not empty.
  if (!addVehicleInput.model) {
    errors.model = "Vehicle model is required";
  }

  // Check if the submitted make is not empty.
  if (!addVehicleInput.make) {
    errors.make = "Vehicle make is required";
  }

  // Check if the submitted year is not empty.
  if (!addVehicleInput.year) {
    errors.year = "Vehicle year is required";
  }

  // Check if the submitted imageURI is not empty.
  if (!addVehicleInput.imageURI) {
    errors.imageURI = "Vehicle imageURI is required";
  }

  // Check if the submitted status is not empty.
  if (!addVehicleInput.status) {
    errors.status = "Vehicle status is required";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class AddVehicle extends React.Component<any, IAddVehicleState> {
  public state = {
    errors: {
      group: "",
      size: "",
      name: "",
      model: "",
      make: "",
      year: "",
      imageURI: "",
      status: "",
      responseError: ""
    },
    added: false,
    vehicleInput: {
      group: "",
      size: "",
      name: "",
      model: "",
      make: "",
      year: "",
      imageURI: "",
      status: "",
    }
  };

  handleSubmit = async (e: React.FormEvent<EventTarget>, addVehicle: any) => {
    e.preventDefault();

    // Validate the vehicle input fields
    const errors: object = validateAddVehicleField(this.state.vehicleInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort adding a vehicle.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // If all fields are validated, add the vehicle
      const vehicleDetails = { ...this.state.vehicleInput };
      await addVehicle({ variables: vehicleDetails });

      // Update the form according to whether logging in was successful
      this.setState({
        errors: {
          group: "",
          size: "",
          name: "",
          model: "",
          make: "",
          year: "",
          imageURI: "",
          status: "",
          responseError: ""
        },
        added: true,
        vehicleInput: {
          group: "",
          size: "",
          name: "",
          model: "",
          make: "",
          year: "",
          imageURI: "",
          status: "",
        }
      });
      alert("Successfully added vehicle");
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

  render() {
    const { user } = this.props;
    const { added ,errors } = this.state;
    const {
      group,
      size,
      name,
      model,
      make,
      year,
      imageURI,
      status,
    } = this.state.vehicleInput;

    if (user && user.role !== "ADMIN") {
      alert("Only admin can add a new vehicle.")
      return <Redirect to="/vehicle-results" />
    }

    if (added) {
      return <Redirect to="/vehicle-results" />
    }

    return (
      <Mutation 
        mutation={ADD_VEHICLE_MUTATION}
        refetchQueries={[
          {query: VEHICLE_QUERY}
        ]}
      >
        { (addVehicle: any, { loading, error }: any) => {
          return (
            <Form style={{ textAlign: "left"}}>
              {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}
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
                      {errors.name && <Error>{ errors.name }</Error>}
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
                    {errors.model && <Error>{ errors.model }</Error>}
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
                  {errors.group && <Error>{ errors.group }</Error>}
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
                    {errors.size && <Error>{ errors.size }</Error>}
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
                    {errors.make && <Error>{ errors.make }</Error>}
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
                    {errors.year && <Error>{ errors.year }</Error>}
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
                    {errors.status && <Error>{ errors.status }</Error>}
                  </FormGroup>  
                </Col>
              </Row>
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
                {errors.imageURI && <Error>{ errors.imageURI }</Error>}
              </FormGroup>
              <Button
                outline
                disabled={loading}
                block
                size={"sm"}
                color={'success'}
                onClick={(e) => this.handleSubmit(e, addVehicle)}
              >{ loading ? "Adding vehicle..." : "Add vehicle" }</Button>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}
