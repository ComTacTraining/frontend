import React, { Component } from "react";
import axios from "../../axios";

class Dashboard extends Component {
 state = {
     evolutions: []
 }; 

  componentDidMount() {
    console.log(this.props);
    if (!this.state.evolutions) {
      /*let evolutions = "";
      if (this.props.match.params.evolution) {
        evolution = this.props.match.params.evolution;
      }*/

      axios.get("/evolutions").then(response => {
      //axios.get("http://localhost:3000/evolutions").then(response => {
        this.setState({
          evolutions: response.data
        });
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
          <p>{this.state.evolutions}</p>
        </div>
      );
    }
    return evoList;
  }
}

export default Dashboard;
