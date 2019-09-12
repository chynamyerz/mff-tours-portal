import React from 'react';
import { Col, CardImg, CardText, Row } from 'reactstrap';

export default class VehicleDetails extends React.Component<any, any> {

  render() {
    const { vehicle } = this.props;
 
    return (
      <Col>
        <Row style={{marginBottom: "2%"}}>
          <Col> 
            <Row>
              <CardImg 
                src={require("../../assets/images/door.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.doors} doors</CardText>
            </Row>
            
          </Col>
          <Col>
            <Row>
              <CardImg 
                src={require("../../assets/images/seat.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.seaters} seater</CardText>
            </Row>
          </Col>
        </Row>
        <Row style={{marginBottom: "2%"}}>
          <Col> 
            <Row>
              <CardImg 
                src={require("../../assets/images/fuel.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.fuelType}</CardText>
            </Row>
            
          </Col>
          <Col>
            <Row>
              <CardImg 
                src={require("../../assets/images/gear.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.transmissionType}</CardText>
            </Row>
          </Col>
        </Row>
        <Row style={{marginBottom: "2%"}}>
          <Col> 
            <Row>
              <CardImg 
                src={require("../../assets/images/aircon.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.airType}</CardText>
            </Row>
            
          </Col>
          <Col>
            <Row>
              <CardImg 
                src={require("../../assets/images/airbag.png")} 
                style={{height: "25px", width: "25px", borderRadius: "50%"}}
              /><CardText>{vehicle.bags} Bags</CardText>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }
}
