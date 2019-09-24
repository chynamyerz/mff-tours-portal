import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';

export default class Checkout extends React.Component<any, any> {
  state = {
    card: false,
  }

  /**
   * Update the form content according to the user input.
   */
  onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "card") {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        card: !this.state.card
      });
    } else {
      // Update the userInput property of the state when input field values change
      this.setState({
        ...this.state,
        [name]: value
      });
    }
  };

  click_49beac3ea4be6541f3bee2b321f7267f( aform_reference: any ) {
    var aform = aform_reference;
    aform['amount'].value = Math.round( aform['amount'].value*Math.pow( 10,2 ) )/Math.pow( 10,2 );
  }

  render() {
    const { card } = this.state
    const { beyondKZN, user, vehicle, pickupDate, returnDate, email } = this.props

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("vehicle", JSON.stringify(vehicle))
    localStorage.setItem("pickupDate", JSON.stringify(pickupDate))
    localStorage.setItem("returnDate", JSON.stringify(returnDate))
    localStorage.setItem("email", JSON.stringify(email))
    localStorage.setItem("beyondKZN", JSON.stringify(beyondKZN))

    const SUCCESS_URL = process.env.REACT_APP_MMF_SUCCESS_URL
    const CANCEL_URL = process.env.REACT_APP_MMF_CANCEL_URL
    const PAYFAST_MERCHANT_ID = process.env.REACT_APP_ENV === "PROD" ? process.env.REACT_APP_MMF_MERCHANT_ID_PROD : process.env.REACT_APP_MMF_MERCHANT_ID_SANDBOX
    const PAYFAST_URL = process.env.REACT_APP_ENV === "PROD" ? process.env.REACT_APP_MMF_PAYFAST_PROD : process.env.REACT_APP_MMF_PAYFAST_SANDBOX

    return (
      <Col>
        <Col>
          <FormGroup>
            <Label for="card" check>
              <Input 
                checked={card}
                name="card" 
                id="card" 
                type="checkbox" 
                onChange={this.onInputChange}
              />{'  '}
              Pay using card
            </Label>
          </FormGroup>
        </Col>
        <Col>
          {card && <>
            <form 
              action={PAYFAST_URL} 
              method={"POST"}
              onSubmit={() => this.UNSAFE_componentWillUpdate}
            >
              <input type="hidden" name="cmd" value="_paynow" />
              <input type="hidden" name="receiver" value={PAYFAST_MERCHANT_ID} />
              <input type="hidden" name="item_name" value={vehicle.name} />
              <input type="hidden" name="amount" value={beyondKZN ? "2000.00" : vehicle.price} />
              <input type="hidden" name="item_description" value={vehicle.make} />
              <input type="hidden" name="return_url" value={SUCCESS_URL} />
              <input type="hidden" name="cancel_url" value={CANCEL_URL} />
              <input type="hidden" name="name_first" value={user && user.name ? user.name : ""} />
              <input type="hidden" name="name_last" value={user && user.surname ? user.surname : ""} />
              <input type="hidden" name="email_address" value={user && user.email ? user.email : ""} />
              <input type="hidden" name="email_confirmation" id="email_confirmation" value="1" />
              <input type="hidden" name="confirmation_address" id="confirmation_address" value=""></input>

              <table>
                <tbody>
                  <tr>
                    <td>
                      <input 
                        type="image" 
                        src="https://www.payfast.co.za/images/buttons/dark-large-paynow.png" 
                        width="174" 
                        height="59" 
                        alt="Pay Now" 
                        title="Pay Now with PayFast" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>            
          </>}
        </Col>
      </Col>
    );
  }
}
