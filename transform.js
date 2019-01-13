const { default: generate } = require("@babel/generator");
const fp = require("lodash/fp");

function makeIdFromAstNode(astNode) {
  // console.log(astNode);
  return `statementfroml${astNode.loc.start.line}c${
    astNode.loc.start.column
  }tol${astNode.loc.end.line}c${astNode.loc.end.column}`;
}

function transformStatementToGraph(statement) {
  switch (statement.type) {
    case "BlockStatement":
      return fp.reduce(
        ({ nodes, edges }, { nodes: currentNodes, edges: currentEdges }) => ({
          nodes: [...nodes, ...currentNodes],
          edges: fp.compact([
            ...edges,
            ...currentEdges,
            fp.isEmpty(nodes) || fp.isEmpty(currentNodes)
              ? null
              : {
                  from: fp.last(nodes).id,
                  to: fp.first(currentNodes).id,
                  name: "",
                  style: "solid",
                  arrow: true
                }
          ])
        }),
        { nodes: [], edges: [] },
        fp.map(transformStatementToGraph, statement.body)
      );
    case "VariableDeclaration":
      return {
        nodes: [
          cleanGraphNode({
            id: makeIdFromAstNode(statement),
            name: generate(statement).code,
            shape: "round"
          })
        ],
        edges: []
      };
    case "ReturnStatement":
      return {
        nodes: [
          cleanGraphNode({
            id: makeIdFromAstNode(statement),
            name: generate(statement).code,
            shape: "asymetric",
            style: { fill: "#99FF99" }
          })
        ],
        edges: []
      };
    case "ThrowStatement":
      return {
        nodes: [
          cleanGraphNode({
            id: makeIdFromAstNode(statement),
            name: generate(statement).code,
            shape: "asymetric",
            style: { fill: "#FF9999" }
          })
        ],
        edges: []
      };
    case "IfStatement":
      const thisNode = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: generate(statement.test).code,
        shape: "rhombus"
      });
      const {
        nodes: consequentNodes,
        edges: consequentEdges
      } = transformStatementToGraph(statement.consequent);
      const {
        nodes: alternateNodes,
        edges: alternateEdges
      } = transformStatementToGraph(statement.alternate);
      const thisEdges = [
        {
          from: thisNode.id,
          to: fp.first(consequentNodes).id,
          name: "true",
          style: "solid",
          arrow: true
        },
        {
          from: thisNode.id,
          to: fp.first(alternateNodes).id,
          name: "false",
          style: "solid",
          arrow: true
        }
      ];
      return {
        nodes: [thisNode, ...consequentNodes, ...alternateNodes],
        edges: [...thisEdges, ...consequentEdges, ...alternateEdges]
      };
    default:
      throw new Error(
        `Statements of type ${statement.type} are not yet supported`
      );
  }
}

function cleanGraphNode({ name, ...rest }) {
  return {
    ...rest,
    name: `"${fp.compose([
      // fp.replace(/(;)|(\n)|(\{)|(\})/g, ""),
      // fp.replace(/(===)|(==)/g, "=")
      fp.replace(/(\")/g, "'")
    ])(name)}"`
  };
}

module.exports = { transformStatementToGraph };
