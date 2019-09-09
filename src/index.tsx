import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { resolvers, typeDefs } from "./resolvers";

const client = new ApolloClient({
  link: createHttpLink({
    credentials: "include",
    uri: process.env.REACT_APP_MMF_BACKEND_URL
  }),
  cache: new InMemoryCache(),
  resolvers,
  typeDefs
});

ReactDOM.render(
  <ApolloProvider client={client}>
     <Router>
      <App />
    </Router>
  </ApolloProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
