import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Education from "../../components/Education/Education";
import Speech from "../../components/Speech/Speech";
import Dashboard from "../Dashboard/Dashboard";
import "./Layout.css";

class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <header className="Header">
          <nav>
            <ul>
              <li>
                <NavLink to="/" exact>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/speech" exact>
                  Speech
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Route path="/" exact component={Dashboard} />
        <Route path="/evolutions/:id" component={VideoPlayer} />
        <Route path="/education/:id" component={Education} />
        <Route path="/speech" component={Speech} />
      </div>
    );
  }
}

export default Layout;
