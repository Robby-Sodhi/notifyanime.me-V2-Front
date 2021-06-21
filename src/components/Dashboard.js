import React from "react";
import Header from "./header";
import { Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import {
  client_id,
  getCookieValue,
  deleteCookieValue,
  setCookieValue,
  Calendar,
  getTodaysDate,
  getTodaysDateNum,
  CalendarFlipped,
  jstDayWeekToLocal,
  offsetH,
  offsetM,
} from "./Utility";

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
    return fetch("http://127.0.0.1:8000/authenticateMal", {
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
        } else {
          this.state.watchList = data["WatchList"];
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
      let watching = [];
      let completed = [];
      let planToWatch = [];
      let currentlyAiring = [];
      if (this.state.watchList) {
        let watchList = this.state.watchList["data"];
        watchList.forEach((element) => {
          if (element["node"]["my_list_status"]["status"] == "watching") {
            watching.push(element);
            if (element["node"]["status"] == "currently_airing") {
              currentlyAiring.push(element);
              if (!("broadcast" in element["node"])) {
                element["node"]["broadcast"] = null;
              }
            }
          } else if (
            element["node"]["my_list_status"]["status"] == "completed"
          ) {
            completed.push(element);
          } else if (
            element["node"]["my_list_status"]["status"] == "plan_to_watch"
          ) {
            planToWatch.push(element);
          }
        });
        let todayCalendar = { ...Calendar };
        todayCalendar[getTodaysDate()] = -1;
        let index = getTodaysDateNum() + 1;
        let count = 1;
        for (;;) {
          if (index > 6) {
            index = 0;
          }
          if (todayCalendar[CalendarFlipped[index]] == -1) {
            todayCalendar[CalendarFlipped[index]] = 0;
            break;
          }
          todayCalendar[CalendarFlipped[index]] = count;
          index++;
          count++;
        }
        currentlyAiring.sort((first, second) => {
          if (
            todayCalendar[
              jstDayWeekToLocal(
                first["node"]["broadcast"]["day_of_the_week"],
                first["node"]["broadcast"]["start_time"],
                offsetH,
                offsetM
              )["day_of_the_week"]
            ] <
            todayCalendar[
              jstDayWeekToLocal(
                second["node"]["broadcast"]["day_of_the_week"],
                second["node"]["broadcast"]["start_time"],
                offsetH,
                offsetM
              )["day_of_the_week"]
            ]
          ) {
            return -1;
          } else {
            return 1;
          }
        });
        console.log(currentlyAiring);
      }
      if (watching && currentlyAiring) {
        return (
          <div>
            <Header />
            <div>
              {currentlyAiring.map((element) => {
                return (
                  <div>
                    <p key={element["node"]["title"]}>
                      {element["node"]["title"] +
                        " " +
                        jstDayWeekToLocal(
                          element["node"]["broadcast"]["day_of_the_week"],
                          element["node"]["broadcast"]["start_time"],
                          offsetH,
                          offsetM
                        )["day_of_the_week"]}
                    </p>
                    <img src={element["node"]["main_picture"]["medium"]} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else {
        return <p>no airing/watching shows</p>;
      }
    }
  }
}
