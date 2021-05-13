import React from "react";
import Menu from "./menu";

export default class Header2 extends React.Component {
  state = {
    menu: false,
  };
  render() {
    let buttons = [
      {
        text: "Discord",
        link: "https://www.discord.gg/fwBfvUdMjp",
        target: "_blank",
      },
      {
        text: "Donate",
        link: "https://paypal.me/RncServers?locale.x=en_US",
        target: "_blank",
      },
      { text: "About", link: "/About" },
    ];
    return (
      <header>
        <a href="/">
          <button className="logo btn--danger--solid btn--medium">
            NotifyAnime.me
          </button>
        </a>
        <div className="header">
          {buttons.map((item) => {
            return (
              <a href={item.link} target={item.target} key={item.link}>
                <button
                  style={{
                    marginLeft: "1vw",
                  }}
                  className="btn btn--danger--solid btn--medium"
                >
                  {item.text}
                </button>
              </a>
            );
          })}
        </div>
        <button
          onClick={() => {
            this.setState({ menu: !this.state.menu });
          }}
          style={{ float: "right", marginTop: "1vh", border: "none" }}
        >
          <div className="menu"></div>
          <div className="menu"></div>
          <div className="menu"></div>
        </button>
        {this.state.menu ? <Menu /> : ""}
      </header>
    );
  }
}
