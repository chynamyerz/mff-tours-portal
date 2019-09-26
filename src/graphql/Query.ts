import gql from 'graphql-tag';

/**
 * The user query
 */
const USER_QUERY = gql`
  query USER_QUERY {
    user {
      id
      email
      name
      surname
      contact
      address
      city
      state
      zip
      role
      bookings {
        id
        pickupDate
        returnDate
        status
        vehicle {
          id
          group
          size
          count
          name
          model
          make
          year
          imageURI
          status
          location
          doors
          seaters
          fuelType
          transmissionType
          airType
          bags
          price
        }
      }
    }
  }
`;

/**
 * The users query
 */
const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      email
      name
      surname
      contact
      address
      city
      state
      zip
      role
      bookings {
        id
        pickupDate
        returnDate
        status
        vehicle {
          id
          group
          size
          count
          name
          model
          make
          year
          imageURI
          status
          location
          doors
          seaters
          fuelType
          transmissionType
          airType
          bags
          price
        }
      }
    }
  }
`;

/**
 * The vehicle bookings query
 */
const VEHICLE_BOOKINGS_QUERY = gql`
  query VEHICLE_BOOKINGS_QUERY {
    bookings {
      id
      pickupDate
      returnDate
      status
      vehicle {
        id
        count
        group
        size
        name
        model
        make
        year
        imageURI
        status
        location
        doors
        seaters
        fuelType
        transmissionType
        airType
        bags
        price
      }
      user {
        id
        email
        name
        surname
        contact
        address
        city
        state
        zip
        role
      }
    }
  }
`;

/**
 * The vehicles query
 */
const VEHICLE_QUERY = gql`
  query VEHICLE_QUERY {
    vehicles {
      id
      group
      size
      count
      name
      model
      make
      year
      imageURI
      status
      location
      doors
      seaters
      fuelType
      transmissionType
      airType
      bags
      price
    }
  }
`;

export { 
  USER_QUERY, 
  USERS_QUERY,
  VEHICLE_BOOKINGS_QUERY,
  VEHICLE_QUERY
};