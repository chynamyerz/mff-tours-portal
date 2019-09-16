import gql from 'graphql-tag';

/**
 * Register new user
 * 
 * parameters
 * email: 
 *      User's email address
 * name: 
 *      User's name
 * contact: 
 *      User's contact
 * address:
 *      User's street address
 * city:
 *      User's city
 * state:
 *      User's state (province)
 * zip: 
 *      User's state (province) zip code
 * password: 
 *      User's password
 */
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $surname: String!
    $contact: String!
    $address: String!
    $city: String!
    $state: String!
    $zip: String!
    $password: String!
  ){
    signup(
      email: $email
      name: $name
      surname: $surname
      contact: $contact
      address: $address
      city: $city
      state: $state
      zip: $zip
      password: $password
    ) {
      message
    }
  }
`;

/**
 * Update user information
 * 
 * parameters
 * email: 
 *      User's email address
 * name: 
 *      User's name
 * contact: 
 *      User's contact
 * address:
 *      User's street address
 * city:
 *      User's city
 * state:
 *      User's state (province)
 * zip: 
 *      User's state (province) zip code
 * password: 
 *      User's password
 * newPassword: 
 *      User's new password
 */
const USER_UPDATE_MUTATION = gql`
  mutation USER_UPDATE_MUTATION(
    $email: String
    $name: String
    $surname: String
    $contact: String
    $address: String
    $city: String
    $state: String
    $zip: String
    $password: String!
    $newPassword: String
  ){
    updateUser(
      email: $email
      name: $name
      surname: $surname
      contact: $contact
      address: $address
      city: $city
      state: $state
      zip: $zip
      password: $password
      newPassword: $newPassword
    ){
      message
    }
  }
`;

/**
 * Book a vehicle
 * 
 * parameters
 * vehicleId:
 *      Vehicle id to book
 * pickupDate:
 *      A vehicle pick up date
 * returnDate:
 *      A vehicle return date
 */
const BOOK_VEHICLE_MUTATION = gql`
  mutation BOOK_VEHICLE_MUTATION(
    $beyondKZN: Boolean!
    $email: String
    $vehicleId: ID!
    $pickupDate: String!
    $returnDate: String!
  ){
    bookVehicle(
      beyondKZN: $beyondKZN
      email: $email
      vehicleId: $vehicleId
      pickupDate: $pickupDate
      returnDate: $returnDate
    ){
      message
    }
  }
`;

/**
 * Cancel vehicle booking
 * 
 * parameters
 * bookingId:
 *      A booking id
 */
const CANCEL_VEHICLE_BOOKING_MUTATION = gql`
  mutation CANCEL_VEHICLE_BOOKING_MUTATION(
    $bookingId: ID!
  ){
    cancelBooking(
      bookingId: $bookingId
    ){
      message
    }
  }
`;

/**
 * Add a vehicle
 * 
 * parameters
 * group:
 *      Vehicle group
 * size:
 *      Vehicle size
 * name:
 *      Vehicle name
 * model:
 *      Vehicle model
 * make:
 *      Vehicle make
 * year:
 *      Vehicle year
 * imageURI:
 *      Vehiccle image uri
 * status:
 *      Vehicle status
 */
const ADD_VEHICLE_MUTATION = gql`
  mutation ADD_VEHICLE_MUTATION(
    $group: String!
    $size: String!
    $name: String!
    $model: String!
    $make: String!
    $year: String!
    $imageURI: String!
    $status: String!
    $location: String!
    $doors: Int!
    $seaters: Int!
    $fuelType: String!
    $transmissionType: String!
    $airType: String!
    $bags: Int!
    $price: String!
  ){
    addVehicle(
      group: $group
      size: $size
      name: $name
      model: $model
      make: $make
      year: $year
      imageURI: $imageURI
      status: $status
      location: $location
      doors: $doors
      seaters: $seaters
      fuelType: $fuelType
      transmissionType: $transmissionType
      airType: $airType
      bags: $bags
      price: $price
    ){
      message
    }
  }
