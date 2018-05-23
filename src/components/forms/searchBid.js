import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Search } from '../../modules/bid';
import { toast } from 'react-toastify';

class SearchBid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bidId: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.bidId) {
      this.props.Search(this.state.bidId);
    } else {
      toast.warning('please specify a bid ID and then press search button');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Your Bid ID :
          <input
            style={{ width: 100 }}
            name="bidId"
            type="text"
            value={this.state.bidId}
            onChange={this.handleChange}
          />
        </label>
        <input
          type="submit"
          value={this.props.isSearching ? 'Searching ...' : 'Search'}
          disabled={this.props.isSearching}
        />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  isSearching: state.bid.isSearching
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Search
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(SearchBid);
