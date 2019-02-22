import React, { Component } from "react";
import axios from "../../axios";

class Page extends Component {
  state = {
    page: "",
    content: null
  };

  componentDidMount() {
    console.log(this.props);
    if (
      !this.state.content ||
      (this.state.content && this.state.page !== this.props.match.params.page)
    ) {
      let page = "";
      if (this.props.match.params.page) {
        page = this.props.match.params.page;
      }

      axios.get("/" + page).then(response => {
        this.setState({
          page: page,
          content: response.data
        });
      });
    }
  }

  render() {
    let page = <p style={{ textAlign: "center" }}>Page not found...</p>;
    if (this.props.match.params.page) {
      page = <p style={{ textAlign: "center" }}>Loading...</p>;
    }
    if (this.state.content) {
      page = (
        <div className="Page">
          <h1>{this.state.page}</h1>
          <p>{this.state.content}</p>
        </div>
      );
    }
    return page;
  }
}

export default Page;
