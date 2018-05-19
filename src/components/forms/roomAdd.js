import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Create } from '../../modules/room';

class RoomAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      mainImageUri: '',
      isActive: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const fieldValue =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    this.setState({ [event.target.name]: fieldValue });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.title) {
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
          Image URI:
          <input
            name="mainImageUri"
            type="text"
            value={this.state.mainImageUri}
            onChange={this.handleChange}
          />
        </label>
        <br />

        <label>
          Is active:
          <input
            name="isActive"
            type="checkbox"
            checked={this.state.isActive}
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
  error: state.room.error
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Create
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(RoomAddForm);
