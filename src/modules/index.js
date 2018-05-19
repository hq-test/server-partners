import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import counter from './counter';
import partner from './partner';
import room from './room';
import auction from './auction';

export default combineReducers({
  router: routerReducer,
  counter,
  partner,
  room,
  auction
});
