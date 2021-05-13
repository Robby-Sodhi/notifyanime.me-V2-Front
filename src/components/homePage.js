import React from "react";
import Header from "./header";
import WelcomeScreen from "./welcomeScreen";
import BottomBar from "./bottomBar";

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <WelcomeScreen />
        <BottomBar />
      </div>
    );
  }
}
