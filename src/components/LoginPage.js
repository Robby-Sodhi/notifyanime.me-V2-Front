import React from "react";
import Header from "./header";
import LoginForm from "./LoginForm";
export default class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <LoginForm />
      </div>
    );
  }
}
