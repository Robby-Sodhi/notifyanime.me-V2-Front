import React from "react";
import { Redirect } from "react-router-dom";
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

export default class LoginForm extends React.Component {
  componentDidMount() {
    //log the user out or send them to dashboard if they're logged in
  }

  Defaultstate = {
    username: "",
    password: "",
    error: "",
    redirect: null,
  };
  state = { ...this.Defaultstate };
  change = (event) => {
    this.setState({ error: "" });
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = (event) => {
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
    fetch("http://127.0.0.1:8000/authenticateUser", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data["status"] == false || !data["session-key"]) {
          throw new Error("Login invalid");
        } else {
          document.cookie = `session-key=${data["session-key"]}; max-age=${
            86400 * 30
          };`;
          this.setState({ redirect: "/Dashboard" });
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
    this.setState({ ...this.Defaultstate });
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
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
          <p>{this.state.error}</p>
        </div>
      );
    }
  }
}
