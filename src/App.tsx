import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import NavigationBar from './components/navigation/NavigationBar';
import Signin from './components/Signin';
import './App.css';
import Signup from './components/Signup';
import VehicleResults from './components/VehicleResults';
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faEnvelope, 
  faKey, 
  faSignInAlt, 
  faSignOutAlt, 
  faEdit, 
  faSearch, 
  faAngleRight,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import Contact from './components/Contact';
import Services from './components/Services';
import AdminDashboard from './components/dashboard/admin';
import BookingSuccess from './components/BookingSuccess';
import BookingCancelled from './components/BookingCancelled';

library.add(
  faEnvelope, 
  faKey, 
  faSignInAlt, 
  faSignOutAlt, 
  faEdit, 
  faSearch, 
  faAngleRight,
  faCalendar
);

const AppContainer = styled.div`
  margin-top: 0%;
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
                      path="/contact"
                      component={() => (
                        <>
                          <Contact />
                        </>
                      )}
                    />

                    <Route
                      exact={true}
                      path="/services"
                      component={() => (
                        <>
                          <Services />
                        </>
                      )}
                    />

                    <Route
                      exact={true}
                      path="/vehicle-results"
                      component={(props: any) => {
                        const { state } = props.location
                        return (
                          <VehicleResults 
                            location={state ? state.location : ""}
                            user={state ? state.user : null}
                            vehicles={state ? state.vehicles : []}
                            pickupDate={state ? state.pickupDate : ""}
                            returnDate={state ? state.returnDate : ""}
                          />
                        )
                      }}
                    />

                    <Route
                      exact={true}
                      path="/client-vehicle-booking"
                      component={(props: any) => {
                        const { state } = props.location
                        return (
                          <ClientBook 
                            user={state ? state.user : null}
                            vehicle={state ? state.vehicle : {}}
                            pickupDate={state ? state.pickupDate : ""}
                            returnDate={state ? state.returnDate : ""}
                            success={state ? state.success : false}
                          />
                        )
                      }}
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

                    <Route
                      exact={true}
                      path="/success"
                      component={(props: any) => {
                        const { state } = props.location
                        return (
                          <BookingSuccess 
                            vehicle={state ? state.vehicle : {}}
                          />
                        )
                      }}
                    />

                    <Route
                      exact={true}
                      path="/cancel"
                      component={() => (
                        <BookingCancelled />
                      )}
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/admin-vehicle-booking"
                      component={(props: any) => {
                        const { state } = props.location
                        return (
                          <UserBook 
                            user={state ? state.user : null}
                            vehicle={state ? state.vehicle : {}}
                            pickupDate={state ? state.pickupDate : ""}
                            returnDate={state ? state.returnDate : ""}
                          />
                        )
                      }}
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/add-vehicle"
                      component={(props: any) => {
                        const { state } = props.location
                        return (
                          <AddVehicle 
                            user={state ? state.user : null}
                          />
                        )
                      }}
                    />

                    <ProtectedRoute
                      user={currentUser}
                      exact={true}
                      path="/admin-dashboard"
                      component={(props: any) => {
                        return (
                          <AdminDashboard 
                            user={currentUser}
                          />
                        )
                      }}
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
                      component={() => <UpdateUser user={currentUser}/>}
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