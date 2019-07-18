import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
//import { Route } from 'react-router-dom';
import Canvas from '../../components/Canvas/Canvas';

import Education from '../../components/Education/Education';
//import Speech from "../../components/Speech/Speech";
//import PlayerSample from "../../components/PlayerSample/PlayerSample";
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
              {/*<li>
                <NavLink to="/speech" exact>
                  Speech
                </NavLink>
              </li>
              <li>
                <NavLink to="/player" exact>
                  Player Sample
                </NavLink>
              </li>*/}
            </ul>
          </nav>
          <span className='logo' />
        </header>
        <Route path='/' exact component={Dashboard} />
        <Route path='/education/:id' component={Education} />
        {/*<Route path='/speech' component={Speech} />
        <Route path='/player' component={PlayerSample} />*/}
        <Route path='/evolutions/:id' exact component={Canvas} />
      </div>
    );
  }
}

export default Layout;
