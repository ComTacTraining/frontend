import React, { Component } from 'react';

class Video extends Component {
  render() {
    return <video key={this.props.id} src={this.props.src} hidden />;
  }
}

export default Video;
