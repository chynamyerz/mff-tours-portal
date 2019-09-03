import React from 'react';
import { Col } from 'reactstrap';
import SearchVehicles from './SearchVehicles';


export default class Home extends React.Component<any, any> {
  render() {
    const { user } = this.props
    return (
      <Col sm={12} md={{size: 6, offset: 3}} lg={{size: 8, offset: 2}}>
        <h1 style={{marginTop: "25%"}}><strong>MFF Cars Rental</strong></h1>
        <SearchVehicles user={user}/>
      </Col>
    );
  }
}
