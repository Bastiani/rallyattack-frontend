// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  //Redirect,
  //withRouter,
} from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';

import Auth from './auth/Auth';
import Login from './components/login/LoginForm';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      CurrentUser: (_, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: 'me', id }),
    },
  },
});

const request = async operation => {
  const token = await localStorage.getItem('accessToken');
  operation.setContext({
    headers: {
      authorization: token,
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true,
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected } });
            return null;
          },
        },
      },
      cache,
    }),
    new HttpLink({
      uri: 'http://localhost:5000/graphql',
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
});

const Public = () => <h3>Public</h3>;
const Protected = props => <h3>Protected {props.data.me.name}</h3>;

// const AuthButton = withRouter(
//   ({ history }) =>
//     fakeAuth.isAuthenticated ? (
//       <p>
//         Welcome!
//         <button
//           type="button"
//           onClick={() => {
//             fakeAuth.signout(() => history.push('/'));
//           }}
//         >
//           Sign out
//         </button>
//       </p>
//     ) : (
//       <p>You are not logged in.</p>
//     )
// );

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          {/* <AuthButton /> */}
          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>
          <Route path="/public" component={Public} />
          <Route path="/login" component={Login} />
          <Auth path="/protected" component={Protected} />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
