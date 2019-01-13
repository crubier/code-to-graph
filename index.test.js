const {
  transformJsStringToMermaidString,
  transformJsStringToJsAst
} = require(".");

test("1", () => {
  const res = transformJsStringToMermaidString("function f(x){return 5;}");
  //   console.log(res);
  expect(res).toEqual(
    `graph TD
  statementfroml1c14tol1c23>"return 5;"]
  style statementfroml1c14tol1c23 fill:#99FF99
`
  );
});

test("2", () => {
  const res = transformJsStringToMermaidString("(x)=>{return 5;}");

  //   console.log(res);
  expect(res).toEqual(`graph TD
  statementfroml1c6tol1c15>"return 5;"]
  style statementfroml1c6tol1c15 fill:#99FF99
`);
});

test("3", () => {
  const res = transformJsStringToMermaidString(
    "(x)=>{if(x===0){return 5;}else{return 4}}"
  );
  //   console.log(res);
  expect(res).toEqual(`graph TD
  statementfroml1c6tol1c40{"x === 0"}
  statementfroml1c16tol1c25>"return 5;"]
  style statementfroml1c16tol1c25 fill:#99FF99
  statementfroml1c31tol1c39>"return 4;"]
  style statementfroml1c31tol1c39 fill:#99FF99
  statementfroml1c6tol1c40 -- true --> statementfroml1c16tol1c25
  statementfroml1c6tol1c40 -- false --> statementfroml1c31tol1c39`);
});

test("4", () => {
  const res = transformJsStringToMermaidString(
    "(x)=>{const a=f(x);if(x===0){return 5;}else{const c=8;return 4}}"
  );
  //   console.log(res);

  expect(res).toEqual(`graph TD
  statementfroml1c6tol1c19("const a = f(x);")
  statementfroml1c19tol1c63{"x === 0"}
  statementfroml1c29tol1c38>"return 5;"]
  style statementfroml1c29tol1c38 fill:#99FF99
  statementfroml1c44tol1c54("const c = 8;")
  statementfroml1c54tol1c62>"return 4;"]
  style statementfroml1c54tol1c62 fill:#99FF99
  statementfroml1c19tol1c63 -- true --> statementfroml1c29tol1c38
  statementfroml1c19tol1c63 -- false --> statementfroml1c44tol1c54
  statementfroml1c44tol1c54 --> statementfroml1c54tol1c62
  statementfroml1c6tol1c19 --> statementfroml1c19tol1c63`);
});

test("5", () => {
  const res = transformJsStringToMermaidString(
    `(x)=>{const a=f(x);if(x===0){let a=null; throw new Error("Nooes")}else{const c=8;return 4}}`
  );
  //   console.log(res);

  expect(res).toEqual(`graph TD
  statementfroml1c6tol1c19("const a = f(x);")
  statementfroml1c19tol1c90{"x === 0"}
  statementfroml1c29tol1c40("let a = null;")
  statementfroml1c41tol1c65>"throw new Error('Nooes');"]
  style statementfroml1c41tol1c65 fill:#FF9999
  statementfroml1c71tol1c81("const c = 8;")
  statementfroml1c81tol1c89>"return 4;"]
  style statementfroml1c81tol1c89 fill:#99FF99
  statementfroml1c19tol1c90 -- true --> statementfroml1c29tol1c40
  statementfroml1c19tol1c90 -- false --> statementfroml1c71tol1c81
  statementfroml1c29tol1c40 --> statementfroml1c41tol1c65
  statementfroml1c71tol1c81 --> statementfroml1c81tol1c89
  statementfroml1c6tol1c19 --> statementfroml1c19tol1c90`);
});
