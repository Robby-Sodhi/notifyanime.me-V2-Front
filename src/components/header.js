import React from "react";
import { deleteCookieValue, getCookieValue, userLoggedIn } from "./Utility";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";

export default class Header extends React.Component {
  componentDidMount() {
    if (userLoggedIn()) {
      this.setState({ loggedIn: true });
    }
  }

  state = {
    menu: false,
    loggedIn: false,
  };

  toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    this.setState({ menu: open });
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
    if (this.state.loggedIn) {
      buttons.push({
        text: "Logout",
        onClick: () => {
          deleteCookieValue("session-key");
          window.location.reload();
        },
      });
    } else {
      buttons.push({
        text: "Login",
        link: "/Login",
      });
    }
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
              <a key={item.text} href={item.link} target={item.target}>
                <button
                  style={{
                    marginLeft: "1vw",
                  }}
                  className="btn btn--danger--solid btn--medium"
                  onClick={item.onClick ? () => item.onClick() : null}
                >
                  {item.text}
                </button>
              </a>
            );
          })}
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
        </div>
        <Drawer
          open={this.state.menu}
          anchor="right"
          onClose={this.toggleDrawer(false)}
        >
          <List>
            {buttons.map((item) => (
              <a
                key={item.text}
                style={{
                  color: "inherit",
                  textDecoration: "inherit",
                }}
                href={item.link}
                target={item.target}
              >
                <ListItem
                  button
                  onClick={item.onClick ? () => item.onClick() : null}
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              </a>
            ))}
          </List>
        </Drawer>
      </header>
    );
  }
}
