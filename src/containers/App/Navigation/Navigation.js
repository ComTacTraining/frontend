import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
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
                  <Nav.Link href='/dashboard'>Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/contact'>Contact</Nav.Link>
                </Nav.Item>
              </Fragment>
            ) : (
              <Fragment>
                <Nav.Item>
                  <Nav.Link href='/about'>About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/contact'>Contact</Nav.Link>
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
                  <Nav.Link href='/register'>Register</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/login'>Login</Nav.Link>
                </Nav.Item>
              </Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
