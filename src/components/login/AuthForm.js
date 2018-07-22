// @flow
import * as React from 'react';

type Props = {};
type State = {
  email: string,
  password: string,
};

class AuthForm extends React.Component<Props, State> {
  state = { email: '', password: '' };

  onAuthFormSubmit = (event: Object) => {
    event.preventDefault();

    this.props.onSubmit(this.state);
  };

  render() {
    const { email, password } = this.state;
    return (
      <div className="row">
        <form onSubmit={this.onAuthFormSubmit} className="col s6">
          <div className="input-field">
            <input
              placeholder="Email"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="errors">
            {this.props.errors.map(error => <div key={error}>{error}</div>)}
          </div>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
