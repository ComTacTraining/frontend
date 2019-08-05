import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Routes from '../../Routes';
import { Auth, API } from 'aws-amplify';
import Navigation from './Navigation/Navigation';
import Container from 'react-bootstrap/Container';
import './App.css';

class App extends Component {
  _isMounted = false;

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    memberType: 'guest'
  };

  async componentDidMount() {
    this._isMounted = true;

    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        //alert(e);
      }
    }

    try {
      const billing = await this.getBilling();
      if (billing) {
        this.setMemberType(billing.canceled);
      }
    } catch (e) {
      if (e.message !== 'Request failed with status code 500') {
        //alert(e);
      }
    }

    if (this._isMounted) {
      this.setState({ isAuthenticating: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBilling() {
    return API.get('comtac', '/billing/subscription');
  }

  setMemberType = canceled => {
    if (!canceled) {
      this.setState({ memberType: 'member' });
    }
  };

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated, memberType: 'demo' });
  };

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push('/login');
  };

  render() {
    const { isAuthenticated, isAuthenticating, memberType } = this.state;
    const childProps = {
      isAuthenticated: isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      memberType: memberType,
      setMemberType: this.setMemberType,
      handleLogout: this.handleLogout
    };

    return (
      !isAuthenticating && (
        <div className='App'>
          <Navigation childProps={childProps} />
          <Container className='body'>
            <Routes childProps={childProps} />
          </Container>
        </div>
      )
    );
  }
}

export default withRouter(App);
