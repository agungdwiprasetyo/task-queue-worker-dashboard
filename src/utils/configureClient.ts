import { ApolloClient } from 'apollo-client';
import { split, ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import withApollo from 'next-with-apollo';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { WebSocketLink } from 'apollo-link-ws';
import Cookies from 'js-cookie';

interface Definintion {
  kind: string;
  operation?: string;
}

let authToken = null;

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: authToken || null,
    },
  });
  // Add onto payload for WebSocket authentication
  (operation as any & { authToken: string | undefined }).authToken = authToken;

  return forward(operation);
});

const getHost = (isWebsocket: boolean) => {
  if (typeof window === "undefined") {
    return "";
  }
  let protocol = window.location.protocol;

  if (isWebsocket) {
    protocol = protocol.replace(/http/gi, "ws");
  }
  let host = window.location.host;
  let path = window.location.pathname.replace("/task", "");
  if (path == "/") path = "";
  return `${protocol}//${host}${path}`;
}

const httpLink = new HttpLink({
  fetch,
  uri: process.env.REACT_APP_GRAPHQL_HOST || `${getHost(false)}/graphql`,
});

const webSocketLink: any = process.browser
  ? new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS || `${getHost(true)}/graphql`,
    options: {
      reconnect: true,
    },
  })
  : null;

/**
 * Set Token
 * @param token
 */
export const setToken = async (token: string) => {
  try {
    authToken = token ? `Bearer ${token}` : null;
    Cookies.set('token', authToken, { expires: 7 });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Set Token In Request
 * @param token
 */
export const setTokenInRequest = async (token: string) => {
  try {
    authToken = token ? token : null;
    return authToken;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Destroy Token
 * For logout purpose
 */
export const destroyToken = async () => {
  try {
    Cookies.remove('token');
    authToken = null;
  } catch (error) {
    console.log(error);
  }
};

const link = process.browser
  ? split(
    ({ query }) => {
      const { kind, operation }: Definintion = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    webSocketLink,
    httpLink
  )
  : httpLink;

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      ssrMode: typeof window === "undefined",
      link: concat(authMiddleware, link),
      cache: new InMemoryCache().restore(initialState || {}),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }
    })
);
