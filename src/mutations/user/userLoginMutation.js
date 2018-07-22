import gql from 'graphql-tag';

export default gql`
  mutation UserLoginMutation($input: UserLoginInput!) {
    UserLoginMutation(input: $input) {
      token
      error
    }
  }
`;
