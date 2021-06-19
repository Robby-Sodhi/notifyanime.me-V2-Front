import React from "react";
import Header from "./header";
import WelcomeScreen from "./welcomeScreen";

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <WelcomeScreen />
      </div>
    );
  }
}
