import React from 'react';
import { validate } from "isemail";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { SIGNUP_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';

interface ISignupFormInput {
  email: string;
  name: string;
  surname: string;
  contact: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  password: string;
  confirmPassword: string;
}
interface ISignupState {
  added: boolean;
  errors: Partial<ISignupFormInput> & { responseError?: string };
  newUserEmail: string;
  userInput: Partial<ISignupFormInput>;
};

const SignupContainer = styled.div`
  margin: 0;
`;

const validateSignupField = (
  signUpInput: ISignupFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<ISignupFormInput> = {};

  // Check if the submitted name is not empty.
  if (!signUpInput.name) {
    errors.name = "Name is required";
  }

  // Check if the submitted surname is not empty.
  if (!signUpInput.surname) {
    errors.surname = "Surname is required";
  }

  // Check if the submitted email address is valid.
  if (!validate(signUpInput.email, { minDomainAtoms: 2 })) {
    errors.email = "Email address is invalid";
  }

  // Check if the submitted contact number is not empty.
  if (!signUpInput.contact) {
    errors.contact = "Contact number is required";
  }

  // Check if the password is secure enough.
  if (signUpInput.password.length < 5) {
    errors.password = "Password should be at least 5 characters long";
  }

  // Check if passwords match
  if (signUpInput.password !== signUpInput.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};

export default class AddUser extends React.Component<any, ISignupState> {
  public state = {
    added: false,
    errors: {
      email: "",
      name: "",
      surname: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      password: "",
      confirmPassword: "",
      responseError: ""
    },
    newUserEmail: "",
    userInput: {
      email: "",
      name: "",
      surname: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      password: "12345",
      confirmPassword: "12345"
    }
  };

  handleSubmit = async (e: React.FormEvent<EventTarget>, signup: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors: object = validateSignupField(this.state.userInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // If all fields are validated, sign up
      const userDetails = { ...this.state.userInput };
      delete userDetails.confirmPassword;
      await signup({ variables: userDetails });

      // Update the form according to whether logging in was successful
      this.setState({
        added: true,
        errors: {
          email: "",
          name: "",
          surname: "",
          contact: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          password: "",
          confirmPassword: "",
          responseError: ""
        },
        newUserEmail: userDetails.email,
        userInput: {
          email: "",
          name: "",
          surname: "",
          contact: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          password: "12345",
          confirmPassword: "12345"
        }
      });
      this.props.closeModal()
      if (window.location.pathname === "admin-vehicle-booking") {
        this.props.newEmail(this.state.newUserEmail)
      }
      alert("Successfully added client information.");
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
    
    // Update the userInput property of the state when input field values change
    this.setState({
      ...this.state,
      userInput: {
        ...this.state.userInput,
        [name]: value
      }
    });
  };

  render() {
    const { errors } = this.state;
    const {
      email,
      name,
      surname,
      contact,
      address,
      city,
      state,
      zip,
      password,
      confirmPassword,
    } = this.state.userInput;

    return (
      <SignupContainer>
        <Col>
        <Mutation mutation={SIGNUP_MUTATION}>
          { (signup: any, { loading, error }: any) => {
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
                      <Label for="surname">Surname</Label>
                      <Input 
                        type="text" 
                        name="surname" 
                        id="surname" 
                        placeholder="" 
                        value={surname}
                        onChange={this.onInputChange}
                      />
                      {errors.surname && <Error>{ errors.surname }</Error>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm= {12} md={6}>
                  <FormGroup>
                    <Label for="email">Email address</Label>
                    <Input 
                      type="text" 
                      name="email" 
                      id="email" 
                      placeholder="e.g smith@gmail.com"
                      value={email}
                      onChange={this.onInputChange}
                    />
                    {errors.email && <Error>{ errors.email }</Error>}
                  </FormGroup>
                  </Col>
                  <Col sm= {12} md={6}>
                    <FormGroup>
                      <Label for="contact">Contact number</Label>
                      <Input 
                        type="text" 
                        name="contact" 
                        id="contact" 
                        placeholder="" 
                        value={contact}
                        onChange={this.onInputChange}
                      />
                      {errors.contact && <Error>{ errors.contact }</Error>}
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="exampleAddress">Address</Label>
                  <Input
                    ype="text" 
                    name="address" 
                    id="exampleAddress" 
                    placeholder="1234 Main St"
                    value={address}
                    onChange={this.onInputChange}
                  />
                  {errors.address && <Error>{ errors.address }</Error>}
                </FormGroup>
                <Row>
                  <Col sm= {12} md={4}>
                    <FormGroup>
                      <Label for="exampleCity">City</Label>
                      <Input 
                        type="text" 
                        name="city" 
                        id="exampleCity"
                        value={city}
                        onChange={this.onInputChange}
                      />
                      {errors.city && <Error>{ errors.city }</Error>}
                    </FormGroup>
                  </Col>
                  <Col sm= {12} md={4}>
                    <FormGroup>
                      <Label for="exampleState">State</Label>
                      <Input 
                        type="text" 
                        name="state" 
                        id="exampleState"
                        value={state}
                        onChange={this.onInputChange}
                      />
                      {errors.state && <Error>{ errors.state }</Error>}
                    </FormGroup>
                  </Col>
                  <Col sm= {12} md={4}>
                    <FormGroup>
                      <Label for="exampleZip">Zip</Label>
                      <Input 
                        type="text" 
                        name="zip" 
                        id="exampleZip"
                        value={zip}
                        onChange={this.onInputChange}
                      />
                      {errors.zip && <Error>{ errors.zip }</Error>}
                    </FormGroup>  
                  </Col>
                </Row>
                <Row>
                  <Col sm= {12} md={6}>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Must be 5 characters long" 
                        value={password}
                        onChange={this.onInputChange}
                      />
                      {errors.password && <Error>{ errors.password }</Error>}
                    </FormGroup>
                  </Col>
                  <Col sm= {12} md={6}>
                    <FormGroup>
                      <Label for="confirmPassword">Confirm password</Label>
                      <Input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        placeholder="" 
                        value={confirmPassword}
                        onChange={this.onInputChange}
                      />
                      {errors.confirmPassword && <Error>{ errors.confirmPassword }</Error>}
                    </FormGroup>
                  </Col>
                </Row>
                <Button
                  outline
                  disabled={loading}
                  block
                  size={"sm"}
                  color={'success'}
                  onClick={(e) => this.handleSubmit(e, signup)}
                >{ loading ? "Adding client..." : "Add new client" }</Button>
              </Form>
            )
          }}
        </Mutation>
        </Col>
      </SignupContainer>
    );
  }
}
