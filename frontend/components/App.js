import React, { Component } from "react";
import produce from "immer";

import Layout from "./Layout";
import Side from "./Side";
import Content from "./Content";

import fetcher from "../utils/fetcher";

export default class App extends Component {
  state = {
    manuals: this.props.manuals,
    title: []
  };

  componentDidMount() {
    this.crawlingHeading();
  }

  bindAppEl = el => (this.appEl = el);

  crawlingHeading = () => {
    this.setState({
      title: Array.from(this.appEl.querySelectorAll("h3")).reduce(
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

  handleTextAreaSize = () => {
    this.appEl.querySelector("textarea").style.height = `${
      this.appEl.querySelector("textarea").scrollHeight
    }px`;
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
    const { manuals, title } = this.state;

    return (
      <div>
        <Layout>
          <div>
            <Side title={title} />
            <div className="content" ref={this.bindAppEl}>
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
    );
  }
}
