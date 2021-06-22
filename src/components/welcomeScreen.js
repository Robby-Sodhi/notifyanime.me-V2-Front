import React from "react";
import Slideshow from "./slideshow";
import { getCookieValue } from "./Utility";
export default class WelcomeScreen extends React.Component {
  state = {
    loggedIn: false,
  };

  componentDidMount() {
    if (getCookieValue("session-key")) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    return (
      <div>
        <div>
          <div className="welcomeButtons">
            {!this.state.loggedIn && (
              <a href="/Login">
                <button className="Mobilebtn btn--danger--solid btn--large">
                  login
                </button>
              </a>
            )}
            {!this.state.loggedIn && (
              <a href="/Signup">
                <button className="Mobilebtn btn--danger--solid btn--large">
                  signup
                </button>
              </a>
            )}
            {this.state.loggedIn && (
              <a href="/Dashboard">
                <button className="Mobilebtn btn--danger--solid btn--large">
                  Dashboard
                </button>
              </a>
            )}
          </div>
          <Slideshow />
        </div>
      </div>
    );
  }
}
