import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import partner from './partner';
import auction from './auction';

export default combineReducers({
  router: routerReducer,
  partner,
  auction
});
