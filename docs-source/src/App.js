import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Attina from "./attina";
import debounce from "lodash/fp/debounce";
import { transformJsStringToMermaidString } from "code-to-graph";
import copy from "copy-to-clipboard";

import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/snippets/javascript";
import "brace/theme/github";
import "brace/theme/monokai";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: `const helloWorld = (you) => {
  return "hello "+ you;
}`,
      source: `graph TB; Init;`,
      error: null,
      status: "init"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDirect = this.handleSubmitDirect.bind(this);
    this.handleSubmit = debounce(200, this.handleSubmitDirect).bind(this);
  }

  handleChange(newValue) {
    this.setState({ value: newValue });
    this.handleSubmit();
  }

  handleSubmitDirect() {
    setTimeout(() => {
      this.setState(
        {
          source: `graph TB; Loading;`,
          status: "loading"
        },
        () => {
          setTimeout(() => {
            try {
              const source = transformJsStringToMermaidString(this.state.value);
              this.setState({
                source: source,
                status: "loaded",
                error: null
              });
            } catch (error) {
              this.setState({
                status: "error",
                error: error
              });
            }
          }, 0);
        }
      );
    }, 0);
  }

  componentDidMount() {
    this.handleSubmitDirect();
  }

  render() {
    // console.log(">>>>", this.state.source);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          alignItems: "stretch",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            flexBasis: "50%",
            flexShrink: 1,
            flexGrow: 1,
            height: "100%"
          }}
        >
          <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={this.handleChange}
            name="code-ace-editor"
            editorProps={{ $blockScrolling: true }}
            // onLoad={this.onLoad}
            // onSelectionChange={this.onSelectionChange}
            // onCursorChange={this.onCursorChange}
            // onValidate={this.onValidate}
            value={this.state.value}
            // fontSize={this.state.fontSize}
            // showPrintMargin={this.state.showPrintMargin}
            // showGutter={this.state.showGutter}
            // highlightActiveLine={this.state.highlightActiveLine}
            style={{
              flexBasis: "50%",
              flexShrink: 1,
              flexGrow: 1,
              width: "100%",
              height: "100%"
            }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </div>

        <button
          onClick={this.handleSubmitDirect}
          style={{
            position: "relative",
            fontWeight: 600,
            outline: "none",
            color: "white",
            fontSize: "1.2em",
            borderRadius: "100%",
            border: "none",
            backgroundColor: "#FF44FF",
            width: 60,
            height: 60,
            marginLeft: -30,
            marginRight: -30,
            alignSelf: "center",
            zIndex: 9999
          }}
        >
          {this.state.status !== "loading" ? "Go" : "Wait"}
          {/* <svg
            style={{ width: "auto", height: "auto" }}
            version="1.1"
            id="Layer_1"
            width="100%"
            height="100%"
            viewBox="0 0 460.5 531.74"
            overflow="visible"
            enable-background="new 0 0 460.5 531.74"
            xmlSpace="preserve"
          >
            <polygon
              stroke="#000000"
              points="0.5,0.866 459.5,265.87 0.5,530.874 "
            />
          </svg> */}
        </button>
        {this.state.error === null || this.state.error === undefined ? (
          <div
            style={{
              flexBasis: "50%",
              flexShrink: 1,
              flexGrow: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Attina
              diagram={this.state.source}
              style={{ flexBasis: "80%", flexShrink: 1, flexGrow: 1 }}
            />
            <button
              onClick={() => {
                // Copy with options
                copy(this.state.source, {
                  debug: true,
                  message: "Press #{key} to copy"
                });
                this.setState({ status: "copied" });
              }}
              style={{
                color: "white",
                // fontSize: "1.2em",
                borderRadius: "0",
                border: "none",
                outline: "none",
                backgroundColor: "#FF44FF",
                flexBasis: "30px",
                flexShrink: 0,
                flexGrow: 1,
                width: "100%",
                minHeight: "30px"
              }}
            >
              {this.state.status !== "copied"
                ? "Copy graph code to clipboard"
                : "Copied!"}
            </button>
            <AceEditor
              // mode="javascript"
              theme="github"
              readOnly={true}
              name="result-ace-editor"
              editorProps={{ $blockScrolling: true }}
              // onLoad={this.onLoad}
              // onSelectionChange={this.onSelectionChange}
              // onCursorChange={this.onCursorChange}
              // onValidate={this.onValidate}
              value={this.state.source}
              // fontSize={this.state.fontSize}
              // showPrintMargin={this.state.showPrintMargin}
              // showGutter={this.state.showGutter}
              // highlightActiveLine={this.state.highlightActiveLine}
              style={{
                flexBasis: "20%",
                flexShrink: 0,
                flexGrow: 0,
                width: "100%",
                height: "20%"
              }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </div>
        ) : (
          <div
            style={{
              flexBasis: "50%",
              flexShrink: 0,
              flexGrow: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <AceEditor
              // mode="javascript"
              theme="github"
              readOnly={true}
              name="error-ace-editor"
              editorProps={{ $blockScrolling: true }}
              // onLoad={this.onLoad}
              // onSelectionChange={this.onSelectionChange}
              // onCursorChange={this.onCursorChange}
              // onValidate={this.onValidate}
              value={this.state.error.message}
              // fontSize={this.state.fontSize}
              // showPrintMargin={this.state.showPrintMargin}
              // showGutter={this.state.showGutter}
              // highlightActiveLine={this.state.highlightActiveLine}
              style={{
                flexBasis: "100%",
                flexShrink: 0,
                flexGrow: 0,
                width: "100%",
                height: "100%",
                color: "red"
              }}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: false,
                tabSize: 2
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
