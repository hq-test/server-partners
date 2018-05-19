import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ErrorBox from '../../../components/messageBoxs/error.js';
import SuccessBox from '../../../components/messageBoxs/success.js';

import RoomAddForm from '../../../components/forms/roomAdd.js';

const RoomAdd = props => (
  <div>
    <h1>Room / Add</h1>
    <p>
      <button onClick={() => props.redirectRoom()}>Back</button>
    </p>
    <p>Add new room</p>
    <RoomAddForm />
    {props.error ? <ErrorBox message={props.error} /> : null}
    {props.success ? <SuccessBox message={props.success} /> : null}
  </div>
);

const mapStateToProps = state => ({
  error: state.room.error,
  success: state.room.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      redirectRoom: () => push('/room')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RoomAdd);
