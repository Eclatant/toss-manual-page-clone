import React from "react";
import { Button } from "antd";

const Buttons = ({
  order,
  i,
  handleCreate,
  context,
  handleSave,
  handleEdit,
  handleRemove
}) => [
  <style jsx>
    {`
      .button-group {
        float: right;
        margin-bottom: 20px;
      }

      .button-group > *:first-child {
        margin-right: 15px;
      }
    `}
  </style>,
  <div className="clear">
    <div className="button-group">
      <Button
        key="edit"
        value={order}
        name={i}
        onClick={context ? handleSave : handleEdit}
      >
        {context ? "저장" : "수정"}
      </Button>
      <Button key="remove" value={order} name={i} onClick={handleRemove}>
        삭제
      </Button>
    </div>
  </div>
];

export default Buttons;