`;

/**
 * Update a vehicle
 * 
 * parameters
 * group:
 *      Vehicle group
 * size:
 *      Vehicle size
 * name:
 *      Vehicle name
 * model:
 *      Vehicle model
 * make:
 *      Vehicle make
 * year:
 *      Vehicle year
 * imageURI:
 *      Vehiccle image uri
 * status:
 *      Vehicle status
 */
const UPDATE_VEHICLE_MUTATION = gql`
  mutation UPDATE_VEHICLE_MUTATION(
    $vehicleId: ID!
    $group: String
    $size: String
    $name: String
    $model: String
    $make: String
    $year: String
    $imageURI: String
    $status: String
    $location: String
    $doors: Int
    $seaters: Int
    $fuelType: String
    $transmissionType: String
    $airType: String
    $bags: Int
    $price: String
    $password: String!

  ){
    updateVehicle(
      vehicleId: $vehicleId
      group: $group
      size: $size
      name: $name
      model: $model
      make: $make
      year: $year
      imageURI: $imageURI
      status: $status
      location: $location
      doors: $doors
      seaters: $seaters
      fuelType: $fuelType
      transmissionType: $transmissionType
      airType: $airType
      bags: $bags
      price: $price
      password: $password
    ){
      message
    }
  }
`;

/**
 * Update a vehicle
 * 
 * parameters
 * group:
 *      Vehicle group
 * size:
 *      Vehicle size
 * name:
 *      Vehicle name
 * model:
 *      Vehicle model
 * make:
 *      Vehicle make
 * year:
 *      Vehicle year
 * imageURI:
 *      Vehiccle image uri
 * status:
 *      Vehicle status
 */
const DELETE_VEHICLE_MUTATION = gql`
  mutation DELETE_VEHICLE_MUTATION(
    $vehicleId: ID!
    $password: String!
  ){
    deleteVehicle(
      vehicleId: $vehicleId
      password: $password
    ){
      message
    }
  }
`;

/**
 * The search vehicles mutation
 * location:
 *      A vehicles pick up location
 * pickupDate:
 *      A vehicle pick up date
 * returnDate:
 *      A vehicle return date
 */
const SEARCH_VEHICLE_MUTATION = gql`
  mutation SEARCH_VEHICLE_MUTATION(
    $location: String!
    $pickupDate: String!
    $returnDate: String!
  ) {
    searchVehicles(
      location: $location
      pickupDate: $pickupDate
      returnDate: $returnDate
    ) {
      id
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
  }
`;

/**
 * Log the user in.
 *
 * The following arguments must be supplied
 *
 * password:
 *     The password.
 * email:
 *     The email address.
 */
const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION(
    $email: String!
    $password: String!
  ) {
    login(
      password: $password
      email: $email
    ) @client
  }
`;

/**
 * Logout the currently logged in user.
 */
const LOGOUT_USER_MUTATION = gql`
  mutation LOGOUT_USER_MUTATION {
    logout @client
  }
`;

/**
 * Request reset the password
 * 
 * parameters
 * email:
 *      User's email address
 */
const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(
      email: $email
    ) {
      message
    }
  }
`;

/**
 * Reset password
 * 
 * parameters
 * oneTimePin:
 *      One time pin to enable password reset
 * password:
 *      User's new password
 */
const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $oneTimePin: String!
    $password: String!
  ) {
    resetPassword(
      oneTimePin: $oneTimePin
      password: $password
    ) {
      message
    }
  }
`;

/**
 * Send an email
 *
 * parameters
 * content:
 *      An email content
 */
const SEND_EMAIL_MUTATION = gql`
    mutation SEND_EMAIL_MUTATION(
        $content: String!
    ){
        sendEmail(
            content: $content
        ){
            message
        }
    }
`;

export { 
  SEARCH_VEHICLE_MUTATION,
  ADD_VEHICLE_MUTATION,
  BOOK_VEHICLE_MUTATION,
  CANCEL_VEHICLE_BOOKING_MUTATION,
  DELETE_VEHICLE_MUTATION,
  USER_UPDATE_MUTATION, 
  RESET_PASSWORD_MUTATION, 
  REQUEST_RESET_MUTATION, 
  SIGNUP_MUTATION, 
  LOGIN_MUTATION,
  LOGOUT_USER_MUTATION,
  SEND_EMAIL_MUTATION,
  UPDATE_VEHICLE_MUTATION
}