import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './containers/app';
// import { Read as RoomRead } from './modules/room.js';
import { Read as AuctionRead } from './modules/auction.js';
// import { Read as PartnerRead } from './modules/partner.js';

import 'sanitize.css/sanitize.css';
import './css/index.css';

const target = document.querySelector('#root');

// store.dispatch(PartnerRead());
// store.dispatch(RoomRead());
store.dispatch(AuctionRead());

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
