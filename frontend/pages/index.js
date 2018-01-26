import _ from "partial-js";
import React, { Component } from "react";

import App from "../components/App";

import fetcher from "../utils/fetcher";
import config from "../config";

export default class Index extends Component {
  static getInitialProps() {
    return fetcher("GET").then(({ manuals }) => ({
      manuals: _.sortBy(
        _.map(manuals, v => ({ ...v, context: false })),
        "order"
      )
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
