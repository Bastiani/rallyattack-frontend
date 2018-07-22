// @flow
// import * as React from 'react';

// type Props = {}

// export default class Login extends React.Component<Props> {
//   state = {
//     redirectToReferrer: false,
//   };
//   login = () => {
//     fakeAuth.authenticate(() => {
//       this.setState(() => ({
//         redirectToReferrer: true,
//       }));
//     });
//   };
//   render() {
//     const { from } = this.props.location.state || { from: { pathname: '/' } };
//     const { redirectToReferrer } = this.state;

//     if (redirectToReferrer === true) {
//       return <Redirect to={from} />;
//     }
//     return (
//       <div>
//         <p>You must log in to view the page</p>
//         <button type="button" onClick={this.login}>
//           Log in
//         </button>
//       </div>
//     );
//   }
// }

import * as React from 'react';

import { graphql } from 'react-apollo';

import UserLoginMutation from '../../mutations/user/userLoginMutation';
import CurrentUser from '../../queries/user/currentUser';

import AuthForm from './AuthForm';

type Props = {};
type State = {
  errors: Array<string>,
};

class LoginForm extends React.Component<Props, State> {
  state = { errors: [] };

  onSubmit = ({ email, password }) => {
    const { mutate } = this.props;
    mutate({
      variables: { input: { email, password } },
      refetchQueries: [{ query: CurrentUser }],
    })
      .then(({ data: { UserLoginMutation } }) =>
        localStorage.setItem('accessToken', UserLoginMutation.token)
      )
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      });
  };

  render() {
    return (
      <div>
        <h3>Login</h3>
        <AuthForm errors={this.state.errors} onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default graphql(CurrentUser)(graphql(UserLoginMutation)(LoginForm));
