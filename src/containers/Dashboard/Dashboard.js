import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";

class Dashboard extends Component {
 state = {
     evolutions: []
 }; 

  componentDidMount() {
    if (this.state.evolutions.length < 1) {
      /*let evolutions = "";
      if (this.props.match.params.evolution) {
        evolution = this.props.match.params.evolution;
      }*/

      axios.get("/evolutions").then(response => {
        console.log(response.data);
        this.setState({ evolutions: response.data });
      });
    }
  }

  render() {
    let evoList = <p style={{ textAlign: "center" }}>Page not found...</p>;
    if (this.props.match.params.evolutions) {
      evoList = <p style={{ textAlign: "center" }}>Loading...</p>;
    }
    if (this.state.evolutions) {
        console.log(this.state.evolutions);
      evoList = (
        <div className="Evolutions">
          <div className="card-columns">
            {
              this.state.evolutions.map((evolution, index) => {
                const viewLink = "/evolutions/" + evolution.pk;
                return (
                  <div className="card" key={index}>
                    <div className="card-body">
                      <h5 className="card-title">{evolution.street}</h5>
                      <p className="card-text">{evolution.category}</p>
                      <Link to={viewLink} className="card-link">View</Link>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }
    return evoList;
  }
}

export default Dashboard;
