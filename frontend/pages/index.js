import React from "react";
import Head from "next/head";

import "isomorphic-unfetch";

export default class Index extends React.Component {
  static async getInitialProps() {
    const { stargazers_count: stars } = await fetch(
      "https://api.github.com/repos/zeit/next.js"
    ).then(v => v.json());
    return { stars };
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
        <p>Next.js has {this.props.stars} ⭐️</p>
      </div>
    );
  }
}
