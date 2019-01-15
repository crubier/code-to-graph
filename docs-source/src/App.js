import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";

import Editor from "./editor";
import GithubCorner from "react-github-corner";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <GithubCorner
          href="https://github.com/crubier/code-to-graph"
          style={{ zIndex: 20 }}
          svgStyle={{ zIndex: 20 }}
        />
        <Router>
          <Route component={Editor} />
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
