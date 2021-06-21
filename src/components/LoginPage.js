import React from "react";
import Header from "./header";
import Form from "./Form";
import { setCookieValue, getCookieValue } from "./Utility";
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
export default class LoginPage extends React.Component {
  Defaultstate = {
    username: "",
    password: "",
    error: "",
    redirect: null,
    loading: false,
  };
  state = { ...this.Defaultstate };
  onMount = () => {
    if (getCookieValue("session-key")) {
      console.log("user logged in redirecting to dashboard");
      this.state.setState({ redirect: "/Dashboard" });
    }
  };
  change = (event) => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state);
    if (!this.state.username || !this.state.password) {
      this.setState({ error: "Please fill out all the fields" });
      return;
    }
    if (hasWhiteSpace(this.state.username)) {
      this.setState({ error: "no spaces allowed in username" });
      return;
    }
    let body = {
      username: this.state.username,
      password: this.state.password,
    };
    this.setState({ loading: true });
    await fetch("http://127.0.0.1:8000/authenticateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data["status"] == false || !data["session-key"]) {
          this.setState({ error: "login invalid" });
          return;
        } else {
          setCookieValue("session-key", data["session-key"], 86400 * 30);
          console.log("succesfully logged user in, redirecting to dashboard");
          this.setState({ redirect: "/Dashboard" });
          return;
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          error: "Network Error: server is down or client lost connection",
        });
      });
    this.setState({ loading: false });
  };
  render() {
    return (
      <div>
        <Header />
        <Form
          onSubmit={this.onSubmit}
          change={this.change}
          onMount={this.onMount}
          username={this.state.username}
          password={this.state.password}
          error={this.state.error}
          redirect={this.state.redirect}
          loading={this.state.loading}
          text="Login"
        />
      </div>
    );
  }
}
