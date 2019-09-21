import React from 'react';
import { Col, Button, Row, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Query } from 'react-apollo';
import { VEHICLE_BOOKINGS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import { Redirect } from 'react-router-dom';
import AddVehicle from './AddVehicle';
import UpdateVehicle from './UpdateVehicle';
import DeleteVehicle from './DeleteVehicle';
import moment from 'moment';

export default class ManageBookings extends React.Component<any, any> {
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
      <>
        <Col>
        <h3 style={{textAlign: "center"}}><strong>Manage Vehicles</strong></h3>
          <Query
            query={VEHICLE_BOOKINGS_QUERY}
          >
            {({data, loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%", marginLeft: "50%"}}/>
              }
              const bookings: any = data && data.bookings ? data.bookings : []

              return (
                <>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={"lg"}>
                    {
                      addVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Add a new vehicle</strong></ModalHeader>
                          <ModalBody>
                            <AddVehicle closeModal={this.toggle} user={user}/>
                          </ModalBody>
                        </>
                      )
                    }
                    {
                      updateVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Update vehicle information</strong></ModalHeader>
                          <ModalBody>
                            <UpdateVehicle closeModal={this.toggle} user={user} vehicle={vehicle}/>
                          </ModalBody>
                        </>
                      )
                    }
                    {
                      deleteVehicle && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Delete vehicle</strong></ModalHeader>
                          <ModalBody>
                            <DeleteVehicle closeModal={this.toggle}  user={user} vehicle={vehicle}/>
                          </ModalBody>
                        </>
                      )
                    }
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                    
                  </Modal>
                  {error && <ErrorMessage>{error.message.replace("Network error: ", "").replace("GraphQL error: ", "")}</ErrorMessage>}
                  
                  <div className={"table-wrapper-scroll-y my-custom-table-scrollbar"}>
                    <Table size={"sm"} responsive striped dark hover>
                      <thead style={{textAlign: "left"}}>
                        <tr>
                          <th>Booked by</th>
                          <th>Pickup date</th>
                          <th>Return date</th>
                          <th>Location</th>
                          <th>Vehicle</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{textAlign: "left"}}>
                        {
                          bookings.map((booking: any) => {
                            return (
                              <tr key={booking.id}>
                                <td>{booking.user.name}</td>
                                <td>{moment(booking.pickupDate).format("YYYY-MM-DD LT")}</td>
                                <td>{moment(booking.returnDate).format("YYYY-MM-DD LT")}</td>
                                <td>{booking.vehicle.location}</td>
                                <td>{booking.vehicle.name}</td>
                                <td>{booking.status}</td>
                                <td style={{textAlign: "right"}}>
                                  <Row>
                                    <Col sm={12} md={12} lg={4} style={{marginBottom: "5%"}}>
                                      <Button
                                        outline
                                        block
                                        disabled={loading}
                                        style={{marginRight: "2%", color: "white"}}
                                        size={"sm"} 
                                        color={"secondary"}
                                        onClick={() => ({})}
                                      >
                                        Picked up
                                      </Button>
                                    </Col>
                                    <Col sm={12} md={12} lg={4} style={{marginBottom: "5%"}}>
                                      <Button
                                        outline
                                        block
                                        style={{marginRight: "2%", marginBottom: "2%", color: "white"}}
                                        size={"sm"} 
                                        color={"info"}
                                        onClick={() => ({})}
                                      >
                                        Returned
                                      </Button>
                                    </Col>
                                    <Col sm={12} md={12} lg={4}>
                                      <Button
                                        outline
                                        block
                                        disabled={loading}
                                        style={{marginRight: "2%", color: "white"}}
                                        size={"sm"} 
                                        color={"danger"}
                                        onClick={() => ({})}
                                      >
                                        Cancel
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
                  </div>
                </>
              )
            }}
          </Query>
        </Col>
      </>
    );
  }
}
