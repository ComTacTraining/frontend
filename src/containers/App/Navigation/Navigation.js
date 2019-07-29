import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../../logo.png';

export default class Navigation extends Component {
  render() {
    return (
      <Navbar bg='dark' variant='dark' collapseOnSelect sticky='top'>
        <Navbar.Brand>
          <Link to='/'>
            <img
              src={logo}
              width='60'
              height='60'
              className='d-inline-block align-top'
              alt='Command Tactical Training'
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbar-links' />
        <Navbar.Collapse id='navbar-links'>
          <Nav className='mr-auto'>
            {this.props.childProps.isAuthenticated ? (
              <Fragment>
                <Nav.Item>
                  <LinkContainer to='/dashboard'>
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                  <LinkContainer to='/contact'>
                    <Nav.Link>Contact</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              </Fragment>
            ) : (
              <Fragment>
                <Nav.Item>
                  <LinkContainer to='/about'>
                    <Nav.Link>About</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                  <LinkContainer to='/contact'>
                    <Nav.Link>Contact</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              </Fragment>
            )}
          </Nav>
          <Nav className='justify-content-end'>
            {this.props.childProps.isAuthenticated ? (
              <Fragment>
                <Nav.Item>
                  <Nav.Link onClick={this.props.childProps.handleLogout}>
                    Logout
                  </Nav.Link>
                </Nav.Item>
              </Fragment>
            ) : (
              <Fragment>
                <Nav.Item>
                  <LinkContainer to='/register'>
                    <Nav.Link>Register</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                  <LinkContainer to='/login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              </Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
