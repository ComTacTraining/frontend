import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Routes from '../../Routes';
import { Auth } from 'aws-amplify';
import Navigation from './Navigation/Navigation';
import Container from 'react-bootstrap/Container';
import './App.css';

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true
  };

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push('/login');
  };

  render() {
    const { isAuthenticated, isAuthenticating } = this.state;
    const childProps = {
      isAuthenticated: isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
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
