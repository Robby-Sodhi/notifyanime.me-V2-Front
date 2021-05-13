import React from "react";

export default class LoginForm extends React.Component {
  componentDidMount() {
    //log the user out or send them to dashboard if they're logged in
  }

  Defaultstate = {
    username: "",
    password: "",
    error: "",
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
    this.setState({ ...this.Defaultstate });
  };
  render() {
    return (
      <div style={{ marginLeft: "50vw" }}>
        <form>
          <input
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={(event) => this.change(event)}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={(event) => this.change(event)}
          />
          <button
            onClick={(event) => {
              this.onSubmit(event);
            }}
          ></button>
        </form>
        <p>{this.state.error}</p>
      </div>
    );
  }
}
