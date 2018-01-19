import React from "react";

import "isomorphic-unfetch";

import App from "../components/App";

import config from "../config";

export default class Index extends React.Component {
  static async getInitialProps() {
    const { manuals } = await fetch(config.MANUAL_API).then(v => v.json());
    return { manuals };
  }

  render() {
    return (
      <div>
        <App data={this.props.manuals} />
      </div>
    );
  }
}
