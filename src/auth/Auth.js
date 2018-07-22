// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Route, Redirect } from 'react-router-dom';
import idx from 'idx';

import currentUserQuery from '../queries/user/currentUser';

const Auth = ({ component: Component, data, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      idx(data, _ => _.me) ? (
        <Component {...props} data={data} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default graphql(currentUserQuery)(Auth);
