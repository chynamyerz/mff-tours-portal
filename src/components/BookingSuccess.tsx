import React from 'react';
import { Redirect } from 'react-router-dom';

export default class BookingSuccess extends React.Component<any, {}> {
  render() {
    const user = JSON.parse((localStorage as any).getItem('user'))
    const vehicle = JSON.parse((localStorage as any).getItem('vehicle'))
    const pickupDate = JSON.parse((localStorage as any).getItem('pickupDate'))
    const returnDate = JSON.parse((localStorage as any).getItem('returnDate'))

    return <Redirect to={{
      pathname: "/client-vehicle-booking",
      state: {
        user, 
        vehicle,
        pickupDate,
        returnDate,
        success: true
      }
    }} />
  }
}
