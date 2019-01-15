const { default: generate } = require("@babel/generator");
const fp = require("lodash/fp");

function makeIdFromAstNode(astNode) {
  return `froml${astNode.loc.start.line}c${astNode.loc.start.column}tol${
    astNode.loc.end.line
  }c${astNode.loc.end.column}`;
}

function transformGeneralAstToGraph(ast) {
  if (fp.isArray(ast)) {
    return transformStatementSequenceToGraph(ast);
  } else if (fp.isObject(ast)) {
    return transformStatementToGraph(ast);
  } else {
    return transformStatementToGraph(ast);
  }
}

const emptyGraph = {
  nodes: [],
  edges: [],
  entryNodes: [],
  exitNodes: [],
  breakNodes: [],
  subGraphs: []
};

function transformStatementSequenceToGraph(statements) {
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
                  type: "solid",
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

function transformStatementToGraph(statement) {
  try {
    switch (statement.type) {
      case "TSTypeAliasDeclaration": {
        return emptyGraph;
      }
      case "CommentLine": {
        return emptyGraph;
      }
      case "File": {
        return transformGeneralAstToGraph(statement.program);
      }
      case "Program": {
        return transformGeneralAstToGraph(statement.body);
      }
      case "ClassProperty": {
        const node = cleanGraphNode({
          id: makeIdFromAstNode(statement),
          name: generate(statement).code,
          shape: "round"
        });
        return {
          nodes: [node],
          edges: [],
          entryNodes: [],
          exitNodes: [],
          breakNodes: [],
          subGraphs: []
        };
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
              name: `class_${
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
        return {
          nodes: [],
          edges: [],
          entryNodes: [],
          exitNodes: [],
          breakNodes: [],
          subGraphs: [
            {
              name: `method_${
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
              name: `function_${
                fp.isNil(statement.id)
                  ? makeIdFromAstNode(statement)
                  : generate(statement.id).code
              }`,
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
        return {
          nodes: [node],
          edges: [],
          entryNodes: [node],
          exitNodes: [node],
          breakNodes: [],
          subGraphs: []
        };
      }
      case "VariableDeclaration": {
        // console.log("VariableDeclaration");
        // console.log(statement);

        const literalsDeclarators = fp.filter(declarator => {
          if (declarator.init.type === "FunctionExpression") {
            return false;
          } else if (declarator.init.type === "ArrowFunctionExpression") {
            return false;
          } else if (declarator.init.type === "YieldExpression") {
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
          } else if (declarator.init.type === "YieldExpression") {
            return false;
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
                  name: `function_${declarator.id.name}`,
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

        const yieldDeclarators = fp.filter(declarator => {
          if (declarator.init.type === "FunctionExpression") {
            return false;
          } else if (declarator.init.type === "ArrowFunctionExpression") {
            return false;
          } else if (declarator.init.type === "YieldExpression") {
            // console.log("YIELLLDD");
            // console.log(declarator);
            // console.log("");
            return true;
          } else {
            return false;
          }
        }, statement.declarations);

        const yieldDeclarations = {
          ...statement,
          declarations: [...yieldDeclarators]
        };

        const yieldNodes = fp.isEmpty(yieldDeclarations.declarations)
          ? []
          : [
              cleanGraphNode({
                id: makeIdFromAstNode(statement),
                name: generate(statement).code,
                shape: "asymetric",
                style: { fill: "#99CCFF" }
              })
            ];

        return {
          nodes: [...literalsNodes, ...yieldNodes],
          edges: [],
          entryNodes: [...literalsNodes, ...yieldNodes],
          exitNodes: [...literalsNodes, ...yieldNodes],
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
                name: `function_${makeIdFromAstNode(statement)}`,
                graph: transformGeneralAstToGraph(statement.expression.body)
              }
            ]
          };
        } else if (statement.expression.type === "FunctionExpression") {
          // console.log("FunctionExpression");
          return {
            nodes: [],
            edges: [],
            entryNodes: [],
            exitNodes: [],
            breakNodes: [],
            subGraphs: [
              {
                name: `function_${statement.name}`,
                graph: transformGeneralAstToGraph(statement.body)
              }
            ]
          };
        } else if (statement.expression.type === "YieldExpression") {
          const node = cleanGraphNode({
            id: makeIdFromAstNode(statement),
            name: generate(statement).code,
            shape: "asymetric",
            style: { fill: "#99CCFF" }
          });
          return {
            nodes: [node],
            edges: [],
            entryNodes: [node],
            exitNodes: [node],
            breakNodes: [],
            subGraphs: []
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
      case "CatchClause": {
        return transformGeneralAstToGraph(statement.body);
      }
      case "TryStatement": {
        // statement.finalizer;
        // statement.handler;
        // statement.block;
        const {
          nodes: blockNodes,
          edges: blockEdges,
          entryNodes: blockEntryNodes,
          exitNodes: blockExitNodes,
          breakNodes: blockBreakNodes,
          subGraphs: blockSubGraphs
        } = fp.isObject(statement.block)
          ? transformGeneralAstToGraph(statement.block)
          : emptyGraph;
        const {
          nodes: finalizerNodes,
          edges: finalizerEdges,
          entryNodes: finalizerEntryNodes,
          exitNodes: finalizerExitNodes,
          breakNodes: finalizerBreakNodes,
          subGraphs: finalizerSubGraphs
        } = fp.isObject(statement.finalizer)
          ? transformGeneralAstToGraph(statement.finalizer)
          : emptyGraph;
        const {
          nodes: handlerNodes,
          edges: handlerEdges,
          entryNodes: handlerEntryNodes,
          exitNodes: handlerExitNodes,
          breakNodes: handlerBreakNodes,
          subGraphs: handlerSubGraphs
        } = fp.isObject(statement.handler)
          ? transformGeneralAstToGraph(statement.handler)
          : emptyGraph;
        const blockToFinallyEdges = fp.isObject(statement.finalizer)
          ? fp.flatten(
              fp.map(blockExitNode => {
                return fp.map(finalizerEntryNode => {
                  // console.log("blockExitNode", blockExitNode);
                  // console.log("finalizerEntryNode", finalizerEntryNode);
                  return {
                    from: blockExitNode.id,
                    to: finalizerEntryNode.id,
                    name: "",
                    type: "solid",
                    arrow: true
                  };
                }, finalizerEntryNodes);
              }, blockExitNodes)
            )
          : [];
        const handlerToFinallyEdges = fp.isObject(statement.finalizer)
          ? fp.flatten(
              fp.map(handlerExitNode => {
                return fp.map(finalizerEntryNode => {
                  // console.log("handlerExitNode", handlerExitNode);
                  // console.log("finalizerEntryNode", finalizerEntryNode);
                  return {
                    from: handlerExitNode.id,
                    to: finalizerEntryNode.id,
                    name: "",
                    type: "solid",
                    arrow: true
                  };
                }, finalizerEntryNodes);
              }, handlerExitNodes)
            )
          : [];
        const blockToHandlerEdges = fp.isObject(statement.handler)
          ? fp.flatten(
              fp.map(blockNode => {
                return fp.map(handlerEntryNode => {
                  // console.log("blockNode", blockNode);
                  // console.log("handlerEntryNode", handlerEntryNode);
                  return {
                    from: blockNode.id,
                    to: handlerEntryNode.id,
                    name: "error",
                    type: "dotted",
                    arrow: true
                  };
                }, handlerEntryNodes);
              }, blockNodes)
            )
          : [];
        // console.log("blockToFinallyEdges", blockToFinallyEdges);
        return {
          nodes: [],
          edges: [
            ...blockToFinallyEdges,
            ...handlerToFinallyEdges,
            ...blockToHandlerEdges
          ],
          entryNodes: [...blockEntryNodes],
          exitNodes: fp.isObject(statement.finalizer)
            ? [...finalizerExitNodes]
            : [...blockExitNodes],
          breakNodes: [...finalizerBreakNodes, ...blockBreakNodes],
          subGraphs: [
            ...(fp.isObject(statement.block)
              ? [
                  {
                    name: `try_${makeIdFromAstNode(statement.block)}`,
                    graph: {
                      nodes: blockNodes,
                      edges: blockEdges,
                      entryNodes: blockEntryNodes,
                      exitNodes: blockExitNodes,
                      breakNodes: blockBreakNodes,
                      subGraphs: blockSubGraphs
                    }
                  }
                ]
              : []),
            ...(fp.isObject(statement.finalizer)
              ? [
                  {
                    name: `finally_${makeIdFromAstNode(statement.finalizer)}`,
                    graph: {
                      nodes: finalizerNodes,
                      edges: finalizerEdges,
                      entryNodes: finalizerEntryNodes,
                      exitNodes: finalizerExitNodes,
                      breakNodes: finalizerBreakNodes,
                      subGraphs: finalizerSubGraphs
                    }
                  }
                ]
              : []),
            ...(fp.isObject(statement.handler)
              ? [
                  {
                    name: `catch_${makeIdFromAstNode(statement.handler)}`,
                    graph: {
                      nodes: handlerNodes,
                      edges: handlerEdges,
                      entryNodes: handlerEntryNodes,
                      exitNodes: handlerExitNodes,
                      breakNodes: handlerBreakNodes,
                      subGraphs: handlerSubGraphs
                    }
                  }
                ]
              : [])
          ]
        };
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
      case "DoWhileStatement":
        const thisNode = cleanGraphNode({
          id: makeIdFromAstNode(statement),
          name: `do while ${generate(statement.test).code}`,
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
              to: thisNode.id,
              from: node.id,
              name: "do",
              type: "solid",
              arrow: true
            }),
            bodyExitNodes
          ),
          ...fp.map(
            node => ({
              to: node.id,
              from: thisNode.id,
              name: "loop",
              type: "solid",
              arrow: true
            }),
            bodyEntryNodes
          )
        ];
        return {
          nodes: [thisNode, ...bodyNodes],
          edges: [...thisEdges, ...bodyEdges],
          entryNodes: [...bodyEntryNodes],
          exitNodes: [...bodyBreakNodes, thisNode],
          breakNodes: [],
          subGraphs: []
        };
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
              type: "solid",
              arrow: true
            }),
            bodyEntryNodes
          ),
          ...fp.map(
            node => ({
              from: node.id,
              to: thisNode.id,
              name: "loop",
              type: "solid",
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
      case "ForOfStatement":
      case "ForStatement": {
        const thisNode = cleanGraphNode({
          id: makeIdFromAstNode(statement),
          name: `for ${generate(statement.init).code} ; ${
            generate(statement.test).code
          } ; ${generate(statement.update).code}`,
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
              type: "solid",
              arrow: true
            }),
            bodyEntryNodes
          ),
          ...fp.map(
            node => ({
              from: node.id,
              to: thisNode.id,
              name: "loop",
              type: "solid",
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
          exitNodes: consequentExitNodes,
          breakNodes: consequentBreakNodes
        } = transformGeneralAstToGraph(statement.consequent);
        const {
          nodes: alternateNodes,
          edges: alternateEdges,
          entryNodes: alternateEntryNodes,
          exitNodes: alternateExitNodes,
          breakNodes: alternateBreakNodes
        } = !fp.isNil(statement.alternate)
          ? transformGeneralAstToGraph(statement.alternate)
          : {
              nodes: [],
              edges: [],
              entryNodes: [],
              exitNodes: [thisNode],
              breakNodes: []
            };

        const thisEdges = [
          ...fp.map(
            node => ({
              from: thisNode.id,
              to: node.id,
              name: "true",
              type: "solid",
              arrow: true
            }),
            consequentEntryNodes
          ),
          ...fp.map(
            node => ({
              from: thisNode.id,
              to: node.id,
              name: "false",
              type: "solid",
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
          breakNodes: [...consequentBreakNodes, ...alternateBreakNodes],
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
                  type: "solid",
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
                        type: "solid",
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
        throw new Error(
          `Statements of type ${statement.type} are not yet supported, from ${
            statement.loc.start.line
          }:${statement.loc.start.column} to  ${statement.loc.end.line}:${
            statement.loc.end.column
          }`
        );
    }
  } catch (error) {
    console.log("statement");
    console.log(statement);
    throw error;
  }
}

function cleanGraphNode({ name, ...rest }) {
  return {
    ...rest,
    name: `"${fp.compose([fp.replace(/(\")/g, "'")])(name)}"`
  };
}

module.exports = { transformGeneralAstToGraph };
