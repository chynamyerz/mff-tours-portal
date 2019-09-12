import React from 'react';
import { Col, Button, Row, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { VEHICLE_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';
import AddVehicle from './AddVehicle';
import UpdateVehicle from './UpdateVehicle';
import DeleteVehicle from './DeleteVehicle';

const VehiclesContainer = styled.div`
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

export default class ManageVehicles extends React.Component<any, any> {
  public state = {
    addVehicle: false,
    deleteVehicle: false,
    book: false,
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
    const { addVehicle, deleteVehicle, updateVehicle, book, vehicle } = this.state;

    if (book) {
      return <Redirect to={{
        pathname: "/",
        state: {
          user, 
        }
      }} />
    }

    return (
      <VehiclesContainer>
        <Col sm={{size: 10, offset: 1}} md={{size: 10, offset: 1}} lg={{size: 8, offset: 2}}>
        <h3 style={{paddingTop: "15%"}}><strong>Manage Vehicles</strong></h3>
          <Query
            query={VEHICLE_QUERY}
          >
            {({data, loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%"}}/>
              }
              const vehicles: any = data && data.vehicles ? data.vehicles : []

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
                      <Button color="secondary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                    
                  </Modal>
                  {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                  <div style={{textAlign: "left"}}>
                    <Row>
                      <Button
                        style={{marginRight: "2%", marginLeft: "2%", marginBottom: "2%"}}
                        outline
                        size={"sm"} 
                        color={"info"}
                        onClick={this.toggleForAddVehicle}
                      >
                        Add a new vehicle
                      </Button>
                    
                      <Button
                        outline
                        style={{marginRight: "2%", marginLeft: "2%", marginBottom: "2%"}}
                        size={"sm"} 
                        color={"secondary"}
                        onClick={() => this.setState({book: true})}
                      >
                        Book for a client
                      </Button>
                    </Row>
                    
                  </div>
                  <Table striped>
                    <thead style={{textAlign: "left"}}>
                      <tr>
                        <th>Brand</th>
                        <th>Make</th>
                        <th>Transmission</th>
                        <th>Location</th>
                        <th>Doors</th>
                        <th>Seaters</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{textAlign: "left"}}>
                      {
                        vehicles.map((vehicle: any) => {
                          return (
                            <tr key={vehicle.id}>
                              <th scope="row">{vehicle.name}</th>
                              <td>{vehicle.make}</td>
                              <td>{vehicle.transmissionType}</td>
                              <td>{vehicle.location}</td>
                              <td>{vehicle.doors}</td>
                              <td>{vehicle.seaters}</td>
                              <td style={{textAlign: "right"}}>
                                <Row>
                                  <Col sm={12} md={6} lg={6}>
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
                                  <Col sm={12} md={6} lg={6}>
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
