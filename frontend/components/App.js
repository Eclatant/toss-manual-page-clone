import React, { Component } from "react";
import produce from "immer";
import Markdown from "react-mark";

import Layout from "./Layout";

import fetcher from "../utils/fetcher";

export default class App extends Component {
  state = {
    manuals: this.props.manuals
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

    this.setState(state => ({ manuals }));
  };

  handleEdit = ({ target }) => {
    const index = Number(target.name);
    const { manuals: storeManuals } = this.state;
    const manuals = produce(storeManuals, draftManuals => {
      draftManuals[index].context = true;
    });

    this.setState(
      state => ({ manuals }),
      () => {
        const textArea =
          target.parentElement.nextElementSibling.firstElementChild;
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    );
  };

  handleRemove = ({ target }) => {
    const { manuals } = this.state;
    const [index, order] = [target.name, target.value].map(Number);

    fetcher("DELETE", order);
    this.setState({
      manuals: produce(manuals, draftManuals => {
        draftManuals.splice(index, 1);
      })
    });
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
                      onClick={
                        manuals[i].context ? this.handleSave : this.handleEdit
                      }
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
