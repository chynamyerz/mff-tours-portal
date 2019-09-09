import React from 'react';
import { Col } from 'reactstrap';
import SearchVehicles from './SearchVehicles';
import styled from 'styled-components';
import '../App.css';

const HomeContainer = styled.div`
  @media screen and (max-width: 600px) {
    margin-top: 12%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 6%;
  }

  @media screen and (max-width: 500px) {
    margin-top: 10%;
  }
`;

export default class Home extends React.Component<any, any> {
  render() {
    const { user } = this.props
    return (
      <>
        <HomeContainer className={"Home"}>
          <div className={"Home-overlay"}>
            <Col sm={12} md={{size: 6, offset: 3}} lg={{size: 8, offset: 2}}>
              <h1 style={{paddingTop: "10%"}}><strong>MFF Car Rental</strong></h1>
              <SearchVehicles user={user}/>
            </Col>
          </div>
        </HomeContainer>
      </>

      
    );
  }
}
