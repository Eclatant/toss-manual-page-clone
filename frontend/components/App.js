import React, { Component } from "react";
import Markdown from "react-mark";

import Layout from "./Layout";

import fetcher from "../utils/fetcher";

export default class App extends Component {
  state = {
    manuals: this.props.manuals
  };

  manualsGenerator = (newManual, index) => [
    ...this.state.manuals.slice(0, index),
    newManual,
    ...this.state.manuals.slice(index + 1)
  ];

  handleChange = ({ target }) => {
    const { manuals } = this.state;
    const { name, value } = target;
    const index = parseInt(name);

    this.setState(state => ({
      manuals: this.manualsGenerator(
        {
          ...manuals[index],
          value
        },
        index
      )
    }));
  };

  handleRemove = ({ target }) => {
    const index = parseInt(target.name);
    const manuals = [
      ...this.state.manuals.slice(0, index),
      ...this.state.manuals.slice(index + 1)
    ];

    fetcher("DELETE", `${target.value}`);
    this.setState(state => ({ manuals }));
  };

  handleClick = ({ target }) => {
    const index = parseInt(target.name);
    let manual = this.state.manuals[index];
    const { context, create, value } = manual;
    let manuals;

    if (target.textContent === "수정") {
      manuals = this.manualsGenerator(
        {
          ...manual,
          context: !context
        },
        index
      );

      this.setState(
        state => ({ manuals }),
        () => {
          const textArea =
            target.parentElement.nextElementSibling.firstElementChild;

          textArea.style.height = `${textArea.scrollHeight}px`;
        }
      );
    } else if (target.textContent === "저장") {
      if (create) {
        fetcher("POST", undefined, { value, order: target.value });
        manuals = this.manualsGenerator(
          { ...manual, value, context: false, order: target.value },
          index
        );
      } else {
        fetcher("PUT", `${target.value}`, { value });
        manuals = this.manualsGenerator(
          { ...manual, value, context: false },
          index
        );
      }

      this.setState(state => ({ manuals }));
    }
  };

  handleCreate = ({ target }) => {
    const index = parseInt(target.name);
    const manuals = [
      ...this.state.manuals.slice(0, index + 1),
      {
        value: "",
        context: true,
        create: true,
        order: parseInt(target.value) + 1
      },
      ...this.state.manuals.slice(index + 1)
    ];

    this.setState(state => ({ manuals }));
  };

  render() {
    const { manuals } = this.state;

    return (
      <div>
        <Layout>
          <div className="wrapper">
            <div className="side">
              <a href="#">
                <img
                  className="logo"
                  src="http://tossdev.github.io/images/logo_tossdev.png"
                  alt="logo"
                />
              </a>
              <h1>
                <a href="#">토스 결제 시작하기</a>
              </h1>
              <ul />
            </div>
            <div className="content">
              <style jsx>
                {`
                  textarea {
                    width: 1200px;
                    font-size: 16px;
                  }
                `}
              </style>
              {manuals.map(({ value, order }, i) => (
                <div key={order}>
                  <div className="button-group">
                    <button
                      key="create"
                      value={order}
                      name={i}
                      onClick={this.handleCreate}
                    >
                      생성
                    </button>
                    <button
                      key="edit"
                      value={order}
                      name={i}
                      onClick={this.handleClick}
                    >
                      {manuals[i].context ? "저장" : "수정"}
                    </button>
                    <button
                      key="remove"
                      value={order}
                      name={i}
                      onClick={this.handleRemove}
                    >
                      삭제
                    </button>
                  </div>
                  <div className="content" id={order}>
                    {manuals[i].context ? (
                      <textarea
                        name={i}
                        onChange={this.handleChange}
                        placeholder="마크다운으로 콘텐츠를 입력해주세요."
                        value={value}
                      />
                    ) : (
                      <Markdown>{value}</Markdown>
                    )}
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
