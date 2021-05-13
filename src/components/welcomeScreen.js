import React from "react";
import Slideshow from "./slideshow";
export default class WelcomeScreen extends React.Component {
  renderCard(image, text, alt = "") {
    return (
      <div className="card Flexed">
        <img className="cardImage" src={image} alt={alt} />
        <p>{text}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <p className="titleText">
            NotifyAnime.me is a M.A.L integrated anime notifier for you and your
            anime needs. Signup to always stay up-to-date with the hottest new
            shows!!
          </p>
          <div>
            <a href="/Signup">
              <button
                style={{
                  marginLeft: "8vw",
                  marginTop: "25vh",
                  position: "absolute",
                }}
                className="btn btn--danger--solid btn--Xlarge"
              >
                Signup
              </button>
            </a>
            <a href="/Login">
              <button
                style={{
                  marginLeft: "20vw",
                  marginTop: "25vh",
                  position: "absolute",
                }}
                className="btn btn--danger--solid btn--Xlarge"
              >
                Login
              </button>
            </a>
          </div>
        </div>
        <Slideshow />
        <div className="container">
          {this.renderCard(
            "https://www.notifyanime.me/static/images/boruto.jpg",
            "Get Notified when your favourite shows air!",
            "borutoPicture"
          )}
          {this.renderCard(
            "https://www.notifyanime.me/static/images/boruto.jpg",
            "Get Notified when your favourite shows air!",
            "borutoPicture"
          )}
          {this.renderCard(
            "https://www.notifyanime.me/static/images/boruto.jpg",
            "Get Notified when your favourite shows air!",
            "borutoPicture"
          )}
          {this.renderCard(
            "https://www.notifyanime.me/static/images/boruto.jpg",
            "Get Notified when your favourite shows air!",
            "borutoPicture"
          )}
        </div>
      </div>
    );
  }
}
