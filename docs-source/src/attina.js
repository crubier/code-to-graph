import React from "react";
import { mermaidAPI } from "mermaid";
import FileSaver from "file-saver";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// import debounce from "lodash/fp/debounce";
// mermaidAPI.initialize({
//   startOnLoad: true,
//   logLevel: 1
// });

function getDiagram(title, input, callback) {
  try {
    mermaidAPI.initialize({
      startOnLoad: true
    });

    mermaidAPI.parseError = function(err, hash) {
      // console.log("parseError");
      // console.log(err.messsage);
    };
    // console.log("Rendering");
    // console.log(input);
    // mermaidAPI.render(title, "graph TB;Loading;", diagram => {
    //   console.log("Rendered");
    //   setTimeout(
    //     () =>
    //       mermaidAPI.render(title, input, diagram => {
    //         console.log("Rendered");
    //         console.log(diagram);
    //         callback(diagram);
    //       }),
    //     200
    //   );
    // });

    mermaidAPI.render(title, input, diagram => {
      // console.log("Rendered");
      // console.log(diagram);
      callback({ diagram, input });
    });
  } catch (e) {
    console.log("Failed to generate diagram");
    console.log(e);
  }
}

class Attina extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diagram: {
        __html: ""
      }
    };
  }

  componentDidMount() {
    getDiagram(this.props.title, this.props.diagram, ({ diagram, input }) => {
      this.setState({ diagram: { __html: diagram }, input });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.diagram !== this.props.diagram) {
      getDiagram(this.props.title, nextProps.diagram, ({ diagram, input }) => {
        this.setState({ diagram: { __html: diagram }, input });
      });

      return false;
    }
    if (nextState.diagram !== this.state.diagram) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            var blob = new Blob(
              [
                document.getElementsByClassName("mermaid-code-to-graph")[0]
                  .innerHTML
              ],
              {
                type: "image/svg+xml;charset=utf-8"
              }
            );
            FileSaver.saveAs(blob, "graph.svg");
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
            minHeight: "30px",
            zIndex: 1
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          {"    "} {"    "}
          {this.state.status !== "loading"
            ? "Download SVG File"
            : "Download SVG File"}
        </button>
        <div
          dangerouslySetInnerHTML={this.state.diagram}
          className={"mermaid-code-to-graph"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...this.props.style
          }}
        />
      </React.Fragment>
    );
  }
}

Attina.defaultProps = {
  title: "diagram",
  frameBorder: 0
};

export default Attina;
