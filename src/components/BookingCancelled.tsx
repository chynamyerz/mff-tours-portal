import React from 'react';
import styled from 'styled-components';
import { Card, CardBody, CardTitle, CardText, Col, Alert, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';

const BookingCancelledContainer = styled.div`
  @media screen and (max-width: 500px) {
    margin-top: 20%;
  }

  @media screen and (max-width: 600px) {
    margin-top: 15%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 10%;
  }
`;

export default class BookingCancelled extends React.Component<any, {}> {
  state = {
    goToSearch: false
  }

  goToSearch = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      goToSearch: true,
    }))
  }

  render() {
    const { goToSearch } = this.state;

    if (goToSearch) {
      return <Redirect to={"/"} />
    }
    return (
      <BookingCancelledContainer>
        <Col sm={12} md={{size: 6, offset: 3}} lg={{size: 6, offset: 3}}>
          <h3 style={{paddingTop: "20%", marginBottom: "2%"}}><strong>Booking status</strong></h3>
          <Col sm={12} md={{size: 11, offset: 1}}>
            <Card style={{ textAlign: "left", marginBottom: "3%"}}>
              <CardBody>
                <Col sm={{size: 6, offset: 3}} md={{size: 6, offset: 3}} lg={{size: 4, offset: 4}}>
                  <Col>
                    <Alert color={"danger"} style={{textAlign: "left"}}>Booking was cancelled!</Alert>
                  </Col>
                  <Col>
                    <Button
                      outline
                      size={"sm"}
                      onClick={this.goToSearch}
                    >Done</Button>
                  </Col>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Col>
      </BookingCancelledContainer>
    );
  }
}
