import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Card, Row, CardImg, CardBody, Alert } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { USER_QUERY } from '../graphql/Query';
import { LOGIN_MUTATION } from '../graphql/Mutation';
import { validate } from 'isemail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  margin-top: 10%;
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
    errors.password = "Password is not long enough";
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
      return (<Redirect to="/" />)
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
        <Col sm={12} md={{ size: 8, offset: 2 }}>
        <Mutation
          mutation={LOGIN_MUTATION}
          refetchQueries={[{ query: USER_QUERY }]}
        >
          {(login: any, { loading, error }: any) => {
            return (
              <Card style={{background: "hsl(0, 0%, 96%)"}}>
                <Row>
                  <Col sm={12} md={6}>
                    <CardImg 
                      style={{height: "100%"}} 
                      src={require("../assets/images/mff-tours-logo.jpg")} alt="MFF-TOUR LOGO" 
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <CardBody>
                      <Form style={{ textAlign: "left"}}> 
                        {error && <Alert color={"danger"}>{this.state.errors.responseError}</Alert>}
                        <FormGroup>
                          <Label for="email">
                            <FontAwesomeIcon
                              icon="envelope"
                            />
                            Email
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
                        <FormGroup>
                          <Label for="password">
                            <FontAwesomeIcon
                              icon="key"
                            />
                            Password
                          </Label>
                          <Input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Must be 5 characters long" 
                            value={password}
                            onChange={this.onInputChange}
                          />
                          {errors.password && <Alert color={"danger"}>{ errors.password }</Alert>}
                        </FormGroup>
                        <Row>
                          <Col sm={12} md={6}>
                            <FormGroup>
                              <Button
                                outline
                                disabled={ loading }
                                block
                                size={"sm"}
                                color={"success"}
                                onClick={(e) => this.handleSubmit(e, login)}
                              >{ loading ? "Signing in..." : "Sign-In" }</Button>
                            </FormGroup>
                          </Col>

                          <Col sm={12} md={6}>
                            <FormGroup>
                              <Button
                                outline
                                block
                                size={"sm"}
                                color={"info"}
                                onClick={(e) => this.redirectToSignup(e)}
                              >New user</Button>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Button
                          style={{ padding: 0 }}
                          color={"link"}
                          onClick={(e) => this.redirectToRequestPasswordReset(e)}
                        >Forgot password</Button>
                      </Form>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            )
          }}
        </Mutation>
        </Col>
      </SigninContainer>
    );
  }
}
