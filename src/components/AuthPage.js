import React from "react";
import Header from "./header";
import { Redirect } from "react-router-dom";
import Form from "./Form";
import { setCookieValue, getCookieValue } from "./Utility";
import { CircularProgress } from "@material-ui/core";
import { backendAddress, userLoggedIn } from "./Utility";
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
export default class AuthPage extends React.Component {
  Defaultstate = {
    username: "",
    password: "",
    error: "",
    redirect: null,
    loading: false,
  };
  state = { ...this.Defaultstate };
  componentDidMount() {
    if (userLoggedIn()) {
      console.log("user logged in redirecting to dashboard");
      this.setState({ redirect: "/Dashboard" });
    }
  }
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
      type: this.props.type,
    };
    this.setState({ loading: true });
    await fetch(`${backendAddress}/authenticateUser`, {
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
          this.setState({ error: this.props.error });
          return;
        } else {
          setCookieValue("session-key", data["session-key"], 86400 * 40);
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
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    } else if (this.state.loading) {
      return (
        <div>
          <Header />
          <CircularProgress className="centered" />
        </div>
      );
    } else {
      let text;
      if (this.props.type === "login") {
        text = (
          <div style={{ fontWeight: 600 }}>
            Don't have an account? <a href="/Signup">Sign up</a>
          </div>
        );
      } else if (this.props.type == "signup") {
        text = (
          <div style={{ fontWeight: 600 }}>
            Already have an account? <a href="/Login">Login</a>
          </div>
        );
      }
      return (
        <div>
          <Header />
          <Form
            onSubmit={this.onSubmit}
            change={this.change}
            username={this.state.username}
            password={this.state.password}
            error={this.state.error}
            text={text}
          />
        </div>
      );
    }
  }
}
