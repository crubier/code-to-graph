import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Attina from "./attina";
import debounce from "lodash/fp/debounce";
import { transformJsStringToMermaidString } from "code-to-graph";
import copy from "copy-to-clipboard";

import brace from "brace";
import AceEditor from "react-ace";
import Dropzone from "react-dropzone";

import "brace/mode/javascript";
import "brace/mode/text";
import "brace/snippets/javascript";
import "brace/theme/github";
import "brace/theme/monokai";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faPlay,
  faShareSquare,
  faUpload
} from "@fortawesome/free-solid-svg-icons";

import { Base64 } from "js-base64";

import queryString from "query-string";

const getCodeFromLocation = ({ location }) => {
  try {
    // console.log("code");
    const search = location.search;
    // console.log(search);
    const params = queryString.parse(search);
    // console.log(params);
    const codeBase64 = params.code;
    // console.log(codeBase64);
    const code = Base64.decode(codeBase64);
    // console.log(code);
    return { code: code };
  } catch (e) {
    console.log("Using default code");
    return {
      code: `const myFunction = (x) => {
  if(x>0){
    return "ok"
  } else {
    throw "not ok"
  }
}`
    };
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: `graph TB; Init;`,
      error: null,
      status: "init"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitDirect = this.handleSubmitDirect.bind(this);
    this.handleSubmit = debounce(200, this.handleSubmitDirect).bind(this);
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // console.log("drop", acceptedFiles, rejectedFiles);

    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        this.handleChange(fileAsBinaryString);
      };
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.readAsBinaryString(file);
    });
  };

  handleChange(newValue) {
    const base64Result = Base64.encodeURI(newValue);
    this.props.history.push(`./?code=${base64Result}`);
    this.handleSubmit();
  }

  handleSubmitDirect() {
    setTimeout(() => {
      const { code } = getCodeFromLocation({ location: this.props.location });
      this.setState(
        {
          source: `graph TB; Loading;`,
          status: "loading"
        },
        () => {
          setTimeout(() => {
            try {
              const source = transformJsStringToMermaidString(code);
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
    try {
      const { code } = getCodeFromLocation({ location: this.props.location });
      this.handleChange(code);
    } catch (error) {
      this.setState({
        status: "error",
        error: error
      });
    }
  }

  render() {
    const { code } = getCodeFromLocation({ location: this.props.location });
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          const inputProps = getInputProps();
          // console.log(inputProps);
          return (
            <div
              {...getRootProps()}
              onClick={undefined}
              style={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                alignItems: "stretch",

                flexWrap: "wrap"
              }}
            >
              {isDragActive ? (
                <div
                  style={{
                    position: "absolute",
                    color: "white",
                    fontSize: "2em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    zIndex: 99999
                  }}
                >
                  Drop file anywhere
                </div>
              ) : null}
              <div
                style={{
                  flexBasis: "50%",
                  flexShrink: 1,
                  flexGrow: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "stretch"
                }}
              >
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  onChange={this.handleChange}
                  name="code-ace-editor"
                  editorProps={{ $blockScrolling: true }}
                  value={code}
                  style={{
                    flexBasis: "100vh",
                    flexShrink: 1,
                    flexGrow: 1,
                    width: "100%"
                    // height: "100%"
                  }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
                <div
                  style={{
                    color: "white",
                    // fontSize: "1.2em",
                    borderRadius: "0",
                    border: "none",
                    outline: "none",
                    backgroundColor: "#FF44FF",
                    flexBasis: "30px",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    width: "100%",
                    minHeight: "30px"
                  }}
                >
                  <span style={{ fontSize: "11px", marginRight: "1em" }}>
                    <FontAwesomeIcon
                      icon={faUpload}
                      style={{ flexShrink: 1, flexGrow: 1 }}
                    />
                    {"   "}
                    Drop code files anywhere or
                  </span>
                  {"   "}
                  <input
                    {...inputProps}
                    style={{
                      color: "white",
                      // fontSize: "1.2em",
                      borderRadius: "0",
                      border: "none",
                      outline: "none",
                      backgroundColor: "#FF44FF",
                      flexBasis: "fit-content",
                      flexShrink: 1,
                      flexGrow: 0,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  />
                </div>
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
                {this.state.status !== "loading" ? (
                  <FontAwesomeIcon icon={faPlay} />
                ) : (
                  <FontAwesomeIcon icon={faSpinner} spin />
                )}
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
                      copy("```mermaid\n" + this.state.source + "\n```", {
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
                    {this.state.status !== "copied" ? (
                      <React.Fragment>
                        <FontAwesomeIcon icon={faShareSquare} />
                        {"   "}
                        Copy graph code to clipboard
                      </React.Fragment>
                    ) : (
                      "Copied!"
                    )}
                  </button>
                  <AceEditor
                    mode="text"
                    theme="github"
                    wrapEnabled={false}
                    readOnly={true}
                    name="result-ace-editor"
                    editorProps={{ $blockScrolling: true }}
                    // onLoad={this.onLoad}
                    // onSelectionChange={this.onSelectionChange}
                    // onCursorChange={this.onCursorChange}
                    // onValidate={this.onValidate}
                    value={"```mermaid\n" + this.state.source + "\n```"}
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
                      enableBasicAutocompletion: false,
                      enableLiveAutocompletion: false,
                      enableSnippets: false,
                      showLineNumbers: false,
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
                    mode="text"
                    theme="github"
                    readOnly={true}
                    wrapEnabled={true}
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
        }}
      </Dropzone>
    );
  }
}

export default App;
