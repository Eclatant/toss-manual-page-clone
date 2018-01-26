import React from "react";

const Side = ({ title }) => (
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
    {title.map(v => (
      <ul>
        {Object.keys(v)[0]}
        {v[Object.keys(v)[0]].map(v => <li>{v}</li>)}
      </ul>
    ))}
  </div>
);

export default Side;
