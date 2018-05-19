import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import AuctionList from '../../components/lists/auctionList.js';
import { Read } from '../../modules/auction';
import { Logout } from '../../modules/partner';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';

class Auction extends React.Component {
  render() {
    const props = this.props;
    return (
      <div>
        <p>
          Welcome {props.loggedInUser.title},{' '}
          <button onClick={() => props.Logout()}>Logout</button>
        </p>
        <h1>Auction</h1>

        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {props.list.length ? (
          <AuctionList items={props.list} onView={props.View} />
        ) : (
          <EmptyList />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.partner.loggedInUser,
  list: state.auction.list,
  error: state.auction.error,
  success: state.auction.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Logout,
      Read,
      View: id => push('/auction/view/' + id)
      //redirectHome: id => push('/')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Auction);
