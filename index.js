const babelParser = require("@babel/parser");

function astToMermaid(ast) {
  if (ast.type === "FunctionExpression") {
    const result = [];
    return result;
  } else {
    throw new Error(`Code must be a FunctionExpression, but is a ${ast.type}`);
  }
}

function stringToMermaid(string) {
  return astToMermaid(babelParser.parseExpression(string));
}

module.exports = { stringToMermaid };
