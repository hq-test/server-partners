import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AuctionItem from '../../../components/items/auctionItem.js';
import BidItem from '../../../components/items/bidItem.js';
import EmptyList from '../../../components/lists/emptyList.js';

import {
  Subscribe as SubscribeAuction,
  UnSubscribe as UnSubscribeAuction,
  HandleClientUpdate as HandleClientUpdateAuction,
  HandleClientDestroy as HandleClientDestroyAuction
} from '../../../modules/auction';

import {
  Subscribe as SubscribeBid,
  UnSubscribe as UnSubscribeBid,
  HandleClientUpdate as HandleClientUpdateBid,
  HandleClientCreate as HandleClientCreateBid
} from '../../../modules/bid';

import { toast } from 'react-toastify';
// var _ = require('lodash');

class AuctionDetail extends React.Component {
  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.SubscribeAuction();
      this.props.SubscribeBid(this.props.match.params.id);

      const that = this;

      console.log('AuctionDetail > componentDidMount ', this.props);

      window.IO.socket.on('auction_model_update', function(data) {
        console.log('>>receive auction model update message', data);
        that.props.HandleClientUpdateAuction(data);
      });

      window.IO.socket.on('auction_model_destroy', function(data) {
        console.log('>>receive auction model destroy message', data);
        that.props.HandleClientDestroyAuction(data.id);
      });

      window.IO.socket.on('auction_model_close_winner', function(data) {
        console.log('>>>>>> receive auction close message WIN', data);
        toast.success(
          `Congratulations, Auction ${data.title} closed and your bid win.`,
          {
            position: toast.POSITION.TOP_CENTER
          }
        );
      });

      window.IO.socket.on('auction_model_close_loser', function(data) {
        console.log('>>>>>> receive auction close message LOSE', data);
        toast.error(`Sorry, Auction ${data.title} closed and your bid lose.`, {
          position: toast.POSITION.BUTTOM_CENTER
        });
      });

      window.IO.socket.on('bid_model_loser', function(data) {
        console.log('>>>>>> receive bid loser message', data);
        toast.error(
          `Sorry, Your bid with ID ${data.id} for auction ID ${
            data.auction
          } LOSE`,
          {
            position: toast.POSITION.BUTTOM_CENTER
          }
        );
      });

      window.IO.socket.on('bid_model_update', function(data) {
        console.log('>>receive bid model update message', data);
        that.props.HandleClientUpdateBid(data);
      });

      window.IO.socket.on('bid_model_create', function(data) {
        console.log('>>receive bid model create message', data);
        that.props.HandleClientCreateBid(data);
      });
    }
  }

  componentWillUnmount() {
    if (this.props.loggedInUser) {
      this.props.UnSubscribeAuction();
      this.props.UnSubscribeBid(this.props.match.params.id);

      window.IO.socket.off('auction_model_update');
      window.IO.socket.off('auction_model_destroy');
      window.IO.socket.off('auction_model_close_winner');
      window.IO.socket.off('auction_model_close_loser');
      window.IO.socket.off('bid_model_loser');

      window.IO.socket.off('bid_model_update');
      window.IO.socket.off('bid_model_create');
    }
  }

  componentWillReceiveProps(props) {
    if (props.errorBid) {
      toast.error(props.errorBid);
    }
    if (props.successBid) {
      toast.success(props.successBid);
    }
    if (props.error) {
      toast.error(props.error);
    }
    if (props.success) {
      toast.success(props.success);
    }
  }

  render() {
    const props = this.props;
    return (
      <div>
        <h1>Auction Detail</h1>

        <div>
          {props.liveList && props.liveList.length
            ? props.liveList.map(
                item =>
                  item.id == this.props.match.params.id ? (
                    <span key={item.id}>
                      <AuctionItem data={item} />
                      {props.bidList && props.bidList.length ? (
                        props.bidList.map(bid => <BidItem data={bid} />)
                      ) : (
                        <EmptyList message="There is not submited any bid yet." />
                      )}
                    </span>
                  ) : null
              )
            : 'This auction is not LIVE now'}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bidList: state.bid.bidList,
  liveList: state.auction.liveList,
  loggedInUser: state.partner.loggedInUser,
  error: state.auction.error,
  success: state.auction.success,
  errorBid: state.bid.error,
  successBid: state.bid.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      SubscribeAuction,
      UnSubscribeAuction,
      HandleClientUpdateAuction,
      HandleClientDestroyAuction,
      SubscribeBid,
      UnSubscribeBid,
      HandleClientUpdateBid,
      HandleClientCreateBid
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AuctionDetail);
