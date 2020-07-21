import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
// Apollo connect
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import App from './App';

const cache = new InMemoryCache();

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'x-token': localStorage.getItem('token') || null,
      'x-token-refresh': localStorage.getItem('refreshToken') || null,
    },
  });
  return forward(operation);
});

const addDatesLink = new ApolloLink((operation, forward) => forward(operation).map((response) => {
  const context = operation.getContext();
  const {
    response: { headers },
  } = context;
  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-token-refresh');

    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
  return response;
}));

// eslint-disable-next-line new-cap
const httpLink = new createHttpLink({
  uri: 'http://localhost:5001/graphql',
});
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([middlewareLink, addDatesLink, httpLink]),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
