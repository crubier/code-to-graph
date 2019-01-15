import React from "react";
import { mermaidAPI } from "mermaid";

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
      // console.log(
      //   "=============================================================================="
      // );

      getDiagram(this.props.title, nextProps.diagram, ({ diagram, input }) => {
        this.setState({ diagram: { __html: diagram }, input });
      });

      return false;
    }
    if (nextState.diagram !== this.state.diagram) {
      // console.log(
      //   "-------------------------------------------------------------------------------"
      // );
      // console.log(nextState.diagram);
      return true;
    }
    return false;
  }

  render() {
    // const { ...props } = this.props;
    // console.log("IJIJIJIJIJ");
    // console.log(this.props.diagram);
    // console.log(this.state.diagram);
    return (
      <div
        dangerouslySetInnerHTML={this.state.diagram}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...this.props.style
        }}
      />
    );
  }
}

Attina.defaultProps = {
  title: "diagram",
  frameBorder: 0
};

export default Attina;
