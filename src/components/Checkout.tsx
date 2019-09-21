import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';

export default class Checkout extends React.Component<any, {}> {
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

  render() {
    const { card } = this.state

    console.log(process.env.SUCCESS_URL)

    const SUCCESS_URL = process.env.SUCCESS_URL
    const CANCEL_URL = process.env.CANCEL_URL
    const PAYFAST_MERCHANT_ID = process.env.MERCHANT_ID_PROD ? process.env.MERCHANT_ID_PROD : process.env.MERCHANT_ID_SANDBOX
    const PAYFAST_URL = process.env.PAYFAST_PROD ? process.env.PAYFAST_PROD : process.env.PAYFAST_SANDBOX

    const itemName = 'Hyundai'
    const itemDescription = 'Rentin a vehicle'
    const itemPrice = 800


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
            <a href={`${PAYFAST_URL}&amp;receiver=${PAYFAST_MERCHANT_ID}&amp;item_name=${itemName}&amp;item_description=${itemDescription}&amp;amount=${itemPrice}&amp;return_url=${SUCCESS_URL}&amp;cancel_url=${CANCEL_URL}`}>
              <img 
                src="https://www.payfast.co.za/images/buttons/light-small-paynow.png" 
                width="165" 
                height="36" 
                alt="Pay" 
                title="Pay Now with PayFast" 
              />
            </a>
          </>}
        </Col>
      </Col>
    );
  }
}
