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
    return (
      <div id="menuBar" className="menuBar">
        {this.props.buttons.map((item) => {
          return (
            <a key={item.text} href={item.link} target={item.target}>
              <button
                style={{
                  marginLeft: "20vw",
                  marginTop: "10vh",
                }}
                className="Mobilebtn btn--danger--solid btn--large"
                onClick={item.onClick ? () => item.onClick() : null}
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
