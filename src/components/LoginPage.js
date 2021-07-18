import React from "react";
import AuthPage from "./AuthPage";

export default class HomePage extends React.Component {
  render() {
    return <AuthPage type="login" error="Login invalid" />;
  }
}
