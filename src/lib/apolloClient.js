import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

let client = null;

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  fetchOptions: {
    mode: "cors",
  },
  fetch: (uri, options) => {
    return fetch(uri, options).then(response => {
      // Always try to parse as JSON, even on error status codes
      return response.text().then(text => {
        try {
          const json = JSON.parse(text);
          // Return a successful response so Apollo can parse GraphQL errors
          return new Response(JSON.stringify(json), {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        } catch (e) {
          // If not JSON, return original response
          return new Response(text, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
      });
    });
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Errors are already handled in Redux slices. This is just for debugging if needed
  if (process.env.NODE_ENV === 'development') {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error(`[GraphQL error]: ${message}`);
      });
    }
    if (networkError) {
      console.error(`[Network error]:`, networkError);
    }
  }
});

const authLink = setContext(() => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo() {
  if (typeof window === "undefined") return createApolloClient();
  if (!client) client = createApolloClient(); // singleton
  return client;
}
