import React from 'react';
import { Col, Button, Row, Spinner, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Query } from 'react-apollo';
import { USERS_QUERY } from '../graphql/Query';
import { ErrorMessage } from './util/ErrorMessage';
import AddUser from './AddUser';
import AdminUpdateUser from './AdminUpdateUser';

export default class ManageUsers extends React.Component<any, any> {
  public state = {
    addUser: false,
    modal: false,
    user: {},
    updateUser: false
  }

  toggleForAddUser = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      addUser: true,
      updateUser: false,
    });
  }

  toggleForUpdateUser = (user: any) => {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
      updateUser: true,
      addUser: false,
      user
    });
  }

  toggle = () => {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  render() {
    const { addUser, updateUser, user } = this.state;

    return (
      <>
        <Col>
        <h3 style={{textAlign: "center"}}><strong>Manage Users</strong></h3>
          <Query
            query={USERS_QUERY}
          >
            {({data, loading, error}: any) => {
              if (loading) {
                return <Spinner color="info" size="lg" style={{marginTop: "15%", marginLeft: "50%"}}/>
              }
              const users: any = data && data.users ? data.users : []

              return (
                <>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size={"lg"}>
                    {
                      addUser && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Add a new user</strong></ModalHeader>
                          <ModalBody>
                            <AddUser closeModal={this.toggle}/>
                          </ModalBody>
                        </>
                      )
                    }
                    {
                      updateUser && (
                        <>
                          <ModalHeader toggle={this.toggle}><strong>Update user information</strong></ModalHeader>
                          <ModalBody>
                            <AdminUpdateUser closeModal={this.toggle}  user={user} />
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
                        style={{marginRight: "2%", marginLeft: "2%", marginBottom: "2%", color: "white"}}
                        outline
                        size={"sm"} 
                        color={"info"}
                        onClick={this.toggleForAddUser}
                      >
                        Add a new user
                      </Button>
                    </Row>
                  </div>
                  <div className={"table-wrapper-scroll-y my-custom-table-scrollbar"}>
                    <Table size={"sm"} responsive={true} striped={true} dark={true}>
                      <thead style={{textAlign: "left"}}>
                        <tr>
                          <th>Name</th>
                          <th>Surname</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody style={{textAlign: "left"}}>
                        {
                          users.map((user: any) => {
                            return (
                              <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.surname}</td>
                                <td>{user.email}</td>
                                <td>{user.contact}</td>
                                <td style={{textAlign: "right"}}>
                                  <Button
                                    outline
                                    block
                                    style={{marginRight: "2%", marginBottom: "2%", color: "white"}}
                                    size={"sm"} 
                                    color={"info"}
                                    onClick={() => this.toggleForUpdateUser(user)}
                                  >
                                    Update
                                  </Button>
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
