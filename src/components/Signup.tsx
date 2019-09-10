import React from 'react';
import { validate } from "isemail";
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { SIGNUP_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';
import { Redirect } from 'react-router-dom';

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
  redirectToSignin: boolean;
  errors: Partial<ISignupFormInput> & { responseError?: string };
  userInput: ISignupFormInput;
};

const SignupContainer = styled.div`
  margin-bottom: 5%;

  @media screen and (max-width: 500px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 600px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 10%;
  }
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

export default class Signup extends React.Component<{}, ISignupState> {
  public state = {
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
    redirectToSignin: false,
    userInput: {
      email: "",
      name: "",
      surname: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      password: "",
      confirmPassword: ""
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
        redirectToSignin: true,
        userInput: {
          email: "",
          name: "",
          surname: "",
          contact: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          password: "",
          confirmPassword: ""
        }
      });
      alert("Successfully registered, Login using your email and password");
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
    if (this.state.redirectToSignin) {
      return (<Redirect to="/sign-in" />)
    }

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
        <Col sm={{ size: 8, offset: 2 }} md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
        <h3 style={{paddingTop: "20%"}}><strong>Sign up</strong></h3>
        <Mutation mutation={SIGNUP_MUTATION}>
          { (signup: any, { loading, error }: any) => {
            return (
              <Form style={{ textAlign: "left"}}>
                {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}
                <Row>
                  <Col md={6}>
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
                  <Col md={6}>
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
                  <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email address</Label>
                    <Input 
                      type="text" 
                      name="email" 
                      id="email" 
                      placeholder="e.g. smith@gmail.com"
                      value={email}
                      onChange={this.onInputChange}
                    />
                    {errors.email && <Error>{ errors.email }</Error>}
                  </FormGroup>
                  </Col>
                  <Col md={6}>
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
                  <Col md={6}>
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
                  <Col md={4}>
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
                  <Col md={2}>
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
                  <Col md={6}>
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
                  <Col md={6}>
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
                >{ loading ? "Signing up..." : "Sign up" }</Button>
              </Form>
            )
          }}
        </Mutation>
        </Col>
      </SignupContainer>
    );
  }
}
