import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "antd";

import Buttons from "./Buttons";

const HeadingRenderer = props => {
  if (props.level === 3)
    return <h3 id={props.children[0]}>{props.children}</h3>;
  if (props.level === 4)
    return <h4 id={props.children[0]}>{props.children}</h4>;
};

const Content = ({
  manuals,
  handleEdit,
  handleChange,
  handleCreate,
  handleRemove,
  handleSave
}) => [
  <style jsx>
    {`
      textarea {
        width: 100%;
        padding: 15px;
        font-size: 16px;
      }

      hr {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 37px;
      }

      h4 {
        font-size: 24px;
      }

      .create {
        float: right;
      }
    `}
  </style>,
  <div>
    {manuals.map(({ value, order, context }, i) => (
      <div key={order}>
        <div className="content" id={order}>
          <Buttons
            order={order}
            i={i}
            context={context}
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
            handleSave={handleSave}
          />
          {context ? (
            <textarea
              name={i}
              onChange={handleChange}
              placeholder="마크다운으로 콘텐츠를 입력해주세요."
              value={value}
            />
          ) : (
            <ReactMarkdown
              source={value}
              renderers={{ heading: HeadingRenderer }}
            />
          )}
        </div>
        <div className="clear">
          <Button
            key="create"
            value={order}
            name={i}
            onClick={handleCreate}
            type="primary"
            className="create"
          >
            생성
          </Button>
        </div>
        <hr />
      </div>
    ))}
  </div>
];

export default Content;
