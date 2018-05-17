import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import About from '../about';

window.IO.socket.on('connect', function() {
  console.log('connected ;)', window.IO.socket._raw.id);
});

window.IO.socket.on('message', function(data) {
  console.log('receive in client room', data);
});

window.IO.socket.on('receive', function(data) {
  console.log('receive in client', data);
});

window.IO.socket.on('receive_error', function(data) {
  console.log('receive error in client', data);
});

window.IO.socket.on('disconnect', function(data) {
  console.log('disconnected', data);
});

window.IO.socket.on('reconnect_attempt', () => {
  console.log('reconnectiong ...');
});

window.IO.socket.request(
  {
    method: 'get',
    url: '/api/partner/send',
    data: {
      client: 'yes apz!'
    },
    headers: {}
  },
  function(response, jwres) {
    if (jwres.error) {
      console.log(jwres); // => e.g. 403
      console.log('can not logout');
      return;
    }
    console.log('response', response);
  }
);

const App = () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="/about-us">About</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
    </main>
  </div>
);

export default App;
