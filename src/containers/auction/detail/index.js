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
  ResetLiveList as ResetLiveListBid,
  ReadLive as ReadLiveBid,
  ReadMore as ReadMoreBid,
  Subscribe as SubscribeBid,
  UnSubscribe as UnSubscribeBid,
  HandleClientUpdate as HandleClientUpdateBid,
  HandleClientCreate as HandleClientCreateBid
} from '../../../modules/bid';

import { toast } from 'react-toastify';

class AuctionDetail extends React.Component {
  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.SubscribeAuction();
      this.props.SubscribeBid(this.props.match.params.id);
      this.props.ReadLiveBid(this.props.match.params.id);

      const that = this;

      window.IO.socket.on('auction_model_update', function(data) {
        that.props.HandleClientUpdateAuction(data);
      });

      window.IO.socket.on('auction_model_destroy', function(data) {
        that.props.HandleClientDestroyAuction(data.id);
      });

      window.IO.socket.on('auction_model_close_winner', function(data) {
        toast.success(
          `Congratulations, Auction ${data.title} closed and your bid win.`,
          {
            position: toast.POSITION.TOP_CENTER
          }
        );
      });

      window.IO.socket.on('auction_model_close_loser', function(data) {
        toast.error(`Sorry, Auction ${data.title} closed and your bid lose.`, {
          position: toast.POSITION.BUTTOM_CENTER
        });
      });

      window.IO.socket.on('bid_model_loser', function(data) {
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
        that.props.HandleClientUpdateBid(data);
      });

      window.IO.socket.on('bid_model_create', function(data) {
        that.props.HandleClientCreateBid(data);
      });
    }
  }

  componentWillUnmount() {
    if (this.props.loggedInUser) {
      this.props.UnSubscribeAuction();
      this.props.UnSubscribeBid(this.props.match.params.id);
      this.props.ResetLiveListBid();

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
    if (props.errorBid && props.errorBid !== this.props.errorBid) {
      toast.error(props.errorBid);
    }
    if (props.successBid && props.successBid !== this.props.successBid) {
      toast.success(props.successBid);
    }
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
        <h1>Auction Detail</h1>

        <div>
          {props.liveList && props.liveList.length
            ? props.liveList.map(
                item =>
                  item.id == this.props.match.params.id ? (
                    <span key={item.id}>
                      {/* show auction detail live */}
                      <AuctionItem data={item} />

                      {/* show bid list and related load button */}
                      {props.bidList && props.bidList.length ? (
                        <div>
                          {/* show statistics of bids */}
                          <div
                            style={{
                              margin: 10
                            }}>
                            View {props.bidList.length} of {props.totalBids}{' '}
                            bids
                          </div>

                          {/* show list of bids */}
                          {props.bidList.map(bid => (
                            <BidItem key={bid.id} data={bid} />
                          ))}

                          {/* Read more button to go to other pages */}
                          <button
                            style={{
                              margin: 10,
                              display:
                                props.bidList.length < props.totalBids
                                  ? 'visible'
                                  : 'none'
                            }}
                            onClick={() => {
                              this.props.ReadMoreBid(item.id, props.maxId);
                            }}>
                            Load More
                          </button>
                        </div>
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
  totalBids: state.bid.totalBids,
  maxId: state.bid.maxId,
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
      ResetLiveListBid,
      ReadLiveBid,
      ReadMoreBid,
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
