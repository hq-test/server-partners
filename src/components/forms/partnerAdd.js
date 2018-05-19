import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Create } from '../../modules/partner';

class PartnerAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
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
    if (this.state.title && this.state.username && this.state.password) {
      this.props.Create(this.state);
    } else {
      alert('Please fill required fields and try again');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
        </label>
        <br />

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

        <input type="submit" value="Save" />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.partner.error
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Create
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(PartnerAddForm);
