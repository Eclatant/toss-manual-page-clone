import React, { Component } from "react";

import App from "../components/App";

import fetcher from "../utils/fetcher";
import config from "../config";

export default class Index extends Component {
  static getInitialProps() {
    return fetcher("GET").then(({ manuals }) => ({
      manuals: manuals
        .map(v => ({ ...v, context: false }))
        .sort(({ order: order1 }, { order: order2 }) => order1 - order2)
    }));
  }

  render() {
    return (
      <div>
        <App manuals={this.props.manuals} />
      </div>
    );
  }
}
