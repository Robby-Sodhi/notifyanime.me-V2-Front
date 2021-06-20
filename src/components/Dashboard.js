import React from "react";
import Header from "./header";
import { Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import {
  client_id,
  getCookieValue,
  deleteCookieValue,
  setCookieValue,
} from "./Utility";

export default class Dashboard extends React.Component {
  state = {
    redirect: null,
    loggedInToMal: true,
    loading: false,
  };
  SendAuthorizationCodeToServer = (
    sessionKey,
    authorizationCode,
    codeChallenge
  ) => {
    let body = { sessionKey, authorizationCode, codeChallenge };
    return fetch("http://127.0.0.1:8000/authenticateMal", {
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
        deleteCookieValue("session-key");
        this.setState({ redirect: "/Login" });
        return;
      });
  };
  async componentDidMount() {
    this.setState({ loading: true });
    let session_key = getCookieValue("session-key");
    console.log(session_key);
    if (!session_key) {
      console.error("session-key missing from cookie, redirecting to login");
      this.setState({ redirect: "/Login" }); //user not logged in
      return;
    }

    let params = new URL(document.location).searchParams;
    if (params.get("code")) {
      if (getCookieValue("code-challenge")) {
        await this.SendAuthorizationCodeToServer(
          session_key,
          params.get("code"),
          getCookieValue("code-challenge")
        );
        window.history.replaceState({}, document.title, "/" + "Dashboard");
      } else {
        this.setState({ loggedInToMal: false });
        return;
      }
    }
    await fetch("http://127.0.0.1:8000/getWatchList", {
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
        deleteCookieValue("session-key");
        this.setState({ redirect: "/Login" });
        return;
      });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else if (!this.state.loggedInToMal) {
      const CodeChallenge = btoa(
        crypto.getRandomValues(new Uint8Array(128))
      ).substr(0, 128);
      if (CodeChallenge.length < 43 || CodeChallenge > 128) {
        deleteCookieValue("session-key");
        this.setState({ redirect: "/Home" });
      }
      setCookieValue("code-challenge", CodeChallenge, 3600);
      let url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${client_id}&code_challenge=${CodeChallenge}`;
      console.log(url);
      return (
        <div>
          <Header />
          <a href={url}>
            <button className="btn btn--warning--solid btn--medium center">
              Sign-in to MyAnimeList
            </button>
          </a>
        </div>
      );
    } else if (this.state.loading) {
      return (
        <div>
          <Header />
          <CircularProgress className="centered" />
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <div></div>
        </div>
      );
    }
  }
}
