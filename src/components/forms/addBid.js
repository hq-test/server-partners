import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Create as createBid } from '../../modules/bid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddBidForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: (
        props.minimumAllowedBid +
        props.minimumAllowedBid * 0.05
      ).toFixed(0)
    };

    console.log('in addBid constructor', this.state);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.amount > this.props.minimumAllowedBid) {
      this.props.createBid({
        auction: this.props.auctionId,
        partner: this.props.loggedInUser.id,
        bidAmount: this.state.amount
      });
    } else {
      toast.warning('Your bid must be larger than last bid!');
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('new props received', nextProps);
    this.setState({
      amount: (
        nextProps.minimumAllowedBid +
        nextProps.minimumAllowedBid * 0.05
      ).toFixed(0)
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Your Bid :
          <input
            style={{ width: 100 }}
            name="amount"
            type="text"
            value={this.state.amount}
            onChange={this.handleChange}
          />{' '}
          BHT
        </label>
        <input type="submit" value="Send" />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.partner.loggedInUser
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createBid
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(AddBidForm);
