import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EmptyList from '../../components/lists/emptyList.js';
import List from '../../components/lists/list.js';
import { Delete, Read } from '../../modules/auction';
import ErrorBox from '../../components/messageBoxs/error.js';
import SuccessBox from '../../components/messageBoxs/success.js';

class Auction extends React.Component {
  // componentDidMount() {
  //   this.props.Read();
  // }

  render() {
    const props = this.props;
    return (
      <div>
        <h1>Auction</h1>
        <button onClick={() => props.redirectAuctionAdd()}>
          Add new auction
        </button>

        {props.error ? <ErrorBox message={props.error} /> : null}
        {props.success ? <SuccessBox message={props.success} /> : null}

        {props.list.length ? (
          <List
            items={props.list}
            options={[
              { headerTitle: 'ID', field: 'id', renderer: 'string' },
              { headerTitle: 'Title', field: 'title', renderer: 'string' },
              {
                headerTitle: 'Room',
                field: 'room',
                renderer: 'string',
                nested: true,
                nestedField: 'title'
              },
              {
                headerTitle: 'Minimum Allowed Bid',
                field: 'minimumAllowedBid',
                renderer: 'price'
              },
              {
                headerTitle: 'Start At',
                field: 'startAt',
                renderer: 'datetime'
              },
              { headerTitle: 'End At', field: 'endAt', renderer: 'datetime' },
              {
                headerTitle: 'Live',
                field: 'isRunning',
                renderer: 'boolean'
              },
              { headerTitle: 'Active', field: 'isActive', renderer: 'boolean' }
            ]}
            onDelete={props.Delete}
            onView={props.View}
          />
        ) : (
          <EmptyList />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  list: state.auction.list,
  error: state.auction.error,
  success: state.auction.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      Read,
      Delete,
      View: id => push('/auction/view/' + id),
      redirectAuctionAdd: () => push('/auction/add')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Auction);
