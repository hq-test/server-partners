import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './containers/app';
// import {
//   ReadLive as AuctionReadLive,
//   ReadArchived as AuctionReadArchived
// } from './modules/auction.js';

import 'sanitize.css/sanitize.css';
import './css/index.css';

const target = document.querySelector('#root');

// store.dispatch(AuctionReadLive());
// store.dispatch(AuctionReadArchived());

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);
