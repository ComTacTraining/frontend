import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import Page from "../Page/Page";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Dashboard from "../Dashboard/Dashboard";
import AddEvolution from "../Dashboard/AddEvolution/AddEvolution";
import "./Layout.css";

class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <header className="Header">
          <nav>
            <ul>
              <li>
                <NavLink to="/dashboard" exact>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/add" exact>
                  Add Evolution
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        {/*<Route path="/" exact render={() => <h1>Home</h1>} />*/}
        <Route path="/" exact component={Page} />
        <Route path="/dashboard/add" component={AddEvolution} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/evolutions/:id" component={VideoPlayer} />
        {/*<Route path="/:page" exact component={Page} />*/}
      </div>
    );
  }
}

export default Layout;
