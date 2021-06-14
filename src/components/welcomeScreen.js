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
          <div className="welcomeButtons">
            <a href="/Login">
              <button className="Mobilebtn btn--danger--solid btn--large">
                login
              </button>
            </a>
            <a href="/Signup">
              <button className="Mobilebtn btn--danger--solid btn--large">
                signup
              </button>
            </a>
          </div>
          <Slideshow />
        </div>
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
