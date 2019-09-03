import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { RESET_PASSWORD_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { Error } from './util/Error';

interface IResetPasswordFormInput {
  oneTimePin: string;
  password: string;
  confirmPassword: string;
}

interface IResetPasswordState {
  reset: boolean;
  errors: Partial<IResetPasswordFormInput> & { responseError?: string };
  userInput: IResetPasswordFormInput;
};

const ResetPasswordContainer = styled.div`
  margin-top: 5%;
  margin-bottom: 5%;
`;

const validateRequestPasswordField = (
  signUpInput: IResetPasswordFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IResetPasswordFormInput> = {};
  // Check if the submitted one time pin is not empty.
  if (!signUpInput.oneTimePin) {
    errors.oneTimePin = "Contact number is required";
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


export default class ResetPassword extends React.Component<{}, IResetPasswordState> {
  public state = {
    errors: {
      confirmPassword: "",
      oneTimePin: "",
      password: "",
      responseError: "",
    },
    reset: false,
    userInput: {
      confirmPassword: "",
      oneTimePin: "",
      password: "",
    }
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

  handleSubmit = async (e: React.FormEvent<EventTarget>, resetPassword: any) => {
    e.preventDefault();

    // Validate the user input fields
    const errors: object = validateRequestPasswordField(this.state.userInput);
    this.setState({ errors });

    // Check if there is an error, if there is abort signing up.
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Request to reset the password
      await resetPassword(
        {
          variables: {
            password: this.state.userInput.password,
            oneTimePin: this.state.userInput.oneTimePin
          }
        }
      );

      alert("Password changed successfully.\n\nPlease try logging in using the new password.")
      
      // Update the form
      this.setState({
        errors: {
          confirmPassword: "",
          oneTimePin: "",
          password: "",
          responseError: ""
        },
        reset: true,
        userInput: {
          confirmPassword: "",
          oneTimePin: "",
          password: "",
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

  render() {
    if (this.state.reset) {
      return (<Redirect to="/sign-in" />)
    }

    const { errors } = this.state;
    const { confirmPassword, oneTimePin, password } = this.state.userInput;

    return (
      <ResetPasswordContainer>
        <Col sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
        <Mutation
          mutation={RESET_PASSWORD_MUTATION}
        >
          {(resetPassword: any, { loading, error }: any) => {
            return (
              <Form style={{ textAlign: "left"}}> 
                {error && <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>}
                <FormGroup>
                  <Label for="oneTimePin">Password</Label>
                  <Input 
                    type="text" 
                    name="oneTimePin" 
                    id="oneTimePin" 
                    placeholder="It was sent to your" 
                    value={oneTimePin}
                    onChange={this.onInputChange}
                  />
                  {errors.oneTimePin && <Error>{ errors.oneTimePin }</Error>}
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
                <Button
                  outline
                  disabled={ loading }
                  block
                  size={"sm"}
                  color={"success"}
                  onClick={(e) => this.handleSubmit(e, resetPassword)}
                >{ loading ? "Reseting password..." : "Reset password" }</Button>
              </Form>
            )
          }}
        </Mutation>
        </Col>
      </ResetPasswordContainer>
    );
  }
}
