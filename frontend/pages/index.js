import React from "react";
import Head from "next/head";

import "isomorphic-unfetch";

import config from "../config";

export default class Index extends React.Component {
  static async getInitialProps() {
    const data = await fetch(config.MANUAL_API).then(v => v.json());
    return { data };
  }

  render() {
    return (
      <div>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <title>토스 결제 시작하기</title>
        </Head>
        {this.props.data.manuals.map(v => (
          <p>
            {v.title} {v.content}
          </p>
        ))}
      </div>
    );
  }
}
