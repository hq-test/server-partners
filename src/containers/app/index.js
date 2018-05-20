import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Home from '../home';
import Auction from '../auction';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSocketConnect: false
    };
  }

  componentDidMount() {
    var that = this;
    window.IO.socket.on('connect', function() {
      console.log('>>connected ;)', window.IO.socket._raw.id);
      that.setState({ isSocketConnect: true });
    });

    window.IO.socket.on('message', function(data) {
      console.log('>>receive in client app index cmp di maount', data);
    });

    window.IO.socket.on('reconnect', function() {
      console.log('>>reconnected ... :D', window.IO.socket._raw.id);
      that.setState({ isSocketConnect: true });
    });
    window.IO.socket.on('reconnecting', function() {
      console.log('>>reconnecting ...');
      that.setState({ isSocketConnect: false });
    });

    window.IO.socket.on('disconnect', function(data) {
      console.log('>>disconnected', data);
      window.IO.socket._raw.io._reconnection = true;
      that.setState({ isSocketConnect: false });
    });

    window.IO.socket.on('error', () => {
      console.log('>>error ...');
      that.setState({ isSocketConnect: false });
    });
  }

  render() {
    return (
      <div>
        <div
          className={
            this.state.isSocketConnect
              ? 'socketConnected'
              : 'socketDisconnected'
          }
        />

        <main>
          <Route
            exact
            path="/"
            component={this.props.isLoggedIn ? Auction : Home}
          />
          <Route
            exact
            path="/auction"
            component={this.props.isLoggedIn ? Auction : Home}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.partner.isLoggedIn
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(App);
