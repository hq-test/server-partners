import React from 'react';
import * as moment from 'moment';
import Countdown from 'react-countdown-now';
var updateDatetime;

class AuctionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(props.data.startAt)
    };
  }

  componentDidMount() {
    updateDatetime = setInterval(() => {
      this.setState({ startDate: moment(this.props.startAt) });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(updateDatetime);
  }

  render() {
    const { data, onView } = this.props;
    return (
      <div
        style={{
          border: '1px solid black',
          margin: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: 10,
          float: 'left'
        }}>
        <h1>{data.title}</h1>
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
        <div style={{ width: '45vw', float: 'right', padding: 20 }}>
          <p>{data.room && data.room.title}</p>
          <h3>{data.minimumAllowedBid} BHT</h3>
          <p>
            start from{' '}
            <span style={{ color: 'green' }}>
              {this.state.startDate.fromNow()}
            </span>{' '}
            for{' '}
            <span style={{ color: 'green' }}>
              {data.endAt > new Date().getTime() ? (
                <Countdown date={data.endAt} />
              ) : (
                moment(data.endAt).diff(data.startAt, 'minutes') + ' Minutes'
              )}
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default AuctionItem;
