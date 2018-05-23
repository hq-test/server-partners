import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter, Route, Link } from 'react-router-dom';

import Home from '../home';
import Auction from '../auction';
import Search from '../search';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logout } from '../../modules/partner';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <ToastContainer autoClose={5000} />
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
        {this.props.isLoggedIn ? (
          <header>
            <Link to="/">Auctions</Link>
            <Link to="/search">Search</Link>
          </header>
        ) : null}
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
      Logout,
      RedirectLogin: () => push('/')
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
