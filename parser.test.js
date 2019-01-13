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

  test("switch", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){switch(x){case 1:return 2; default: break;}return 3;}"
      )
    ).toEqual({
      async: false,
      body: {
        body: [
          {
            cases: [
              {
                consequent: [
                  {
                    argument: {
                      end: 39,
                      extra: { raw: "2", rawValue: 2 },
                      loc: {
                        end: {
                          column: 39,
                          line: 1
                        },
                        start: {
                          column: 38,
                          line: 1
                        }
                      },
                      start: 38,
                      type: "NumericLiteral",
                      value: 2
                    },
                    end: 40,
                    loc: {
                      end: { column: 40, line: 1 },
                      start: { column: 31, line: 1 }
                    },
                    start: 31,
                    type: "ReturnStatement"
                  }
                ],
                end: 40,
                loc: {
                  end: { column: 40, line: 1 },
                  start: { column: 24, line: 1 }
                },
                start: 24,
                test: {
                  end: 30,
                  extra: { raw: "1", rawValue: 1 },
                  loc: {
                    end: { column: 30, line: 1 },
                    start: { column: 29, line: 1 }
                  },
                  start: 29,
                  type: "NumericLiteral",
                  value: 1
                },
                type: "SwitchCase"
              },
              {
                consequent: [
                  {
                    end: 56,
                    label: null,
                    loc: {
                      end: { column: 56, line: 1 },
                      start: { column: 50, line: 1 }
                    },
                    start: 50,
                    type: "BreakStatement"
                  }
                ],
                end: 56,
                loc: {
                  end: { column: 56, line: 1 },
                  start: { column: 41, line: 1 }
                },
                start: 41,
                test: null,
                type: "SwitchCase"
              }
            ],
            discriminant: {
              end: 22,
              loc: {
                end: { column: 22, line: 1 },
                identifierName: "x",
                start: { column: 21, line: 1 }
              },
              name: "x",
              start: 21,
              type: "Identifier"
            },
            end: 57,
            loc: {
              end: { column: 57, line: 1 },
              start: { column: 14, line: 1 }
            },
            start: 14,
            type: "SwitchStatement"
          },
          {
            argument: {
              end: 65,
              extra: { raw: "3", rawValue: 3 },
              loc: {
                end: { column: 65, line: 1 },
                start: { column: 64, line: 1 }
              },
              start: 64,
              type: "NumericLiteral",
              value: 3
            },
            end: 66,
            loc: {
              end: { column: 66, line: 1 },
              start: { column: 57, line: 1 }
            },
            start: 57,
            type: "ReturnStatement"
          }
        ],
        directives: [],
        end: 67,
        loc: { end: { column: 67, line: 1 }, start: { column: 13, line: 1 } },
        start: 13,
        type: "BlockStatement"
      },
      comments: [],
      end: 67,
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
      loc: { end: { column: 67, line: 1 }, start: { column: 0, line: 1 } },
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

  test("switch", () => {
    expect(
      transformJsStringToJsAst(
        `(x)=>{switch(x){case 0: return 1;case 2:{const a=1;return 3;};default: return 4}}`
      )
    ).toEqual({
      async: false,
      body: {
        body: [
          {
            cases: [
              {
                consequent: [
                  {
                    argument: {
                      end: 32,
                      extra: { raw: "1", rawValue: 1 },
                      loc: {
                        end: { line: 1, column: 32 },
                        start: { line: 1, column: 31 }
                      },
                      start: 31,
                      type: "NumericLiteral",
                      value: 1
                    },
                    end: 33,
                    loc: {
                      end: { column: 33, line: 1 },
                      start: { column: 24, line: 1 }
                    },
                    start: 24,
                    type: "ReturnStatement"
                  }
                ],
                end: 33,
                loc: {
                  end: { column: 33, line: 1 },
                  start: { column: 16, line: 1 }
                },
                start: 16,
                test: {
                  end: 22,
                  extra: { raw: "0", rawValue: 0 },
                  loc: {
                    end: { column: 22, line: 1 },
                    start: { column: 21, line: 1 }
                  },
                  start: 21,
                  type: "NumericLiteral",
                  value: 0
                },
                type: "SwitchCase"
              },
              {
                consequent: [
                  {
                    body: [
                      {
                        declarations: [
                          {
                            end: 50,
                            id: {
                              end: 48,
                              loc: {
                                end: {
                                  column: 48,
                                  line: 1
                                },
                                identifierName: "a",
                                start: {
                                  column: 47,
                                  line: 1
                                }
                              },
                              name: "a",
                              start: 47,
                              type: "Identifier"
                            },
                            init: {
                              end: 50,
                              extra: {
                                raw: "1",
                                rawValue: 1
                              },
                              loc: {
                                end: {
                                  column: 50,
                                  line: 1
                                },
                                start: {
                                  column: 49,
                                  line: 1
                                }
                              },
                              start: 49,
                              type: "NumericLiteral",
                              value: 1
                            },
                            loc: {
                              end: {
                                column: 50,
                                line: 1
                              },
                              start: {
                                column: 47,
                                line: 1
                              }
                            },
                            start: 47,
                            type: "VariableDeclarator"
                          }
                        ],
                        end: 51,
                        kind: "const",
                        loc: {
                          start: { line: 1, column: 41 },
                          end: { line: 1, column: 51 }
                        },
                        start: 41,
                        type: "VariableDeclaration"
                      },
                      {
                        argument: {
                          end: 59,
                          extra: {
                            raw: "3",
                            rawValue: 3
                          },
                          loc: {
                            end: {
                              column: 59,
                              line: 1
                            },
                            start: {
                              column: 58,
                              line: 1
                            }
                          },
                          start: 58,
                          type: "NumericLiteral",
                          value: 3
                        },
                        end: 60,
                        loc: {
                          start: { line: 1, column: 51 },
                          end: { line: 1, column: 60 }
                        },
                        start: 51,
                        type: "ReturnStatement"
                      }
                    ],
                    directives: [],
                    end: 61,
                    loc: {
                      end: { column: 61, line: 1 },
                      start: { column: 40, line: 1 }
                    },
                    start: 40,
                    type: "BlockStatement"
                  },
                  {
                    end: 62,
                    loc: {
                      end: { column: 62, line: 1 },
                      start: { column: 61, line: 1 }
                    },
                    start: 61,
                    type: "EmptyStatement"
                  }
                ],
                end: 62,
                loc: {
                  end: { column: 62, line: 1 },
                  start: { column: 33, line: 1 }
                },
                start: 33,
                test: {
                  end: 39,
                  extra: { raw: "2", rawValue: 2 },
                  loc: {
                    end: { column: 39, line: 1 },
                    start: { column: 38, line: 1 }
                  },
                  start: 38,
                  type: "NumericLiteral",
                  value: 2
                },
                type: "SwitchCase"
              },
              {
                consequent: [
                  {
                    argument: {
                      end: 79,
                      extra: { raw: "4", rawValue: 4 },
                      loc: {
                        end: { line: 1, column: 79 },
                        start: { line: 1, column: 78 }
                      },
                      start: 78,
                      type: "NumericLiteral",
                      value: 4
                    },
                    end: 79,
                    loc: {
                      end: { column: 79, line: 1 },
                      start: { column: 71, line: 1 }
                    },
                    start: 71,
                    type: "ReturnStatement"
                  }
                ],
                end: 79,
                loc: {
                  end: { column: 79, line: 1 },
                  start: { column: 62, line: 1 }
                },
                start: 62,
                test: null,
                type: "SwitchCase"
              }
            ],
            discriminant: {
              end: 14,
              loc: {
                end: { column: 14, line: 1 },
                identifierName: "x",
                start: { column: 13, line: 1 }
              },
              name: "x",
              start: 13,
              type: "Identifier"
            },
            end: 80,
            loc: {
              end: { column: 80, line: 1 },
              start: { column: 6, line: 1 }
            },
            start: 6,
            type: "SwitchStatement"
          }
        ],
        directives: [],
        end: 81,
        loc: { end: { column: 81, line: 1 }, start: { column: 5, line: 1 } },
        start: 5,
        type: "BlockStatement"
      },
      comments: [],
      end: 81,
      generator: false,
      id: null,
      loc: { end: { column: 81, line: 1 }, start: { column: 0, line: 1 } },
      params: [
        {
          end: 2,
          loc: {
            end: { column: 2, line: 1 },
            identifierName: "x",
            start: { column: 1, line: 1 }
          },
          name: "x",
          start: 1,
          type: "Identifier"
        }
      ],
      start: 0,
      type: "ArrowFunctionExpression"
    });
  });
});
