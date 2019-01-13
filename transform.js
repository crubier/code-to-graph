const { default: generate } = require("@babel/generator");
const fp = require("lodash/fp");

function makeIdFromAstNode(astNode) {
  return `statementfroml${astNode.loc.start.line}c${
    astNode.loc.start.column
  }tol${astNode.loc.end.line}c${astNode.loc.end.column}`;
}

function transformGeneralAstToGraph(ast) {
  if (fp.isArray(ast)) {
    return tramsformStatementSequenceToGraph(ast);
  } else if (fp.isObject(ast)) {
    return tramsformStatementToGraph(ast);
  } else {
    throw new Error(`Ast of type ${typeof ast} is not supported`);
  }
}

function tramsformStatementSequenceToGraph(statements) {
  return fp.reduce(
    (
      { nodes, edges, entryNodes, exitNodes, breakNodes, subGraphs },
      {
        nodes: currentNodes,
        edges: currentEdges,
        entryNodes: currentEntryNodes,
        exitNodes: currentExitNodes,
        breakNodes: currentBreakNodes,
        subGraphs: currentSubGraphs
      }
    ) => ({
      nodes: [...nodes, ...currentNodes],
      edges: fp.compact([
        ...edges,
        ...currentEdges,
        ...fp.flatten(
          fp.map(
            exitNode =>
              fp.map(
                entryNode => ({
                  from: exitNode.id,
                  to: entryNode.id,
                  name: "",
                  style: "solid",
                  arrow: true
                }),
                currentEntryNodes
              ),
            exitNodes
          )
        )
      ]),
      entryNodes: fp.isEmpty(entryNodes) ? currentEntryNodes : entryNodes,
      exitNodes: currentExitNodes,
      breakNodes: [...breakNodes, ...currentBreakNodes],
      subGraphs: [...subGraphs, ...currentSubGraphs]
    }),
    {
      nodes: [],
      edges: [],
      entryNodes: [],
      exitNodes: [],
      breakNodes: [],
      subGraphs: []
    },
    fp.map(transformGeneralAstToGraph, statements)
  );
}

