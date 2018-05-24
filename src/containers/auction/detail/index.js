import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AuctionItem from '../../../components/items/auctionItem.js';
import {
  Subscribe as SubscribeAuction,
  UnSubscribe as UnSubscribeAuction,
  HandleClientUpdate as HandleClientUpdateAuction,
  HandleClientDestroy as HandleClientDestroyAuction
} from '../../../modules/auction';
import { toast } from 'react-toastify';
// var _ = require('lodash');

class AuctionDetail extends React.Component {
  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.SubscribeAuction();
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
    }
  }

  componentWillUnmount() {
    if (this.props.loggedInUser) {
      this.props.UnSubscribeAuction();
      window.IO.socket.off('auction_model_update');
      window.IO.socket.off('auction_model_destroy');
      window.IO.socket.off('auction_model_close_winner');
      window.IO.socket.off('auction_model_close_loser');
      window.IO.socket.off('bid_model_loser');
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
                    <AuctionItem key={item.id} data={item} />
                  ) : null
              )
            : 'This auction is not LIVE now'}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
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
      HandleClientDestroyAuction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AuctionDetail);
