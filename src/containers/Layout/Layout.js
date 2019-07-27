import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Canvas from '../../components/Canvas/Canvas';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import './Layout.css';
import logo from '../../logo.png';

class Layout extends Component {
  render() {
    return (
      <div className='Layout'>
        <Navbar fluid collapseOnSelect sticky='top'>
          <Navbar.Header>
            <Navbar.Brand>
              <NavLink to='/'>
                <img
                  src={logo}
                  width='30'
                  height='30'
                  className='d-inline-block align-top'
                  alt='Command Tactical Training'
                />
              </NavLink>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='navbar-links' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='mr-auto'>
                <NavLink to='/login' exact>
                  Login
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar.Header>
        </Navbar>
        <Route path='/login' exact component={Login} />
        <Route path='/evolutions/:id' component={Canvas} />
        <Route path='/' exact component={Dashboard} />
      </div>
    );
  }
}

export default Layout;
