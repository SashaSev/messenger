import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';

// eslint-disable-next-line new-cap
const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5001/subscriptions',
  options: {
    reconnect: true,
  },
});
// eslint-disable-next-line consistent-return,no-unused-vars
const errorLink = onError((error) => {
  const {
    // eslint-disable-next-line no-unused-vars
    graphQLErrors = [], networkError = {}, operation = {}, forward,
  } = error || {};
  const { getContext } = operation || {};
  // eslint-disable-next-line no-unused-vars
  const { scope, headers = {} } = getContext() || {};
  const { message: networkErrorMessage = '' } = networkError || {};
  const networkFailed = (message) => typeof message === 'string'
    && message.startsWith('NetworkError when attempting to fetch resource');

  if (networkFailed(networkErrorMessage)) return forward(operation);
});
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

const linkMiddleware = ApolloLink.from([
  middlewareLink,
  addDatesLink,
  httpLink,
]);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  linkMiddleware || undefined,
);

const cache = new InMemoryCache();

export const client = new ApolloClient({
  cache,
  link: splitLink,
});
