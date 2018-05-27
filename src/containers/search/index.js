import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchBid from '../../components/forms/searchBid.js';
import Bid from '../../components/renderer/bid.js';
import { ResetSearch } from '../../modules/bid';
import { toast } from 'react-toastify';

class Search extends React.Component {
  componentWillReceiveProps(props) {
    if (props.searchError) {
      toast.error(props.searchError);
    }
    if (props.searchSuccess) {
      toast.success(props.searchSuccess);
    }
  }

  componentWillUnmount() {
    this.props.ResetSearch();
  }

  render() {
    const props = this.props;
    return (
      <div>
        <h1>Search</h1>
        <SearchBid />
        {props.searchItem ? <Bid item={props.searchItem} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchError: state.bid.searchError,
  searchSuccess: state.bid.searchSuccess,
  searchItem: state.bid.searchItem
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ResetSearch
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Search);
