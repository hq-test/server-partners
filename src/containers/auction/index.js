import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import AuctionList from '../../components/lists/auctionList.js';
import {
  Subscribe as SubscribeAuction,
  UnSubscribe as UnSubscribeAuction,
  HandleClientCreate as HandleClientCreateAuction,
  HandleClientUpdate as HandleClientUpdateAuction,
  HandleClientDestroy as HandleClientDestroyAuction
} from '../../modules/auction';
import { toast } from 'react-toastify';

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: 'live'
    };
  }

  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.SubscribeAuction();
      const that = this;
      window.IO.socket.on('auction_model_create', function(data) {
        that.props.HandleClientCreateAuction(data);
      });

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
    }
  }

  componentWillUnmount() {
    if (this.props.loggedInUser) {
      this.props.UnSubscribeAuction();
      window.IO.socket.off('auction_model_create');
      window.IO.socket.off('auction_model_update');
      window.IO.socket.off('auction_model_destroy');
      window.IO.socket.off('auction_model_close_winner');
      window.IO.socket.off('auction_model_close_loser');
      window.IO.socket.off('bid_model_loser');
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
        <h1>Auctions</h1>
        <div>
          <button
            style={
              this.state.activeLink === 'live'
                ? { backgroundColor: 'yellow' }
                : {}
            }
            onClick={() => {
              this.setState({ activeLink: 'live' });
            }}>
            Live
          </button>
          <button
            style={
              this.state.activeLink === 'archived'
                ? { backgroundColor: 'yellow' }
                : {}
            }
            onClick={() => {
              this.setState({ activeLink: 'archived' });
            }}>
            Archived
          </button>
        </div>

        {this.state.activeLink === 'live' ? (
          props.liveList.length ? (
            /* show live auction list */
            <AuctionList items={props.liveList} onView={props.View} />
          ) : (
            <EmptyList message="Please wait. There is no live auction yet, as soon as any auction created by admin it will show here." />
          )
        ) : props.archivedList.length ? (
          /* show archived auction list */
          <AuctionList items={props.archivedList} />
        ) : (
          <EmptyList message="Archive list of auctions is empty" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.partner.loggedInUser,
  liveList: state.auction.liveList,
  archivedList: state.auction.archivedList,
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
      HandleClientCreateAuction,
      HandleClientUpdateAuction,
      HandleClientDestroyAuction,
      View: id => push('/auction/view/' + id)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Auction);
