import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as moment from 'moment';

var updateDatetime;

class BidItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: moment(props.data.createdAt).fromNow()
    };
  }

  componentDidMount() {
    updateDatetime = setInterval(() => {
      this.setState({ createdAt: moment(this.props.data.createdAt).fromNow() });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(updateDatetime);
  }

  render() {
    const { data } = this.props;

    return (
      <div
        style={{
          margin: 10,
          padding: 10,
          width: '100vw',
          border: 1,
          float: 'left',
          clear: 'both',
          backgroundColor:
            data.status === 'Pending'
              ? 'rgba(0,0,0,.1)'
              : data.status === 'Approved'
                ? 'rgba(0,255,0,.1)'
                : 'rgba(255,0,0,.1)'
        }}>
        <span>#{data.id}</span> [
        <span>{data.status}</span> ]{' '}
        <span>{data.bidAmount.toLocaleString()} BHT</span> submited at{' '}
        <span>{this.state.createdAt}</span>.
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(BidItem);
