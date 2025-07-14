
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: 'https://erma.shop/graphql',
  fetchOptions: {
    mode: 'cors',
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { authorization: `Basic ${token}` }),
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
      
      // Handle authentication errors
      if (message.includes('login') || message.includes('authentication')) {
        console.warn('Authentication error in GraphQL API');
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    
    // If it's a 403 or other auth error, we'll handle it gracefully
    if ('statusCode' in networkError && (networkError.statusCode === 403 || networkError.statusCode === 401)) {
      console.warn('Authentication error - trying to clear invalid token');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        fields: {
          reviews: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
      fetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'ignore',
      fetchPolicy: 'cache-first',
    },
  },
});
