import React from 'react';
import styled from 'styled-components';
import { Col, Row, Nav, NavItem } from 'reactstrap';
import './index.css'
import ManageVehicles from '../../ManageVehicles';
import ManageUsers from '../../ManageUsers';
import ManageBookings from '../../ManageBookings';

const AdminDashboardContainer = styled.div` 
  @media screen and (max-width: 500px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 600px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 6%;
  }
`;

const AdminDashboardRowContainer = styled.div` 
  @media screen and (min-width: 100px) {
    padding-top: 20%;
  }

  @media screen and (min-width: 600px) {
    padding-top: 10%;
  }

  @media screen and (min-width: 900px) {
    padding-top: 6%;
  }
`;

export default class AdminDashboard extends React.Component<any, any> {
  state = {
    users: true,
    vehicles: false,
    bookings: false,
    statistics: false,
  }

  toggleUsers = () => {
    this.setState({
      users: true,
      vehicles: false,
      bookings: false,
      statistics: false,
    })
  }

  toggleVehicles = () => {
    this.setState({
      users: false,
      vehicles: true,
      bookings: false,
      statistics: false,
    })
  }

  toggleBookings = () => {
    this.setState({
      users: false,
      vehicles: false,
      bookings: true,
      statistics: false,
    })
  }

  toggleStatistics = () => {
    this.setState({
      users: false,
      vehicles: false,
      bookings: false,
      statistics: true,
    })
  }
  render() {
    const { bookings, statistics, users, vehicles } = this.state;

    return (
      <AdminDashboardContainer className={"AdminDashboard"}>
        <div className={"AdminDashboard-overlay"}>
          <AdminDashboardRowContainer>
            <Row style={{width: "100%"}}>
              <Col sm={4} md={2} lg={2} style={{color: "hsl(0, 0%, 86%)", textAlign: "left", paddingLeft: "5%"}}>
                <h2>Menu</h2>
                <hr />
                <Nav vertical>
                  <NavItem>
                    <p onClick={this.toggleUsers} style={{cursor: "pointer"}}>Users</p>
                  </NavItem>
                  <hr />
                  <NavItem>
                    <p onClick={this.toggleVehicles} style={{cursor: "pointer"}}>Vehicles</p>
                  </NavItem>
                  <hr />
                  <NavItem>
                    <p onClick={this.toggleBookings} style={{cursor: "pointer"}}>Bookings</p>
                  </NavItem>
                  <hr />
                  {/* <NavItem>
                    <p onClick={this.toggleStatistics} style={{cursor: "pointer"}}>Statistics</p>
                  </NavItem> */}
                </Nav>
                <hr />
              </Col>
              <Col sm={8} md={10} lg={10} style={{color: "hsl(0, 0%, 86%)", textAlign: "left", paddingRight: "5%"}}>
                {users && <ManageUsers />}
                {vehicles && <ManageVehicles />}
                {bookings && <ManageBookings />}
                {statistics && <div><h1>See perfomance summary under construction</h1></div>}
              </Col>
            </Row>   
          </AdminDashboardRowContainer>
        </div>       
      </AdminDashboardContainer>
    );
  }
}
