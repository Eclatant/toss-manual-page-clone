import _ from "partial-js";
import React, { Component } from "react";
import produce from "immer";

import Layout from "./Layout";
import Side from "./Side";
import Content from "./Content";

import fetcher from "../utils/fetcher";

import style from "../config/style";

export default class App extends Component {
  state = {
    manuals: this.props.manuals,
    sideItem: [],
    h3Id: []
  };

  componentDidMount() {
    this.crawlingHeading();
  }

  bindAppEl = el => (this.appEl = el);

  crawlingHeading = () => {
    const h3Elements = this.appEl.querySelectorAll("h3");

    this.setState({
      h3Id: _.map(h3Elements, ({ id }) => id),
      sideItem: _.reduce(
        h3Elements,
        (prev, value) =>
          prev.concat({
            [value.textContent]: _.map(
              value.parentElement.querySelectorAll("h4"),
              ({ textContent }) => textContent
            )
          }),
        []
      )
    });
  };

  handleTextAreaSize = () => {
    _.each(this.appEl.querySelectorAll("textarea"), v => {
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
    const [index, value] = _.map([target.name, target.value], Number);
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
    const [index, order] = _.map([target.name, target.value], Number);

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
    const [index, order] = _.map([target.name, target.value], Number);
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
    const { manuals, sideItem, h3Id } = this.state;

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
          width: ${style.sideNavStyle.width}px;
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
          padding-bottom: ${style.containerStyle.paddingBottom}px;
          padding-right: ${style.containerStyle.paddingRight}px;
          padding-top: ${style.containerStyle.paddingTop}px;
          width: calc(
            100% - ${style.sideNavStyle.width}px -
              ${style.containerStyle.marginLeft}px -
              ${style.containerStyle.paddingRight}px
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
            <Side h3Id={h3Id} sideItem={sideItem} />

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
