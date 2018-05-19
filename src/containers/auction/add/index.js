import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ErrorBox from '../../../components/messageBoxs/error.js';
import SuccessBox from '../../../components/messageBoxs/success.js';

import AuctionAddForm from '../../../components/forms/auctionAdd.js';

const AuctionAdd = props => (
  <div>
    <h1>Auction / Add</h1>
    <p>
      <button onClick={() => props.redirectAuction()}>Back</button>
    </p>
    <p>Add new auction</p>
    <AuctionAddForm />
    {props.error ? <ErrorBox message={props.error} /> : null}
    {props.success ? <SuccessBox message={props.success} /> : null}
  </div>
);

const mapStateToProps = state => ({
  error: state.auction.error,
  success: state.auction.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      redirectAuction: () => push('/auction')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AuctionAdd);
