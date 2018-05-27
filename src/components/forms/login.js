import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Login } from '../../modules/partner';
import { toast } from 'react-toastify';

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
    if (this.state.username && this.state.password) {
      this.props.Login(this.state);
    } else {
      toast.warning('Please fill required fields and try again');
    }
    event.preventDefault();
  }

  componentWillReceiveProps(props) {
    if (props.error && props.error !== this.props.error) {
      toast.error(props.error);
    }
    if (props.success && props.success !== this.props.success) {
      toast.success(props.success);
    }
  }

  render() {
    const props = this.props;
    return (
      <div>
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

          <input type="submit" value="Login" disabled={props.isLogining} />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.partner.error,
  success: state.partner.success,
  isLogining: state.partner.isLogining
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Login
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
