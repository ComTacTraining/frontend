import React, { Component } from 'react';
import Video from './Video/Video';

class Videos extends Component {
  render() {
    const videos = this.props.playlist.map(item => (
      <Video key={item.id} src={item.src} />
    ));
    return <div>{videos}</div>;
  }
}

export default Videos;
