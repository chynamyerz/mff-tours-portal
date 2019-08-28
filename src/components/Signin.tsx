import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { USER_QUERY } from '../graphql/Query';
import { LOGIN_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { validate } from 'isemail';
import { Error } from './util/Error';

interface ISigninFormInput {
  email: string;
  password: string;
}

interface ISigninState {
  loggedIn: boolean;
  redirectToSignup: boolean;
  redirectToForgotPassword: boolean;
  errors: Partial<ISigninFormInput> & { responseError?: string };
  userInput: ISigninFormInput;
};

const SigninContainer = styled.div`
  margin-top: 5%;
  margin-bottom: 5%;
`;

const validateSigninField = (
  signUpInput: ISigninFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<ISigninFormInput> = {};

  // Check if the submitted email address is valid.
  if (!validate(signUpInput.email, { minDomainAtoms: 2 })) {
    errors.email = "Email address is invalid";
  }

  // Check if the password is secure enough.
  if (signUpInput.password.length < 5) {
    errors.password = "Password should be at least 5 characters long";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};


export default class Signin extends React.Component<{}, ISigninState> {
  public state = {
    errors: {
      email: "",
      password: "",
      responseError: "",
    },
    loggedIn: false,
    redirectToForgotPassword: false,
    redirectToSignup: false,
    userInput: {
      email: "",
      password: "",
    }
  }

  redirectToSignup = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    this.setState((prevState) => ({
      ...prevState, redirectToSignup: true
    }))
  }

  redirectToRequestPasswordReset = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();

    this.setState((prevState) => ({
      ...prevState, redirectToForgotPassword: true
    }))
  }

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

  handleSubmit = async (e: React.FormEvent<EventTarget>, login: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors: object = validateSigninField(this.state.userInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Log the user in
      const logUserIn = await login({
        variables: { ...this.state.userInput }
      });

      // Update the form according to whether logging in was successful
      if (logUserIn.data.login) {
        // Update the form according to whether logging in was successful
      this.setState({
        errors: {
          email: "",
          password: "",
          responseError: ""
        },
        loggedIn: true,
        userInput: {
          email: "",
          password: "",
        }
      });
      }
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

  render() {
    if (this.state.loggedIn) {
      return (<Redirect to="/cars" />)
    }

    const { redirectToForgotPassword, redirectToSignup, errors } = this.state;
    const { email, password } = this.state.userInput;

    if (redirectToForgotPassword) {
      return <Redirect to={'request-password-reset'}/>
    }

    if (redirectToSignup) {
      return <Redirect to={'sign-up'}/>
    }

    return (
      <SigninContainer>
        <Col sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
        <Mutation
          mutation={LOGIN_MUTATION}
          refetchQueries={[{ query: USER_QUERY }]}
        >
          {(login: any, { loading, error }: any) => {
            return (
              <Form style={{ textAlign: "left"}}> 
                {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="e.g. example@mail.com" 
                    value={email}
                    onChange={this.onInputChange}
                  />
                  {errors.email && <Error>{ errors.email }</Error>}
                </FormGroup>
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
                <Button
                  disabled={ loading }
                  block
                  size={"sm"}
                  color={"success"}
                  onClick={(e) => this.handleSubmit(e, login)}
                >{ loading ? "Signing in..." : "Sign in" }</Button>

                <Button
                  block
                  size={"sm"}
                  color={"primary"}
                  onClick={(e) => this.redirectToRequestPasswordReset(e)}
                >Forgot password</Button>

                <Button
                  style={{ padding: 0 }}
                  color={"link"}
                  onClick={(e) => this.redirectToSignup(e)}
                >Not registered? Click here to sign up</Button>
              </Form>
            )
          }}
        </Mutation>
        </Col>
      </SigninContainer>
    );
  }
}
