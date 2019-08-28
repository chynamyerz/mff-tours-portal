import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import NavigationBar from './components/navigation/NavigationBar';
import Signin from './components/Signin';
import './App.css';
import Signup from './components/Signup';
import Cars from './components/Cars';
import styled from 'styled-components';
import Bookings from './components/Bookings';
import { Query } from 'react-apollo';
import { USER_QUERY } from './graphql/Query';
import { Spinner } from './components/util/Spinner';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword';
import UpdateUser from './components/UpdateUser';
import Home from './components/Home';
import About from './components/About';
import AddVehicle from './components/AddVehicle';
import ClientBook from './components/ClientBook';
import UserBook from './components/UserBook';
import ManageVehicles from './components/ManageVehicles';

const AppContainer = styled.div`
  margin-top: 7%;
  margin-bottom: 5%;
  margin-right: 5%;
  margin-left: 5%;

  @media screen and (max-width: 600px) {
    margin-top: 10%;
    margin-bottom: 5%;
    margin-right: 5%;
    margin-left: 5%;
  }

  @media screen and (max-width: 900px) {
    margin-top: 15%;
    margin-bottom: 5%;
    margin-right: 5%;
    margin-left: 5%;
  }

  @media screen and (max-width: 500px) {
    margin-top: 25%;
    margin-bottom: 5%;
    margin-right: 5%;
    margin-left: 5%;
  }
`;

/**
 * A route which redirects to the login page if the user is not logged in.
 */
export function ProtectedRoute({
  component: Component,
  user,
  ...rest
}: any) {
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Query query={ USER_QUERY }>
          {({ data, loading }: any) => {
            if (loading) {
              return <Spinner />
            }

            const currentUser = data && data.user ? data.user : null;

            return (
              <>
                <NavigationBar user={ currentUser } />
                <AppContainer>
                  <Switch>
                    <Route
                      exact={true}
                      path="/"
                      component={() => (
                        <>
                          <Home user={currentUser}/>
                        </>
                      )}
                    />

                    <Route
                      exact={true}
                      path="/about"
                      component={() => (
                        <About />
                      )}
                    />

                    <Route
                      exact={true}
                      path="/cars"
                      component={() => (
                        <Cars user={currentUser}/>
                      )}
                    />

                    <Route
                      exact={true}
                      path="/client-vehicle-booking"
                      component={(props: any) => (
                        <ClientBook 
                          user={props.location.state.user}
                          vehicle={props.location.state.vehicle}
                        />
                      )}
                    />

                    <Route
                      exact={true}
                      path="/admin-vehicle-booking"
                      component={(props: any) => (
                        <UserBook 
                          user={props.location.state.user}
                          vehicle={props.location.state.vehicle}
                        />
                      )}
                    />

                    <Route
                      exact={true}
                      path="/sign-in"
                      component={() => (
                        <Signin />
                      )}
                    />

                    <Route
                      exact={true}
                      path="/sign-up"
                      component={() => (
                        <Signup />
                      )}
                    />

                    <Route
                      exact={true}
                      path="/reset-password"
                      component={ResetPassword}
                    />

                    <Route
                      exact={true}
                      path="/request-password-reset"
                      component={RequestPasswordReset}
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/add-vehicle"
                      component={(props: any) => (
                        <AddVehicle 
                          user={props.location.state.user}
                        />
                        )
                      }
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/manage-vehicle"
                      component={(props: any) => (
                        <ManageVehicles 
                          user={props.location.state.user}
                        />
                        )
                      }
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/bookings"
                      component={() => <Bookings user={currentUser} />}
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/update-user"
                      component={() => <UpdateUser />}
                    />
                  </Switch>
                </AppContainer>
              </>
            )
          }}
        </Query>
      </div>
    );
  }
}


export default App;