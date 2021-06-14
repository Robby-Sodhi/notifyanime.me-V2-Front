import React from "react";
import BottomBar from "./bottomBar";
import Header from "./header";
import LoginForm from "./LoginForm";
export default class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <LoginForm />
        <div style={{ marginTop: "42vh" }}>
          <BottomBar />
        </div>
      </div>
    );
  }
}