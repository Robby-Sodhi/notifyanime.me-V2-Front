import React from "react";
import Header from "./header";
import BottomBar from "./bottomBar";
import { Redirect } from "react-router-dom";
export default class Dashboard extends React.Component {
  state = {
    redirect: null,
    loggedInToMal: true,
  };
  SendAuthorizationCodeToServer = (sessionKey, authorizationCode) => {
    let body = { sessionKey, authorizationCode };
    fetch("http://127.0.0.1:8000/authenticateMal", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data["status"])
          throw new Error("session-key invalid or mal is down");
      })
      .catch((error) => {
        console.error(error);
        document.cookie =
          "session-key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete the cookie
        this.setState({ redirect: "/Login" });
        return;
      });
  };
  getCookieValue = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  componentDidMount() {
    let session_key = this.getCookieValue("session-key");
    console.log(session_key);
    if (!session_key) {
      this.setState({ redirect: "/Login" }); //user not logged in
      return;
    }

    let params = new URL(document.location).searchParams;
    if (params.get("code")) {
      this.SendAuthorizationCodeToServer(session_key, params.get("code"));
      window.history.replaceState({}, document.title, "/" + "Dashboard");
    }

    fetch("http://127.0.0.1:8000/getWatchList", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "session-key": session_key,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data["sessionKeyValid"]) {
          throw new Error("session key invalid");
        } else if (!data["WatchList"]) {
          this.setState({ loggedInToMal: false });
          return;
        }
      })
      .catch((error) => {
        console.error(error);
        document.cookie =
          "session-key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete the cookie
        this.setState({ redirect: "/Login" });
        return;
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else if (!this.state.loggedInToMal) {
      let CodeChallenge = this.getCookieValue("session-key").substring(0, 128); //the session-key is usually 180 character mal only takes 28 - 128 character code challenges
      //using the session-key as a codechallenge is very insecure and should be fixed eventually
      if (CodeChallenge.length < 28) {
        document.cookie =
          "session-key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete the cookie
        this.setState({ redirect: "/Home" });
      }
      // const ClientId = "d5c730cc35fd9cd800d24ae9f7099b58"; //main account Robstersgaming
      const ClientId = "0ed447cbcf7f21fe2572ce266fc0ce26"; //alt account Robstersgaming75
      let url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${ClientId}&code_challenge=${CodeChallenge}`;
      console.log(url);
      return (
        <div>
          <Header />
          <a href={url}>
            <button className="btn btn--warning--solid btn--medium center">
              Sign-in to MyAnimeList
            </button>
          </a>
          <div style={{ marginTop: "100vh" }}>
            <BottomBar />
          </div>
        </div>
      );
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
