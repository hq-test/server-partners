import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import AuctionList from '../../components/lists/auctionList.js';
import {
  ReadLive as LiveAuction,
  ReadArchived as ArchivedAuction,
  Subscribe as SubscribeAuction,
  UnSubscribe as UnSubscribeAuction,
  HandleClientCreate as HandleClientCreateAuction,
  HandleClientUpdate as HandleClientUpdateAuction,
  HandleClientDestroy as HandleClientDestroyAuction
} from '../../modules/auction';
import { Logout } from '../../modules/partner';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import moment from 'moment';

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: 'live'
    };
  }

  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.LiveAuction();
      this.props.ArchivedAuction();

      this.props.SubscribeAuction();
      const that = this;
      window.IO.socket.on('auction_model_create', function(data) {
        console.log('>>receive auction model create message', data);
        that.props.HandleClientCreateAuction(data);
      });

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
          position: toast.POSITION.TOP_CENTER
        });
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
    }
  }

  render() {
    const props = this.props;
    return (
      <div>
        <ToastContainer autoClose={8000} />
        <p>
          Welcome {props.loggedInUser.title},{' '}
          <button onClick={() => props.Logout()}>Logout</button>
        </p>
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
        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {this.state.activeLink === 'live' ? (
          props.liveList.length ? (
            <AuctionList items={props.liveList} onView={props.View} />
          ) : (
            <EmptyList />
          )
        ) : props.archivedList.length ? (
          <AuctionList items={props.archivedList} />
        ) : (
          <EmptyList />
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
  success: state.auction.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      SubscribeAuction,
      UnSubscribeAuction,
      ArchivedAuction,
      LiveAuction,
      Logout,
      HandleClientCreateAuction,
      HandleClientUpdateAuction,
      HandleClientDestroyAuction,
      View: id => push('/auction/view/' + id)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Auction);
