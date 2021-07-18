import React from "react";
import Header from "./header";
import { Redirect } from "react-router-dom";
import { CircularProgress, Box } from "@material-ui/core";
import {
  client_id,
  getCookieValue,
  deleteCookieValue,
  setCookieValue,
  backendAddress,
} from "./Utility";

import { processWatchList } from "./processWatchList";

export default class Dashboard extends React.Component {
  state = {
    redirect: null,
    loggedInToMal: true,
    loading: false,
    watchList: null,
  };
  SendAuthorizationCodeToServer = (
    sessionKey,
    authorizationCode,
    codeChallenge
  ) => {
    let body = { sessionKey, authorizationCode, codeChallenge };
    return fetch(`${backendAddress}/authenticateMal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        window.history.replaceState({}, document.title, "/Dashboard");
      } else {
        this.setState({ loggedInToMal: false });
        return;
      }
    }
    await fetch(`${backendAddress}/getWatchList`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "session-key": session_key,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data["sessionKeyValid"]) {
          throw new Error("session key invalid");
        } else if (!data["WatchList"]) {
          this.setState({ loggedInToMal: false });
          return;
        } else {
          this.setState({ watchList: processWatchList(data["WatchList"]) });
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
            <button className="MobilebtnNoHover btn--warning--solid btn--medium center-screen">
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
      if (
        this.state.watchList &&
        this.state.watchList["currentlyAiring"] &&
        this.state.watchList["watching"]
      ) {
        let currentlyAiring = this.state.watchList["currentlyAiring"];
        return (
          <div>
            <Header />
            <div style={{ marginLeft: "6%" }}>
              <Box
                display="flex"
                justifyContent="space-evenly"
                flexWrap="wrap"
                alignContent="space-between"
              >
                {currentlyAiring.map((element) => {
                  return (
                    <Box
                      display="flex"
                      width="500px"
                      height="300px"
                      margin="2rem"
                      key={element["node"]["title"]}
                    >
                      <img
                        src={element["node"]["main_picture"]["medium"]}
                        alt={element["node"]["title"]}
                      />
                      <div className="dashboardText">
                        <p>
                          {`${element["node"]["title"]} ${element["node"]["broadcast"]["day_of_the_week"]} ${element["node"]["broadcast"]["start_time"]}`}
                        </p>
                      </div>
                    </Box>
                  );
                })}
              </Box>
            </div>
          </div>
        );
      } else {
        return <p>no airing/watching shows</p>;
      }
    }
  }
}
