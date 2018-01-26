import React, { Component } from "react";
import produce from "immer";

import Layout from "./Layout";
import Side from "./Side";
import Content from "./Content";

import fetcher from "../utils/fetcher";

export default class App extends Component {
  state = {
    manuals: this.props.manuals,
    sideItem: [],
    titleId: []
  };

  componentDidMount() {
    this.crawlingHeading();
  }

  bindAppEl = el => (this.appEl = el);

  crawlingHeading = () => {
    this.setState({
      titleId: Array.from(this.appEl.querySelectorAll("h3")).map(v => v.id),
      sideItem: Array.from(this.appEl.querySelectorAll("h3")).reduce(
        (prev, v) =>
          prev.concat({
            [v.textContent]: Array.from(
              v.parentElement.querySelectorAll("h4")
            ).map(v => v.textContent)
          }),
        []
      )
    });
  };

  handleTextAreaSize = () => {
    Array.from(this.appEl.querySelectorAll("textarea")).map(v => {
      v.style.height = `${v.scrollHeight}px`;
    });
  };

  handleChange = ({ target }) => {
    const { manuals } = this.state;
    const { name, value } = target;

    this.setState({
      manuals: produce(manuals, draftManuals => {
        draftManuals[name].value = value;
      })
    });
  };

  handleCreate = ({ target }) => {
    const [index, value] = [target.name, target.value].map(Number);
    const manuals = produce(this.state.manuals, draftManuals => {
      draftManuals.splice(index + 1, 0, {
        context: true,
        create: true,
        order: value + 1,
        value: ""
      });
    });

    this.setState({ manuals }, this.crawlingHeading);
  };

  handleEdit = ({ target }) => {
    const index = Number(target.name);
    const { manuals: storeManuals } = this.state;
    const manuals = produce(storeManuals, draftManuals => {
      draftManuals[index].context = true;
    });

    this.setState({ manuals }, this.handleTextAreaSize);
  };

  handleRemove = ({ target }) => {
    const { manuals } = this.state;
    const [index, order] = [target.name, target.value].map(Number);

    fetcher("DELETE", order);
    this.setState(
      {
        manuals: produce(manuals, draftManuals => {
          draftManuals.splice(index, 1);
        })
      },
      this.crawlingHeading
    );
  };

  handleSave = ({ target }) => {
    const [index, order] = [target.name, target.value].map(Number);
    const { manuals: storeManuals } = this.state;
    const { create, value } = storeManuals[index];
    let manuals;

    if (create) {
      fetcher("POST", undefined, { value, order });
      manuals = produce(storeManuals, draftManuals => {
        draftManuals[index].context = false;
        draftManuals[index].order = order;
        draftManuals[index].value = value;
      });
    } else {
      fetcher("PUT", order, { value });
      manuals = produce(storeManuals, draftManuals => {
        draftManuals[index].context = false;
        draftManuals[index].value = value;
      });
    }

    this.setState({ manuals }, this.crawlingHeading);
  };

  render() {
    const { manuals, sideItem, titleId } = this.state;

    const sideNavStyle = {
      width: 250
    };

    const containerStyle = {
      marginLeft: 50,
      paddingRight: 100,
      paddingTop: 100,
      paddingBottom: 100
    };

    return [
      <style jsx>{`
        .app {
          position: relative;
        }

        .side {
          border-right: 1px solid #ddd;
          height: 100vh;
          left: 0;
          overflow-y: scroll;
          position: fixed;
          top: 0;
          width: ${sideNavStyle.width}px;
        }

        .side a {
          color: inherit;
          text-decoration: none;
        }

        .side a:hover {
          text-decoration: underline;
        }

        .side ul {
          border-bottom: none;
          list-style: none;
        }

        .container {
          float: right;
          padding-bottom: ${containerStyle.paddingBottom}px;
          padding-right: ${containerStyle.paddingRight}px;
          padding-top: ${containerStyle.paddingTop}px;
          width: calc(
            100% - ${sideNavStyle.width}px - ${containerStyle.marginLeft}px -
              ${containerStyle.paddingRight}px
          );
        }

        .clear:before,
        .clear:after {
          content: "";
          display: table;
        }

        .clear:after {
          clear: both;
        }
      `}</style>,
      <div>
        <Layout>
          <div className="app">
            {this.state.sideItem.length > 0 ? (
              <Side titleId={titleId} sideItem={sideItem} />
            ) : null}

            <div className="container" ref={this.bindAppEl}>
              <Content
                manuals={manuals}
                handleCreate={this.handleCreate}
                handleChange={this.handleChange}
                handleEdit={this.handleEdit}
                handleRemove={this.handleRemove}
                handleSave={this.handleSave}
              />
            </div>
          </div>
        </Layout>
      </div>
    ];
  }
}
