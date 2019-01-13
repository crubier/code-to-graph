const babelParser = require("@babel/parser");

const fp = require("lodash/fp");

const { transformStatementToGraph } = require("./transform.js");

function transformJsStringToJsAst(string) {
  return babelParser.parseExpression(string);
}

function transformJsAstToGraph(ast) {
  if (
    ast.type === "FunctionExpression" ||
    ast.type === "ArrowFunctionExpression"
  ) {
    return transformStatementToGraph(ast.body);
  } else {
    throw new Error(`Code must be a FunctionExpression, but is a ${ast.type}`);
  }
}

function transformNodeToMermaidString({ id, name, shape = "square", style }) {
  const styleText = fp.isObject(style)
    ? `\n  style ${id} ${fp.join(
        ",",
        fp.map(
          ([key, value]) => `${fp.kebabCase(key)}:${value}`,
          fp.toPairs(style)
        )
      )}`
    : "";
  const text = fp.isString(name) ? name : id;
  switch (shape) {
    case "round":
      return `  ${id}(${text})${styleText}`;
    case "circle":
      return `  ${id}((${text}))${styleText}`;
    case "asymetric":
      return `  ${id}>${text}]${styleText}`;
    case "rhombus":
      return `  ${id}{${text}}${styleText}`;
    case "square":
    default:
      return `  ${id}[${text}]${styleText}`;
  }
}

function transformEdgeToMermaidString({
  from,
  to,
  name,
  type = "solid",
  arrow = true
}) {
  const text = fp.isString(name) ? name : "";
  const arrowText = arrow ? ">" : "";
  if (fp.isEmpty(text)) {
    switch (type) {
      case "dotted":
        return `  ${from} -.-${arrowText} ${to}`;
      case "thick":
        return `  ${from} ==${arrowText} ${to}`;
      case "solid":
      default:
        return `  ${from} --${arrowText} ${to}`;
    }
  } else {
    switch (type) {
      case "dotted":
        return `  ${from} -. ${text} .-${arrowText} ${to}`;
      case "thick":
        return `  ${from} == ${text} ==${arrowText} ${to}`;
      case "solid":
      default:
        return `  ${from} -- ${text} --${arrowText} ${to}`;
    }
  }
}

function transformGraphToMermaidString(
  { nodes, edges },
  { direction = "TD" } = {}
) {
  const graphMermaidStrign = `graph ${direction}`;
  const nodesMermaidString = fp.join(
    "\n",
    fp.map(transformNodeToMermaidString, nodes)
  );
  const edgesMermaidString = fp.join(
    "\n",
    fp.map(transformEdgeToMermaidString, edges)
  );
  return (
    graphMermaidStrign + "\n" + nodesMermaidString + "\n" + edgesMermaidString
  );
}

function transformJsStringToMermaidString(string) {
  return transformGraphToMermaidString(
    transformJsAstToGraph(transformJsStringToJsAst(string))
  );
}

module.exports = { transformJsStringToMermaidString, transformJsStringToJsAst };
