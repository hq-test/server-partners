import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import partner from './partner';
import auction from './auction';
import bid from './bid';

export default combineReducers({
  router: routerReducer,
  partner,
  auction,
  bid
});
