import "./index.css";
import "./bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./components/homePage";
import LoginPage from "./components/LoginPage";
import AboutPage from "./components/AboutPage";
import Dashboard from "./components/Dashboard";
import SignupPage from "./components/SignupPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/Home" exact component={HomePage} />
          <Route path="/Login" exact component={LoginPage} />
          <Route path="/About" exact component={AboutPage} />
          <Route path="/Dashboard" exact component={Dashboard} />
          <Route path="/Signup" exact component={SignupPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
