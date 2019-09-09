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

export default class Footer extends React.Component<any, {}> {
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
              About-us
            </RouterNavLink>
          </NavItem>
        </NavbarItem>
        <NavbarItem onClick={this.toggleNavItem}>
          <NavItem>
            <RouterNavLink
              style={{ textDecoration: "none", color: "hsl(48, 100%, 67%)"}}
              exact={true}
              to="/contact"
            >
              Contact-us
            </RouterNavLink>
          </NavItem>
        </NavbarItem>
        <NavbarItem onClick={this.toggleNavItem}>
          <NavItem>
            <RouterNavLink
              style={{ textDecoration: "none", color: "hsl(48, 100%, 67%)"}}
              exact={true}
              to="/services"
            >
              Services
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
              <Navbar fixed="bottom" color="ligh" light expand="md">
                <p>@Copy Right Lotter IT Solutions 2019</p>
              </Navbar>
            </>
          )
        }}
      </Mutation>
    );
  }
}