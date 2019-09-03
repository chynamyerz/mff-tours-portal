import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Mutation } from 'react-apollo';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import { VEHICLE_QUERY } from '../graphql/Query';
import { Redirect } from 'react-router-dom';
import { DELETE_VEHICLE_MUTATION } from '../graphql/Mutation';

interface IDeleteVehicleFormInput {
  password: string;
}

interface IDeleteVehicleState {
  deleted: boolean;
  errors: Partial<IDeleteVehicleFormInput> & { responseError?: string };
  vehicleInput: IDeleteVehicleFormInput;
};

const validateDeleteVehicleField = (
  deleteVehicleInput: IDeleteVehicleFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IDeleteVehicleFormInput> = {};

  // Check if the submitted group is not empty.
  if (!deleteVehicleInput.password) {
    errors.password = "Password is required";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class DeleteVehicle extends React.Component<any, IDeleteVehicleState> {
  public state = {
    errors: {
      password: "",
      responseError: ""
    },
    deleted: false,
    vehicleInput: {
      password: ""
    }
  };

  handleSubmit = async (e: React.FormEvent<EventTarget>, deleteVehicle: any) => {
    e.preventDefault();

    // Validate the vehicle input fields
    const errors: object = validateDeleteVehicleField(this.state.vehicleInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort updating a vehicle.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // If all fields are validated, add the vehicle
      const vehicleDetails = { ...this.state.vehicleInput, vehicleId: this.props.vehicle.id  };
      await deleteVehicle({ variables: vehicleDetails });

      // Delete the form according to whether logging in was successful
      this.setState({
        errors: {
          responseError: "",
          password: ""
        },
        deleted: true,
        vehicleInput: {
          password: ""
        }
      });
      alert("Successfully deleted vehicle information");
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
   * Delete the form content according to the user input.
   */
  onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    // Delete the vehicleInput property of the state when input field values change
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
    const { deleted ,errors } = this.state;
    const {
      password
    } = this.state.vehicleInput;

    if (user && user.role !== "ADMIN") {
      alert("Only admin can delete a vehicle.")
      return <Redirect to="/vehicle-results" />
    }

    if (deleted) {
      return <Redirect to="/vehicle-results" />
    }

    return (
      <Mutation 
        mutation={DELETE_VEHICLE_MUTATION}
        refetchQueries={[
          {query: VEHICLE_QUERY}
        ]}
      >
        { (deleteVehicle: any, { loading, error }: any) => {
          return (
            <Form style={{ textAlign: "left"}}>
              {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}                
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
                onClick={(e) => this.handleSubmit(e, deleteVehicle)}
              >{ loading ? "Deleting vehicle..." : "Delete vehicle" }</Button>
            </Form>
          )
        }}
      </Mutation>
    );
  }
}
