const {
  transformJsStringToMermaidString,
  transformJsStringToJsAst
} = require(".");

describe("parser", () => {
  test("return", () => {
    expect(
      transformJsStringToJsAst("function f(x){return 5;}")
    ).toMatchSnapshot();
  });

  test("return", () => {
    expect(
      transformJsStringToJsAst("function f(x){const a = 5;}")
    ).toMatchSnapshot();
  });

  test("if else", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){if(x===5){return 0}else{return 1}}"
      )
    ).toMatchSnapshot();
  });

  test("if else", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){if(x===5){return 0}else if(x===6){return 1}else {return 2}}"
      )
    ).toMatchSnapshot();
  });

  test("switch", () => {
    expect(
      transformJsStringToJsAst(
        "function f(x){switch(x){case 1:return 2; default: break;}return 3;}"
      )
    ).toMatchSnapshot();
  });

  test("switch", () => {
    expect(
      transformJsStringToJsAst(
        `(x)=>{switch(x){case 0: return 1;case 2:{const a=1;return 3;};default: return 4}}`
      )
    ).toMatchSnapshot();
  });

  test("yield", () => {
    expect(
      transformJsStringToJsAst("function* f(x){yield 5;}")
    ).toMatchSnapshot();
  });

  test("const yield", () => {
    expect(
      transformJsStringToJsAst("function* f(x){const a = yield 5;}")
    ).toMatchSnapshot();
  });
});
