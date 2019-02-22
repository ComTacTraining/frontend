import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import Page from "../Page/Page";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
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
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{
                    pathname: "/evolutions/cm4"
                  }}
                >
                  Sample
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        {/*<Route path="/" exact render={() => <h1>Home</h1>} />*/}
        <Route path="/" exact component={Page} />
        <Route path="/evolutions/:id" component={VideoPlayer} />
        <Route path="/:page" exact component={Page} />
      </div>
    );
  }
}

export default Layout;