function tramsformStatementToGraph(statement) {
  switch (statement.type) {
    case "File": {
      return transformGeneralAstToGraph(statement.program);
    }
    case "Program": {
      return transformGeneralAstToGraph(statement.body);
    }
    case "ClassDeclaration": {
      return {
        nodes: [],
        edges: [],
        entryNodes: [],
        exitNodes: [],
        breakNodes: [],
        subGraphs: [
          {
            name: `class ${
              fp.isNil(statement.id)
                ? makeIdFromAstNode(statement)
                : generate(statement.id).code
            }`,
            graph: transformGeneralAstToGraph(statement.body)
          }
        ]
      };
    }
    case "ClassBody": {
      return transformGeneralAstToGraph(statement.body);
    }
    case "FunctionExpression": {
      return transformGeneralAstToGraph(statement.body);
    }
    case "ArrowFunctionExpression": {
      return transformGeneralAstToGraph(statement.body);
    }
    case "ClassMethod": {
      console.log("ClassMethod");
      console.log(statement);
      return {
        nodes: [],
        edges: [],
        entryNodes: [],
        exitNodes: [],
        breakNodes: [],
        subGraphs: [
          {
            name: `method ${
              fp.isNil(statement.key)
                ? makeIdFromAstNode(statement)
                : generate(statement.key).code
            }`,
            graph: transformGeneralAstToGraph(statement.body)
          }
        ]
      };
    }
    case "FunctionDeclaration": {
      // console.log("FunctionDeclaration");
      // console.log(statement);
      return {
        nodes: [],
        edges: [],
        entryNodes: [],
        exitNodes: [],
        breakNodes: [],
        subGraphs: [
          {
            name: fp.isNil(statement.id)
              ? makeIdFromAstNode(statement)
              : generate(statement.id).code,
            graph: transformGeneralAstToGraph(statement.body)
          }
        ]
      };
    }
    case "BlockStatement": {
      return transformGeneralAstToGraph(statement.body);
    }

    case "VariableDeclarator": {
      // console.log("VariableDeclarator");
      const node = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: generate(statement).code,
        shape: "round"
      });
    }
    case "VariableDeclaration": {
      // console.log("VariableDeclaration");
      // console.log(statement);

      const literalsDeclarators = fp.filter(declaration => {
        if (declaration.init.type === "FunctionExpression") {
          return false;
        } else if (declaration.init.type === "ArrowFunctionExpression") {
          return false;
        } else {
          return true;
        }
      }, statement.declarations);

      const literalsDeclarations = {
        ...statement,
        declarations: [...literalsDeclarators]
      };

      const literalsNodes = fp.isEmpty(literalsDeclarations.declarations)
        ? []
        : [
            cleanGraphNode({
              id: makeIdFromAstNode(literalsDeclarations),
              name: generate(literalsDeclarations).code,
              shape: "round"
            })
          ];

      const functionsDeclarators = fp.filter(declarator => {
        if (declarator.init.type === "FunctionExpression") {
          return true;
        } else if (declarator.init.type === "ArrowFunctionExpression") {
          return true;
        } else {
          return false;
        }
      }, statement.declarations);

      // console.log("functionsDeclarators", functionsDeclarators);

      const functionsSubGraphs = fp.reduce(
        ({ subGraphs }, declarator) => {
          return {
            subGraphs: [
              ...subGraphs,
              {
                name: declarator.id.name,
                graph: transformGeneralAstToGraph(declarator.init)
              }
            ]
          };
        },
        {
          subGraphs: []
        },
        functionsDeclarators
      );

      return {
        nodes: [...literalsNodes],
        edges: [],
        entryNodes: [...literalsNodes],
        exitNodes: [...literalsNodes],
        breakNodes: [],
        subGraphs: [...functionsSubGraphs.subGraphs]
      };
    }
    case "ExpressionStatement": {
      if (statement.expression.type === "ArrowFunctionExpression") {
        return {
          nodes: [],
          edges: [],
          entryNodes: [],
          exitNodes: [],
          breakNodes: [],
          subGraphs: [
            {
              name: makeIdFromAstNode(statement),
              graph: transformGeneralAstToGraph(statement.expression.body)
            }
          ]
        };
      } else if (statement.expression.type === "FunctionExpression") {
        console.log("FunctionExpression");
        return {
          nodes: [],
          edges: [],
          entryNodes: [],
          exitNodes: [],
          breakNodes: [],
          subGraphs: [
            {
              name: statement.name,
              graph: transformGeneralAstToGraph(statement.body)
            }
          ]
        };
      } else {
        const node = cleanGraphNode({
          id: makeIdFromAstNode(statement),
          name: generate(statement).code,
          shape: "round"
        });
        return {
          nodes: [node],
          edges: [],
          entryNodes: [node],
          exitNodes: [node],
          breakNodes: [],
          subGraphs: []
        };
      }
    }
    case "ExportNamedDeclaration":
      return transformGeneralAstToGraph(statement.declaration);
    case "ExportDefaultDeclaration":
      return transformGeneralAstToGraph(statement.declaration);
    case "Identifier":
      return {
        nodes: [],
        edges: [],
        entryNodes: [],
        exitNodes: [],
        breakNodes: [],
        subGraphs: []
      };
    case "ImportDeclaration":
      return {
        nodes: [],
        edges: [],
        entryNodes: [],
        exitNodes: [],
        breakNodes: [],
        subGraphs: []
      };
    case "EmptyStatement": {
      const node = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: `Empty statement at line ${statement.loc.start.line} column ${
          statement.loc.start.column
        }`,
        shape: "square"
      });
      return {
        nodes: [node],
        edges: [],
        entryNodes: [node],
        exitNodes: [node],
        breakNodes: [],
        subGraphs: []
      };
    }
    case "ReturnStatement": {
      const node = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: generate(statement).code,
        shape: "asymetric",
        style: { fill: "#99FF99" }
      });
      return {
        nodes: [node],
        edges: [],
        entryNodes: [node],
        exitNodes: [],
        breakNodes: [],
        subGraphs: []
      };
    }
    case "ThrowStatement": {
      const node = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: generate(statement).code,
        shape: "asymetric",
        style: { fill: "#FF9999" }
      });

      return {
        nodes: [node],
        edges: [],
        entryNodes: [node],
        exitNodes: [],
        breakNodes: [],
        subGraphs: []
      };
    }
    case "BreakStatement": {
      const node = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: generate(statement).code,
        shape: "square"
      });
      return {
        nodes: [node],
        edges: [],
        entryNodes: [node],
        exitNodes: [],
        breakNodes: [node],
        subGraphs: []
      };
    }
    case "WhileStatement": {
      const thisNode = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: `while ${generate(statement.test).code}`,
        shape: "rhombus"
      });
      const {
        nodes: bodyNodes,
        edges: bodyEdges,
        entryNodes: bodyEntryNodes,
        exitNodes: bodyExitNodes,
        breakNodes: bodyBreakNodes
      } = transformGeneralAstToGraph(statement.body);

      const thisEdges = [
        ...fp.map(
          node => ({
            from: thisNode.id,
            to: node.id,
            name: "do",
            style: "solid",
            arrow: true
          }),
          bodyEntryNodes
        ),
        ...fp.map(
          node => ({
            from: node.id,
            to: thisNode.id,
            name: "loop",
            style: "solid",
            arrow: true
          }),
          bodyExitNodes
        )
      ];
      return {
        nodes: [thisNode, ...bodyNodes],
        edges: [...thisEdges, ...bodyEdges],
        entryNodes: [thisNode],
        exitNodes: [...bodyBreakNodes, thisNode],
        breakNodes: [],
        subGraphs: []
      };
    }
    case "IfStatement": {
      const thisNode = cleanGraphNode({
        id: makeIdFromAstNode(statement),
        name: `if ${generate(statement.test).code}`,
        shape: "rhombus"
      });
      const {
        nodes: consequentNodes,
        edges: consequentEdges,
        entryNodes: consequentEntryNodes,
        exitNodes: consequentExitNodes
      } = transformGeneralAstToGraph(statement.consequent);
      const {
        nodes: alternateNodes,
        edges: alternateEdges,
        entryNodes: alternateEntryNodes,
        exitNodes: alternateExitNodes
      } = !fp.isNil(statement.alternate)
        ? transformGeneralAstToGraph(statement.alternate)
        : {
            nodes: [],
            edges: [],
            entryNodes: [],
            exitNodes: [thisNode]
          };

      const thisEdges = [
        ...fp.map(
          node => ({
            from: thisNode.id,
            to: node.id,
            name: "true",
            style: "solid",
            arrow: true
          }),
          consequentEntryNodes
        ),
        ...fp.map(
          node => ({
            from: thisNode.id,
            to: node.id,
            name: "false",
            style: "solid",
            arrow: true
          }),
          alternateEntryNodes
        )
      ];
      return {
        nodes: [thisNode, ...consequentNodes, ...alternateNodes],
        edges: [...thisEdges, ...consequentEdges, ...alternateEdges],
        entryNodes: [thisNode],
        exitNodes: [...consequentExitNodes, ...alternateExitNodes],
        breakNodes: [],
        subGraphs: []
      };
    }
    case "SwitchStatement":
      {
        const thisNode = cleanGraphNode({
          id: makeIdFromAstNode(statement),
          name: `switch ${generate(statement.discriminant).code} `,
          shape: "rhombus"
        });

        const scopeGraph = fp.reduce(
          (
            { nodes, edges, entryNodes, exitNodes, breakNodes },
            caseAstElement
          ) => {
            const {
              nodes: caseNodes,
              edges: caseEdges,
              entryNodes: caseEntryNodes,
              exitNodes: caseExitNodes,
              breakNodes: caseBreakNodes
            } = transformGeneralAstToGraph(caseAstElement.consequent);
            const caseEntryEdges = fp.map(
              node => ({
                from: thisNode.id,
                to: node.id,
                name: fp.isEmpty(caseAstElement.test)
                  ? "default"
                  : generate(caseAstElement.test).code,
                style: "solid",
                arrow: true
              }),
              caseEntryNodes
            );
            const caseFollowEdges = fp.flatten(
              fp.map(
                exitNode =>
                  fp.map(
                    entryNode => ({
                      from: exitNode.id,
                      to: entryNode.id,
                      name: "",
                      style: "solid",
                      arrow: true
                    }),
                    caseEntryNodes
                  ),
                exitNodes
              )
            );
            // console.log("caseNodes", caseNodes);
            return {
              nodes: [...nodes, ...caseNodes],
              edges: fp.compact([
                ...edges,
                ...caseEdges,
                ...caseEntryEdges,
                ...caseFollowEdges
              ]),
              entryNodes: [...entryNodes],
              exitNodes: [...caseExitNodes],
              breakNodes: [...breakNodes, ...caseBreakNodes]
            };
          },
          {
            nodes: [thisNode],
            edges: [],
            entryNodes: [thisNode],
            exitNodes: [],
            breakNodes: []
          },
          statement.cases
        );

        return {
          nodes: [...scopeGraph.nodes],
          edges: [...scopeGraph.edges],
          entryNodes: [...scopeGraph.entryNodes],
          exitNodes: [...scopeGraph.breakNodes],
          breakNodes: [],
          subGraphs: []
        };
      }
      FunctionDeclaration;
    default:
      console.log("statement");
      console.log(statement);
      throw new Error(
        `Statements of type ${statement.type} are not yet supported`
      );
  }
}

function cleanGraphNode({ name, ...rest }) {
  return {
    ...rest,
    name: `"${fp.compose([fp.replace(/(\")/g, "'")])(name)}"`
  };
}

module.exports = { transformGeneralAstToGraph };
