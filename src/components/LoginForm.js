import React from "react";
import { Redirect } from "react-router-dom";
import { setCookieValue, getCookieValue } from "./Utility";
import { CircularProgress } from "@material-ui/core";
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

export default class LoginForm extends React.Component {
  componentDidMount() {
    if (getCookieValue("session-key")) {
      console.log("user logged in redirecting to dashboard");
      this.setState({ redirect: "/Dashboard" });
    }
  }

  Defaultstate = {
    username: "",
    password: "",
    error: "",
    redirect: null,
    loading: false,
  };
  state = { ...this.Defaultstate };
  change = (event) => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };
  async onSubmit(event) {
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
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else if (this.state.loading) {
      return <CircularProgress className="centered" />;
    } else {
      return (
        <div className="form-group centerForm">
          <form>
            <label for="username">username</label>
            <input
              className="form-control"
              name="username"
              placeholder="username"
              value={this.state.username}
              onChange={(event) => this.change(event)}
            />
            <label for="password">password</label>
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={(event) => this.change(event)}
            />
            <button
              className="Mobilebtn btn--danger--solid btn--medium"
              style={{ margin: "8px", marginLeft: "0" }}
              onClick={(event) => {
                this.onSubmit(event);
              }}
            >
              Submit
            </button>
          </form>
          {this.state.error && (
            <div class="alert alert-danger" role="alert">
              {this.state.error}
            </div>
          )}
        </div>
      );
    }
  }
}
