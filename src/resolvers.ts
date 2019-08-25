import gql from "graphql-tag";
import api from "./api/api";

export const typeDefs = gql`
  extend type Query {
    user: User
  }

  extend type Mutation {
    """
    Logging in the user provided correct credentials.
    """
    login(
      email: String 
      password: String
    ): Boolean
  }

  """
  User.
  """
  type User {
    """
    An id to used to identify the user
    """
    id: ID!
    """
    User's email address
    """
    email: String!
    """
    User's name
    """
    name: String!
    """
    User's surname
    """
    surname: String!
    """
    User's contact number
    """
    contact: String!
    """
    User's address
    """
    address: String!
    """
    City
    """
    city: String!
    """
    State (Province)
    """
    state: String!
    """
    State (Province) zip code
    """
    zip: String!
    """
    User bookings
    """
    bookings: [Booking!]!
    """
    User role
    """
    role: Role
  }

  """
  The booking type
  """
  type Booking {
    id: ID!
    vehicle: Vehicle!
    user: User!
    pickupDate: String!
    returnDate: String!
    status: BookingStatus!
  }

  """
  The vehicle type
  """
  type Vehicle {
    id: ID!
    group: VehicleGroup!
    size: VehicleSize!
    name: String!
    model: String!
    make: String!
    year: String!
    imageURI: String!
    status: VehicleStatus!
  }

  """
  The SuccessMessage type
  """
  type SuccessMessage {
    message: String
  }

  enum Role {
    ADMIN
  }

  enum VehicleSize {
    SMALL
    MEDIUM
    LARGE
  }

  enum VehicleGroup {
    A
    B
    C
    D
    E
  }

  enum VehicleStatus {
    AVAILABLE
    UNAVAILABLE
  }

  enum BookingStatus {
    BOOKED
    CANCELLED
    RETURNED
  }
`;

export const resolvers = {
  Mutation: {
    login: async (_: any, variables: any, __: any) => {
      try {
        const login = await api.login({
          password: variables.password,
          email: variables.email
        });

        // true if successful, error otherwise.
        return login.data.success;
      } catch (e) {
        throw Error(e.message)
      }
    },

    logout: async (_: any, __: any, ___: any) => {
      try {
        const logout = await api.logout();

        // true if successful, error otherwise.
        return logout.data.success;
      } catch (e) {
        throw Error(e.message)
      }
    }
  }
};