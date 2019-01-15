import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";

import Editor from "./editor";

import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Route component={Editor} />
      </Router>
    );
  }
}

export default App;
