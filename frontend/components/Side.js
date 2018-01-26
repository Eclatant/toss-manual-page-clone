import React, { Component } from "react";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;

class Side extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openKeys: [this.props.h3Id[0]]
    };
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.props.h3Id.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      window.location.href = `${window.location.origin}/#${latestOpenKey}`;
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  render() {
    return [
      <style jsx>{`
        .side > * {
          margin: 0;
          padding: 0 20px;
          border-bottom: 1px solid #e6e6e6;
        }

        .logo {
          display: block;
          padding-top: 15px;
          padding-bottom: 15px;
          background: #fff;
        }

        .logo > img {
          width: 80%;
        }

        .title {
          font-size: 16px;
          padding-top: 10px;
          padding-bottom: 10px;
        }
      `}</style>,
      <div className="side">
        <a className="logo" href="#">
          <img
            src="http://tossdev.github.io/images/logo_tossdev.png"
            alt="logo"
          />
        </a>
        <h1 className="title">
          <a href="#">토스 결제 시작하기</a>
        </h1>
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          style={{}}
        >
          {this.props.sideItem.map((v, i) => (
            <SubMenu
              key={this.props.h3Id[i]}
              title={
                <span>
                  <span>{Object.keys(v)[0]}</span>
                </span>
              }
            >
              {v[Object.keys(v)[0]].map((v, i) => (
                <Menu.Item key={i}>
                  <a href={`#${v}`}>{v}</a>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </div>
    ];
  }
}

export default Side;
