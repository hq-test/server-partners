import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter, Route, Link } from 'react-router-dom';

import Home from '../home';
import Auction from '../auction';
import AuctionDetail from '../auction/detail';
import Search from '../search';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logout } from '../../modules/partner';

import {
  ReadLive as LiveAuction,
  ReadArchived as ArchivedAuction
} from '../../modules/auction';

class App extends React.Component {
  componentDidMount() {
    if (this.props.loggedInUser) {
      this.props.LiveAuction();
      this.props.ArchivedAuction();
    }
  }

  componentWillUnmount() {
    if (this.props.loggedInUser) {
      this.props.UnSubscribeAuction();
    }
  }

  componentWillReceiveProps(props) {
    if (props.loggedInUser) {
      props.LiveAuction();
      props.ArchivedAuction();
    }
  }

  render() {
    return (
      <div>
        <div>
          {/* Toast placeholder */}
          <ToastContainer autoClose={5000} />

          {/* If login, show logged in partner and LOGOUT button */}
          {this.props.isLoggedIn ? (
            <div>
              Welcome <b>{this.props.loggedInUser.title}</b>,{' '}
              <button
                onClick={() => {
                  this.props.Logout();
                  this.props.RedirectLogin();
                }}>
                Logout
              </button>
            </div>
          ) : null}
        </div>

        {/* show navigation for pages agter login */}
        {this.props.isLoggedIn ? (
          <header>
            <Link style={{ padding: 10 }} to="/">
              Auctions
            </Link>
            <Link style={{ padding: 10 }} to="/search">
              Search
            </Link>
          </header>
        ) : null}

        {/* pages placeholder with routes */}
        <main>
          <Route
            exact
            path="/"
            component={this.props.isLoggedIn ? Auction : Home}
          />
          <Route
            exact
            path="/search"
            component={this.props.isLoggedIn ? Search : Home}
          />
          <Route
            path="/auction/:id"
            component={this.props.isLoggedIn ? AuctionDetail : Home}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.partner.loggedInUser,
  isLoggedIn: state.partner.isLoggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ArchivedAuction,
      LiveAuction,
      Logout,
      RedirectLogin: () => push('/')
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
