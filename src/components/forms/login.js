import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Login } from '../../modules/partner';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.username && this.state.password) {
      this.props.Login(this.state);
    } else {
      alert('Please fill required fields and try again');
    }
  }

  render() {
    const props = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Login:</h2>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <br />

        <label>
          Password:
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <br />

        <input type="submit" value="Login" />

        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.partner.error,
  success: state.partner.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Login
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
