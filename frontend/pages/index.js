import React from "react";

import "isomorphic-unfetch";

import App from "../components/App";

import config from "../config";

export default class Index extends React.Component {
  static async getInitialProps() {
    const { manuals } = await fetch(config.MANUAL_API).then(v => v.json());
    return {
      manuals: manuals
        .map(v => ({ ...v, context: false }))
        .sort(({ order: order1 }, { order: order2 }) => order1 - order2)
    };
  }

  render() {
    return (
      <div>
        <App manuals={this.props.manuals} />
      </div>
    );
  }
}
