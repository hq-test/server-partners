import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import AuctionList from '../../components/lists/auctionList.js';
import {
  Read,
  ReadLive as LiveAuction,
  ReadArchived as ArchivedAuction
} from '../../modules/auction';
import { Logout } from '../../modules/partner';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';
import moment from 'moment';

var a = moment(new Date());
var b = moment(new Date());
console.log(a.from(b)); // "a day ago"

class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: 'live'
    };
  }

  render() {
    const props = this.props;
    return (
      <div>
        <p>
          Welcome {props.loggedInUser.title},{' '}
          <button onClick={() => props.Logout()}>Logout</button>
        </p>
        <h1>Auctions</h1>
        <div>
          <button
            style={
              this.state.activeLink == 'live'
                ? { backgroundColor: 'yellow' }
                : {}
            }
            onClick={() => {
              this.setState({ activeLink: 'live' });
              props.LiveAuction();
            }}>
            Live
          </button>
          <button
            style={
              this.state.activeLink == 'archived'
                ? { backgroundColor: 'yellow' }
                : {}
            }
            onClick={() => {
              this.setState({ activeLink: 'archived' });
              props.ArchivedAuction();
            }}>
            Archived
          </button>
        </div>
        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {this.state.activeLink == 'live' ? (
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
      ArchivedAuction,
      LiveAuction,
      Logout,
      Read,
      View: id => push('/auction/view/' + id)
      //redirectHome: id => push('/')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Auction);
