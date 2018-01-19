import React from "react";

import Layout from "./Layout";

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Layout>
          {this.props.data.map(v => (
            <p>
              {v.title} {v.content}
            </p>
          ))}
        </Layout>
      </div>
    );
  }
}
