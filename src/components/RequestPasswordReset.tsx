import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { Mutation } from 'react-apollo';
import { REQUEST_RESET_MUTATION } from '../graphql/Mutation';
import { ErrorMessage } from './util/ErrorMessage';
import { validate } from 'isemail';
import { Error } from './util/Error';

interface IRequestPasswordResetFormInput {
  email: string;
}

interface IRequestPasswordResetState {
  requested: boolean;
  errors: Partial<IRequestPasswordResetFormInput> & { responseError?: string };
  userInput: IRequestPasswordResetFormInput;
};

const RequestPasswordResetContainer = styled.div`
  margin-top: 5%;
  margin-bottom: 5%;
`;

const validateRequestPasswordField = (
  signUpInput: IRequestPasswordResetFormInput
) => {
  // An object to store errors for all fields.
  const errors: Partial<IRequestPasswordResetFormInput> = {};

  // Check if the submitted email address is valid.
  if (!validate(signUpInput.email, { minDomainAtoms: 2 })) {
    errors.email = "Email address is invalid";
  }

  // return an array consisting of error message if any or empty.
  return errors;
};


export default class RequestPasswordReset extends React.Component<{}, IRequestPasswordResetState> {
  public state = {
    errors: {
      email: "",
      responseError: "",
    },
    requested: false,
    userInput: {
      email: "",
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

  handleSubmit = async (e: React.FormEvent<EventTarget>, requestReset: any) => {
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
      await requestReset(
        {
          variables: {
            email: this.state.userInput.email
          }
        }
      );

      alert("Check your emails for the reset password One Time Pin.\n\nIf not find, please check your spam folder.");

      // Update the form
      this.setState({
        errors: {
          email: "",
          responseError: ""
        },
        requested: true,
        userInput: {
          email: "",
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
    if (this.state.requested) {
      return (<Redirect to="/reset-password" />)
    }

    const { errors } = this.state;
    const { email } = this.state.userInput;

    return (
      <RequestPasswordResetContainer>
        <Col sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
        <Mutation
          mutation={REQUEST_RESET_MUTATION}
        >
          {(requestReset: any, { loading, error }: any) => {
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
                <Button
                  disabled={ loading }
                  block
                  size={"sm"}
                  color={"success"}
                  onClick={(e) => this.handleSubmit(e, requestReset)}
                >{ loading ? "Requesting password reset..." : "Request password reset" }</Button>
              </Form>
            )
          }}
        </Mutation>
        </Col>
      </RequestPasswordResetContainer>
    );
  }
}
