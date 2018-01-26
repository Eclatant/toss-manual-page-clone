import React from "react";

const Buttons = ({
  order,
  i,
  handleCreate,
  context,
  handleSave,
  handleEdit,
  handleRemove
}) => (
  <div className="button-group">
    <button key="create" value={order} name={i} onClick={handleCreate}>
      생성
    </button>
    <button
      key="edit"
      value={order}
      name={i}
      onClick={context ? handleSave : handleEdit}
    >
      {context ? "저장" : "수정"}
    </button>
    <button key="remove" value={order} name={i} onClick={handleRemove}>
      삭제
    </button>
  </div>
);

export default Buttons;
