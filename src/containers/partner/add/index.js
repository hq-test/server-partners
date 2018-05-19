import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ErrorBox from '../../../components/messageBoxs/error.js';
import SuccessBox from '../../../components/messageBoxs/success.js';

import PartnerAddForm from '../../../components/forms/partnerAdd.js';

const PartnerAdd = props => (
  <div>
    <h1>Partner / Add</h1>
    <p>
      <button onClick={() => props.redirectPartner()}>Back</button>
    </p>
    <p>Add new partner</p>
    <PartnerAddForm />
    {props.error ? <ErrorBox message={props.error} /> : null}
    {props.success ? <SuccessBox message={props.success} /> : null}
  </div>
);

const mapStateToProps = state => ({
  error: state.partner.error,
  success: state.partner.success
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      redirectPartner: () => push('/partner')
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PartnerAdd);
