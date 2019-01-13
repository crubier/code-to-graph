const {
  transformJsStringToMermaidString,
  transformJsStringToJsAst
} = require(".");

describe("parser", () => {
  test("return", () => {
    expect(transformJsStringToJsAst("function f(x){return 5;}")).toEqual({
      async: false,
      body: {
        body: [
          {
            argument: {
              end: 22,
              extra: { raw: "5", rawValue: 5 },
              loc: {
                end: { column: 22, line: 1 },
                start: { column: 21, line: 1 }
              },
              start: 21,
              type: "NumericLiteral",
              value: 5
            },
            end: 23,
            loc: {
              end: { column: 23, line: 1 },
              start: { column: 14, line: 1 }
            },
            start: 14,
            type: "ReturnStatement"
          }
        ],
        directives: [],
        end: 24,
        loc: { end: { column: 24, line: 1 }, start: { column: 13, line: 1 } },
        start: 13,
        type: "BlockStatement"
      },
      comments: [],
      end: 24,
      generator: false,
      id: {
        end: 10,
        loc: {
          end: { column: 10, line: 1 },
          identifierName: "f",
          start: { column: 9, line: 1 }
        },
        name: "f",
        start: 9,
        type: "Identifier"
      },
      loc: { end: { column: 24, line: 1 }, start: { column: 0, line: 1 } },
      params: [
        {
          end: 12,
          loc: {
            end: { column: 12, line: 1 },
            identifierName: "x",
            start: { column: 11, line: 1 }
          },
          name: "x",
          start: 11,
          type: "Identifier"
        }
      ],
      start: 0,
      type: "FunctionExpression"
    });
  });

  test("return", () => {
    expect(transformJsStringToJsAst("function f(x){const a = 5;}")).toEqual({
      async: false,
      body: {
        body: [
          {
            declarations: [
              {
                end: 25,
                id: {
                  end: 21,
                  loc: {
                    end: { column: 21, line: 1 },
                    identifierName: "a",
                    start: { column: 20, line: 1 }
                  },
                  name: "a",
                  start: 20,
                  type: "Identifier"
                },
                init: {
                  end: 25,
                  extra: { raw: "5", rawValue: 5 },
                  loc: {
                    end: { column: 25, line: 1 },
                    start: { column: 24, line: 1 }
                  },
                  start: 24,
                  type: "NumericLiteral",
                  value: 5
                },
                loc: {
                  end: { column: 25, line: 1 },
                  start: { column: 20, line: 1 }
                },
                start: 20,
                type: "VariableDeclarator"
              }
            ],
            end: 26,
            kind: "const",
            loc: {
              end: { column: 26, line: 1 },
              start: { column: 14, line: 1 }
            },
            start: 14,
            type: "VariableDeclaration"
          }
        ],
        directives: [],
        end: 27,
        loc: { end: { column: 27, line: 1 }, start: { column: 13, line: 1 } },
        start: 13,
        type: "BlockStatement"
      },
      comments: [],
      end: 27,
      generator: false,
      id: {
        end: 10,
        loc: {
          end: { column: 10, line: 1 },
          identifierName: "f",
          start: { column: 9, line: 1 }
        },
        name: "f",
        start: 9,
        type: "Identifier"
      },
      loc: { end: { column: 27, line: 1 }, start: { column: 0, line: 1 } },
      params: [
        {
          end: 12,
          loc: {
            end: { column: 12, line: 1 },
            identifierName: "x",
            start: { column: 11, line: 1 }
          },
          name: "x",
          start: 11,
          type: "Identifier"
        }
      ],
      start: 0,
      type: "FunctionExpression"
    });
  });

  test("if else", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){if(x===5){return 0}else{return 1}}"
      )
    ).toEqual({
      async: false,
      body: {
        body: [
          {
            alternate: {
              body: [
                {
                  argument: {
                    end: 46,
                    extra: { raw: "1", rawValue: 1 },
                    loc: {
                      end: { column: 46, line: 1 },
                      start: { column: 45, line: 1 }
                    },
                    start: 45,
                    type: "NumericLiteral",
                    value: 1
                  },
                  end: 46,
                  loc: {
                    end: { column: 46, line: 1 },
                    start: { column: 38, line: 1 }
                  },
                  start: 38,
                  type: "ReturnStatement"
                }
              ],
              directives: [],
              end: 47,
              loc: {
                end: { column: 47, line: 1 },
                start: { column: 37, line: 1 }
              },
              start: 37,
              type: "BlockStatement"
            },
            consequent: {
              body: [
                {
                  argument: {
                    end: 32,
                    extra: { raw: "0", rawValue: 0 },
                    loc: {
                      end: { column: 32, line: 1 },
                      start: { column: 31, line: 1 }
                    },
                    start: 31,
                    type: "NumericLiteral",
                    value: 0
                  },
                  end: 32,
                  loc: {
                    end: { column: 32, line: 1 },
                    start: { column: 24, line: 1 }
                  },
                  start: 24,
                  type: "ReturnStatement"
                }
              ],
              directives: [],
              end: 33,
              loc: {
                end: { column: 33, line: 1 },
                start: { column: 23, line: 1 }
              },
              start: 23,
              type: "BlockStatement"
            },
            end: 47,
            loc: {
              end: { column: 47, line: 1 },
              start: { column: 14, line: 1 }
            },
            start: 14,
            test: {
              end: 22,
              left: {
                end: 18,
                loc: {
                  end: { column: 18, line: 1 },
                  identifierName: "x",
                  start: { column: 17, line: 1 }
                },
                name: "x",
                start: 17,
                type: "Identifier"
              },
              loc: {
                end: { column: 22, line: 1 },
                start: { column: 17, line: 1 }
              },
              operator: "===",
              right: {
                end: 22,
                extra: { raw: "5", rawValue: 5 },
                loc: {
                  end: { column: 22, line: 1 },
                  start: { column: 21, line: 1 }
                },
                start: 21,
                type: "NumericLiteral",
                value: 5
              },
              start: 17,
              type: "BinaryExpression"
            },
            type: "IfStatement"
          }
        ],
        directives: [],
        end: 48,
        loc: { end: { column: 48, line: 1 }, start: { column: 13, line: 1 } },
        start: 13,
        type: "BlockStatement"
      },
      comments: [],
      end: 48,
      generator: false,
      id: {
        end: 10,
        loc: {
          end: { column: 10, line: 1 },
          identifierName: "f",
          start: { column: 9, line: 1 }
        },
        name: "f",
        start: 9,
        type: "Identifier"
      },
      loc: { end: { column: 48, line: 1 }, start: { column: 0, line: 1 } },
      params: [
        {
          end: 12,
          loc: {
            end: { column: 12, line: 1 },
            identifierName: "x",
            start: { column: 11, line: 1 }
          },
          name: "x",
          start: 11,
          type: "Identifier"
        }
      ],
      start: 0,
      type: "FunctionExpression"
    });
  });

  test("if else", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){if(x===5){return 0}else if(x===6){return 1}else {return 2}}"
      )
    ).toEqual({
      async: false,
      body: {
        body: [
          {
            alternate: {
              alternate: {
                body: [
                  {
                    argument: {
                      end: 71,
                      extra: { raw: "2", rawValue: 2 },
                      loc: {
                        end: {
                          column: 71,
                          line: 1
                        },
                        start: {
                          column: 70,
                          line: 1
                        }
                      },
                      start: 70,
                      type: "NumericLiteral",
                      value: 2
                    },
                    end: 71,
                    loc: {
                      end: { column: 71, line: 1 },
                      start: { column: 63, line: 1 }
                    },
                    start: 63,
                    type: "ReturnStatement"
                  }
                ],
                directives: [],
                end: 72,
                loc: {
                  end: { column: 72, line: 1 },
                  start: { column: 62, line: 1 }
                },
                start: 62,
                type: "BlockStatement"
              },
              consequent: {
                body: [
                  {
                    argument: {
                      end: 56,
                      extra: { raw: "1", rawValue: 1 },
                      loc: {
                        end: {
                          column: 56,
                          line: 1
                        },
                        start: {
                          column: 55,
                          line: 1
                        }
                      },
                      start: 55,
                      type: "NumericLiteral",
                      value: 1
                    },
                    end: 56,
                    loc: {
                      end: { column: 56, line: 1 },
                      start: { column: 48, line: 1 }
                    },
                    start: 48,
                    type: "ReturnStatement"
                  }
                ],
                directives: [],
                end: 57,
                loc: {
                  end: { column: 57, line: 1 },
                  start: { column: 47, line: 1 }
                },
                start: 47,
                type: "BlockStatement"
              },
              end: 72,
              loc: {
                end: { column: 72, line: 1 },
                start: { column: 38, line: 1 }
              },
              start: 38,
              test: {
                end: 46,
                left: {
                  end: 42,
                  loc: {
                    end: { column: 42, line: 1 },
                    identifierName: "x",
                    start: { column: 41, line: 1 }
                  },
                  name: "x",
                  start: 41,
                  type: "Identifier"
                },
                loc: {
                  end: { column: 46, line: 1 },
                  start: { column: 41, line: 1 }
                },
                operator: "===",
                right: {
                  end: 46,
                  extra: { raw: "6", rawValue: 6 },
                  loc: {
                    end: { column: 46, line: 1 },
                    start: { column: 45, line: 1 }
                  },
                  start: 45,
                  type: "NumericLiteral",
                  value: 6
                },
                start: 41,
                type: "BinaryExpression"
              },
              type: "IfStatement"
            },
            consequent: {
              body: [
                {
                  argument: {
                    end: 32,
                    extra: { raw: "0", rawValue: 0 },
                    loc: {
                      end: { column: 32, line: 1 },
                      start: { column: 31, line: 1 }
                    },
                    start: 31,
                    type: "NumericLiteral",
                    value: 0
                  },
                  end: 32,
                  loc: {
                    end: { column: 32, line: 1 },
                    start: { column: 24, line: 1 }
                  },
                  start: 24,
                  type: "ReturnStatement"
                }
              ],
              directives: [],
              end: 33,
              loc: {
                end: { column: 33, line: 1 },
                start: { column: 23, line: 1 }
              },
              start: 23,
              type: "BlockStatement"
            },
            end: 72,
            loc: {
              end: { column: 72, line: 1 },
              start: { column: 14, line: 1 }
            },
            start: 14,
            test: {
              end: 22,
              left: {
                end: 18,
                loc: {
                  end: { column: 18, line: 1 },
                  identifierName: "x",
                  start: { column: 17, line: 1 }
                },
                name: "x",
                start: 17,
                type: "Identifier"
              },
              loc: {
                end: { column: 22, line: 1 },
                start: { column: 17, line: 1 }
              },
              operator: "===",
              right: {
                end: 22,
                extra: { raw: "5", rawValue: 5 },
                loc: {
                  end: { column: 22, line: 1 },
                  start: { column: 21, line: 1 }
                },
                start: 21,
                type: "NumericLiteral",
                value: 5
              },
              start: 17,
              type: "BinaryExpression"
            },
            type: "IfStatement"
          }
        ],
        directives: [],
        end: 73,
        loc: { end: { column: 73, line: 1 }, start: { column: 13, line: 1 } },
        start: 13,
        type: "BlockStatement"
      },
      comments: [],
      end: 73,
      generator: false,
      id: {
        end: 10,
        loc: {
          end: { column: 10, line: 1 },
          identifierName: "f",
          start: { column: 9, line: 1 }
        },
        name: "f",
        start: 9,
        type: "Identifier"
      },
      loc: { end: { column: 73, line: 1 }, start: { column: 0, line: 1 } },
      params: [
        {
          end: 12,
          loc: {
            end: { column: 12, line: 1 },
            identifierName: "x",
            start: { column: 11, line: 1 }
          },
          name: "x",
          start: 11,
          type: "Identifier"
        }
      ],
      start: 0,
      type: "FunctionExpression"
    });
  });

  // test("2", () => {
  //   expect(transformJsStringToMermaidString("(x)=>{return 5;}")).toEqual("");
  // });

  // test("2", () => {
  //   expect(transformJsStringToMermaidString("(x)=>{return 5;}")).toEqual("");
  // });
});
