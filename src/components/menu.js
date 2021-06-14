import React from "react";

export default class Menu extends React.Component {
  componentDidMount = () => {
    document
      .getElementById("menuBar")
      .animate(
        [{ transform: "translateX(100%)" }, { transform: "translateX(0%)" }],
        {
          duration: 250,
          iterations: 1,
        }
      );
  };
  component;
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
      <div id="menuBar" className="menuBar">
        {buttons.map((item) => {
          return (
            <a key={item.text} href={item.link} target={item.target}>
              <button
                style={{
                  marginLeft: "20vw",
                  marginTop: "10vh",
                }}
                className="Mobilebtn btn--danger--solid btn--large"
              >
                {item.text}
              </button>
            </a>
          );
        })}
      </div>
    );
  }
}
