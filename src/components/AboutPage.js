import React from "react";
import Header from "./header";
export default class AboutPage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <center>
          <a
            style={{ color: "inherit", textDecoration: "inherit" }}
            href="https://github.com/Robby-Sodhi/notifyanime.me-V2-Front"
          >
            <i className="fa fa-github fa-5x">Github</i>
          </a>
          <p>
            NotifyAnime.me is planned to be full opensource on the above Github.
          </p>
        </center>
      </div>
    );
  }
}
