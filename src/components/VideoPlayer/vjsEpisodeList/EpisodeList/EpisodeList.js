import React, { Component, PropTypes } from "react";

class EpisodeList extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <h1>{this.props.body}</h1>
      </div>
    );
  }
}

export default EpisodeList;
