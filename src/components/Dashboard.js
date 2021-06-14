import React from "react";
import Header from "./header";
import BottomBar from "./bottomBar";
import { Redirect } from "react-router-dom";
export default class Dashboard extends React.Component {
  state = {
    redirect: null,
  };

  getCookieValue = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  componentDidMount() {
    let session_key = this.getCookieValue("session-key");
    console.log(session_key);
    if (!session_key) {
      this.setState({ redirect: "/Home" });
    }
    fetch("http://127.0.0.1:8000/getWatchList", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "session-key": session_key,
      },
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else {
      return (
        <div>
          <Header />
          <div style={{ marginTop: "60vh" }}>
            <BottomBar />
          </div>
        </div>
      );
    }
  }
}
