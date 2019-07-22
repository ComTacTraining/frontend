import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import Canvas from '../../components/Canvas/Canvas';
import Dashboard from '../Dashboard/Dashboard';
import './Layout.css';
import logo from '../../logo.png';

class Layout extends Component {
  render() {
    return (
      <div className='Layout'>
        <header className='Header'>
          <img src={logo} className='logo' alt='Command Tactical Training' />
          <nav>
            <ul>
              <li>
                <NavLink to='/' exact>
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </nav>
          <span className='logo' />
        </header>
        <Route path='/evolutions/:id' component={Canvas} />
        <Route path='/' exact component={Dashboard} />
      </div>
    );
  }
}

export default Layout;
