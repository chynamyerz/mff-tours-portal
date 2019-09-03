import React from 'react';
import { Col, Button, Row, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import moment from "moment";
import { Query } from 'react-apollo';
import { VEHICLE_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';
import AddVehicle from './AddVehicle';
import UpdateVehicle from './UpdateVehicle';
import DeleteVehicle from './DeleteVehicle';

const VehiclesContainer = styled.div`
  margin: 5%;
`;

export default class ManageVehicles extends React.Component<any, any> {
  public state = {
    addVehicle: false,
    deleteVehicle: false,
    moreDetails: false,
    modal: false,
    vehicle: {},
    updateVehicle: false
  }

  toggleForAddVehicle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      addVehicle: true,
      updateVehicle: false,
      deleteVehicle: false,

    });
  }

  toggleForUpdateVehicle = (vehicle: any) => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      updateVehicle: true,
      addVehicle: false,
      deleteVehicle: false,
      vehicle
    });
  }

  toggleForDeleteVehicle = (vehicle: any) => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      deleteVehicle: true,
      updateVehicle: false,
      addVehicle: false,
      vehicle
    });
  }

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  render() {
    const { user } = this.props;
    const { addVehicle, deleteVehicle, updateVehicle, moreDetails, vehicle } = this.state;

    if (moreDetails && vehicle) {
      return <Redirect to={{
        pathname: "/admin-vehicle-booking",
        state: {
          user, 
          vehicle
        }
      }} />
    }

    return (
      <VehiclesContainer>
        <Col sm={12} md={12} lg={12}>
          <Query
            query={VEHICLE_QUERY}
          >
            {({data, loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }
              const vehicles: any = data && data.vehicles ? data.vehicles : []

              const availableVehicles: any = vehicles.filter((vehicle: any) => vehicle.status === "AVAILABLE")

              return (
                <>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    {
                      addVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Add a new vehicle</strong></ModalHeader>
                          <ModalBody>
                            <AddVehicle user={user}/>
                          </ModalBody>
                        </>
                      )
                    }
                    {
                      updateVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Update vehicle information</strong></ModalHeader>
                          <ModalBody>
                            <UpdateVehicle user={user} vehicle={vehicle}/>
                          </ModalBody>
                        </>
                      )
                    }
                    {
                      deleteVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Delete vehicle</strong></ModalHeader>
                          <ModalBody>
                            <DeleteVehicle user={user} vehicle={vehicle}/>
                          </ModalBody>
                        </>
                      )
                    }
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    
                  </Modal>
                  {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                  <div style={{textAlign: "left", marginBottom: "2%"}}>
                    <Button
                      outline
                      size={"sm"} 
                      color={"info"}
                      onClick={this.toggleForAddVehicle}
                    >
                      Add a new vehicle
                    </Button>
                  </div>
                  <Table striped>
                    <thead style={{textAlign: "left"}}>
                      <tr>
                        <th>Brand</th>
                        <th>Make</th>
                        <th>Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{textAlign: "left"}}>
                      {
                        availableVehicles.map((vehicle: any) => {
                          return (
                            <tr key={vehicle.id}>
                              <th scope="row">{vehicle.name}</th>
                              <td>{vehicle.make}</td>
                              <td>{moment(vehicle.year).format("YYYY-MM-DD")}</td>
                              <td style={{textAlign: "right"}}>
                                <Row>
                                  <Col sm={12} md={4} lg={4}>
                                    <Button
                                      outline
                                      block
                                      style={{marginRight: "2%"}}
                                      size={"sm"} 
                                      color={"secondary"}
                                      onClick={() => this.setState({vehicle, moreDetails: true})}
                                    >
                                      Book
                                    </Button>
                                  </Col>
                                  <Col sm={12} md={4} lg={4}>
                                    <Button
                                      outline
                                      block
                                      style={{marginRight: "2%"}}
                                      size={"sm"} 
                                      color={"primary"}
                                      onClick={() => this.toggleForUpdateVehicle(vehicle)}
                                    >
                                      Update
                                    </Button>
                                  </Col>
                                  <Col sm={12} md={4} lg={4}>
                                    <Button
                                      outline
                                      block
                                      disabled={loading}
                                      style={{marginRight: "2%"}}
                                      size={"sm"} 
                                      color={"danger"}
                                      onClick={() => this.toggleForDeleteVehicle(vehicle)}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </>
              )
            }}
          </Query>
        </Col>
      </VehiclesContainer>
    );
  }
}
