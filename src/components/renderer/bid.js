import React from 'react';
import * as moment from 'moment';
import AuctionItem from '../items/auctionItem.js';

var updateDatetime;
class Bid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: moment(props.item.bid.createdAt).fromNow(),
      updatedAt: moment(props.item.bid.updatedAt).fromNow()
    };
  }

  componentDidMount() {
    updateDatetime = setInterval(() => {
      this.setState({
        createdAt: moment(this.props.item.bid.createdAt).fromNow(),
        updatedAt: moment(this.props.item.bid.updatedAt).fromNow()
      });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(updateDatetime);
  }

  render() {
    const { bid, auction } = this.props.item;
    return (
      <div>
        <h2>
          {bid.status === 'Approved'
            ? 'YOU WIN'
            : bid.status === 'Rejected'
              ? 'YOU LOSE'
              : 'Your bid is Pending'}
        </h2>
        <h3>
          Bid{' '}
          <b style={{ color: 'blue' }}>{bid.bidAmount.toLocaleString()} BHT</b>{' '}
          with ID <b>#{bid.id}</b> that submited at{' '}
          <b>{this.state.createdAt}</b> modified to status{' '}
          <b style={{ color: 'blue' }}>{bid.status}</b> at{' '}
          <b>{this.state.updatedAt}</b>
        </h3>
        <AuctionItem data={auction} isReadOnly={true} />
      </div>
    );
  }
}

export default Bid;
