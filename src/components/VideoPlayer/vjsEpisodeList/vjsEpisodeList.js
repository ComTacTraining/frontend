import React from "react";
import EpisodeList from "../EpisodeList/EpisodeList";
import ReactDOM from "react-dom";
import videojs from "video.js";

const vjsComponent = videojs.getComponent("Component");

class vjsEpisodeList extends vjsComponent {
  constructor(player, options) {
    super(player, options);

    this.mount = this.mount.bind(this);

    player.ready(() => {
      this.mount();
    });

    this.on("dispose", () => {
      ReactDOM.unmountComponentAtNode(this.el());
    });
  }

  mount() {
    ReactDOM.render(
      <EpisodeList vjsComponent={this} body="Episodes" />,
      this.el()
    );
  }
}

vjsComponent.registerComponent("vjsEpisodeList", vjsEpisodeList);

export default vjsEpisodeList;
