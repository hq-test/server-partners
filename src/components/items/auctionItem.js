import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Link } from 'react-router-dom';

import Countdown from 'react-countdown-now';

import AddBidForm from '../forms/addBid.js';
var updateDatetime;

class AuctionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(props.data.startAt).fromNow()
    };
  }

  componentDidMount() {
    updateDatetime = setInterval(
      () => {
        this.setState({
          startDate: moment(this.props.data.startAt).fromNow()
        });
      },
      // update the times every 1 minute
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(updateDatetime);
  }

  render() {
    const { data, loggedInUser, isReadOnly = false } = this.props;

    // define the minimum allowed bid for this auction
    const minimumAllowedBid =
      data.bids && data.bids.length
        ? data.bids[0].bidAmount
        : data.minimumAllowedBid;

    // define last bid price of this auction
    const lastBid =
      data.bids && data.bids.length
        ? data.bids[0].bidAmount.toLocaleString()
        : '-';

    // define this auction status
    const isWinner =
      data.bids && data.bids.length
        ? data.bids[0].status === 'Approved' &&
          data.bids[0].partner === loggedInUser.id
          ? true
          : false
        : false;

    return (
      <div
        style={{
          border: '1px solid black',
          margin: 10,
          backgroundColor: data.isRunning
            ? 'rgba(0, 0, 0, 0.05)'
            : isWinner
              ? 'rgba(0, 255, 0, 0.05)'
              : 'rgba(255, 0, 0, 0.05)',
          padding: 10,
          float: 'left'
        }}>
        {/* show auction title */}
        <h1>
          <Link to={`/auction/${data.id}`}>
            #{data.id}: {data.title}
          </Link>
        </h1>

        {/* show auction image */}
        <Link to={`/auction/${data.id}`}>
          <img
            style={{ width: '45vw', float: 'left' }}
            src={
              (data.room && data.room.mainImageUri) ||
              'http://mp3aux.com/assets/images/empty.png'
            }
            alt={
              (data.room && data.room.mainImageUri) ||
              'http://mp3aux.com/assets/images/empty.png'
            }
          />
        </Link>

        {/* show auction detail */}
        <div style={{ width: '45vw', float: 'right', padding: 20 }}>
          <p>
            start from {/* auction start at */}
            <span style={{ color: 'green' }}>
              {this.state.startDate}
            </span> for {/* auction duration */}
            <span style={{ color: 'green' }}>
              {data.endAt > new Date().getTime() ? (
                <Countdown date={data.endAt} />
              ) : (
                moment(data.endAt).diff(data.startAt, 'minutes') + ' Minutes'
              )}
            </span>
          </p>

          {/* room title */}
          <p>{data.room && data.room.title}</p>

          {/* minimum allowed bid price */}
          <p>
            Minimum Allowed Bid was{' '}
            <span style={{ color: 'black' }}>
              {data.minimumAllowedBid.toLocaleString()}
            </span>{' '}
            BHT
          </p>

          {/* last bid price */}
          <p>
            Last bid was <span style={{ color: 'green' }}>{lastBid}</span> BHT
          </p>

          {/* If it is a LIVE bid show add bid form */}
          {data.isRunning ? (
            isReadOnly ? null : (
              <span>
                {/* add new bid form */}
                <AddBidForm
                  auctionId={data.id}
                  minimumAllowedBid={minimumAllowedBid}
                />
              </span>
            )
          ) : isWinner ? (
            <h1 style={{ color: 'green' }}>You Win</h1>
          ) : (
            <h1 style={{ color: 'red' }}>You Lose</h1>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.partner.loggedInUser
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(AuctionItem);
