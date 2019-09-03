import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem, 
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem} from 'reactstrap';
import { NavLink as RouterNavLink } from "react-router-dom";
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { ErrorMessage } from '../util/ErrorMessage';
import { USER_QUERY } from '../../graphql/Query';
import { LOGOUT_USER_MUTATION } from '../../graphql/Mutation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavbarItem = styled.div`
  margin-right: 5px;
  margin-left: 5px;
`;

export default class NavigationBar extends React.Component<any, {}> {
  state = {
    errors: { responseError: "" },
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  toggleNavItem = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }

  signout = async (logout: any) => {
    try {
      await logout();
      this.setState({
        errors: {
          responseError: ""
        }
      });
    } catch (error) {
      this.setState({
        errors: {
          responseError: error.message
            .replace("Network error: ", "")
            .replace("GraphQL error: ", "")
        }
      });
    }
  };

  render() {
    const { user } = this.props;

    const defaultNavItems = (
      <>
        <NavbarItem onClick={this.toggleNavItem}>
          <NavItem>
            <RouterNavLink
              style={{ textDecoration: "none", color: "hsl(48, 100%, 67%)"}}
              exact={true}
              to="/"
            >
              Home
            </RouterNavLink>
          </NavItem>
        </NavbarItem>
        <NavbarItem onClick={this.toggleNavItem}>
          <NavItem>
            <RouterNavLink
              style={{ textDecoration: "none", color: "hsl(48, 100%, 67%)"}}
              exact={true}
              to="/about"
            >
              About
            </RouterNavLink>
          </NavItem>
        </NavbarItem>
      </>
    )

    return (
      <Mutation
        mutation={LOGOUT_USER_MUTATION}
        refetchQueries={[{ query: USER_QUERY }]}
      >
        {(logout: any) => {
          return (
            <>
            <Navbar fixed="top" color="dark" light expand="md">
              <NavbarBrand
                tag={"div"}
                onClick={this.toggleNavItem}
              >
                <NavbarItem>
                  <RouterNavLink
                    style={{ 
                      textDecoration: "none", 
                      color: "hsl(48, 100%, 67%)", 
                      fontStyle: "italic",
                      fontWeight: "bolder"
                    }}
                    exact={true}
                    to="/"
                  >
                    MFF Tours
                  </RouterNavLink>
                </NavbarItem>
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} tag={"div"} style={{color: "white"}} />
              <Collapse isOpen={this.state.isOpen} navbar className={"clearfix"}>
                <Nav className="ml-auto float-left" navbar>
                  {user &&
                    <>
                      { defaultNavItems }
                      <NavbarItem onClick={this.toggleNavItem}>
                        <NavItem>
                          <RouterNavLink
                            style={{ textDecoration: "none", color: "hsl(48, 100%, 67%)"}}
                            exact={true}
                            to="/bookings"
                          >
                            Bookings
                          </RouterNavLink>
                        </NavItem>
                      </NavbarItem>

                      <NavbarItem>
                        <UncontrolledDropdown nav inNavbar>
                          <DropdownToggle nav caret style={{display: "inline", color: "white"}}>
                            Hi {user.name}
                          </DropdownToggle>
                          <DropdownMenu right={!this.state.isOpen}>
                            <DropdownItem>
                              <RouterNavLink
                                style={{ textDecoration: "none", color: "grey"}}
                                exact={true}
                                to="/update-user"
                              >
                                <FontAwesomeIcon
                                  icon="edit"
                                />
                                Edit-Profile
                              </RouterNavLink>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
                              <RouterNavLink
                                style={{ textDecoration: "none", color: "grey"}}
                                exact={true}
                                onClick={() => this.signout(logout)}
                                to="/"
                              >
                                <FontAwesomeIcon
                                  icon="sign-out-alt"
                                />
                                Sign-Out
                              </RouterNavLink>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </NavbarItem>
                    </>
                  }
                  {!user &&
                    <>
                      {defaultNavItems}
                      <NavbarItem onClick={this.toggleNavItem}>
                        <NavItem>
                          <RouterNavLink
                            style={{ textDecoration: "none", color: "white"}}
                            exact={true}
                            to="/sign-in"
                          >
                            <FontAwesomeIcon
                              icon="sign-in-alt"
                            />
                            Sign-In
                          </RouterNavLink>
                        </NavItem>
                      </NavbarItem>
                    </>
                  }
                </Nav>
              </Collapse>
            </Navbar>
            {this.state.errors.responseError ? (
              <>
                <hr />
                <ErrorMessage>{this.state.errors.responseError}</ErrorMessage>
              </>
            ) : null}
            </>
          )
        }}
      </Mutation>
    );
  }
}