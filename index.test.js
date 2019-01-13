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
  statementfroml1c6tol1c40{"if x === 0"}
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
  statementfroml1c19tol1c63{"if x === 0"}
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
  statementfroml1c19tol1c90{"if x === 0"}
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

test("6", () => {
  const res = transformJsStringToMermaidString(
    `(x)=>{switch(x){case 0: return 1;case 2:{const a=1;return 3;};default: return 4}}`
  );
  //   console.log(res);

  expect(res).toEqual(`graph TD
  statementfroml1c6tol1c80{"switch x "}
  statementfroml1c24tol1c33>"return 1;"]
  style statementfroml1c24tol1c33 fill:#99FF99
  statementfroml1c41tol1c51("const a = 1;")
  statementfroml1c51tol1c60>"return 3;"]
  style statementfroml1c51tol1c60 fill:#99FF99
  statementfroml1c61tol1c62("Empty statement at line 1 column 61")
  statementfroml1c71tol1c79>"return 4;"]
  style statementfroml1c71tol1c79 fill:#99FF99
  statementfroml1c6tol1c80 -- 0 --> statementfroml1c24tol1c33
  statementfroml1c41tol1c51 --> statementfroml1c51tol1c60
  statementfroml1c6tol1c80 -- 2 --> statementfroml1c41tol1c51
  statementfroml1c6tol1c80 -- default --> statementfroml1c71tol1c79
  statementfroml1c61tol1c62 --> statementfroml1c71tol1c79`);
});

test("7", () => {
  const res = transformJsStringToMermaidString(
    `(x)=>{
          let y = 9;
          switch(x){
              case 0: throw new Error("coco");
              case 1: return 1;
              case 2:{const a=98;return 3;};
              case 3: y =5;
              case 4: y=9; break;
              default: return 4
          }
          console.log(y);
          return y + 1;
        }`
  );
  //   console.log(res);

  expect(res).toEqual(`graph TD
  statementfroml2c10tol2c20("let y = 9;")
  statementfroml3c10tol10c11{"switch x "}
  statementfroml4c22tol4c46>"throw new Error('coco');"]
  style statementfroml4c22tol4c46 fill:#FF9999
  statementfroml5c22tol5c31>"return 1;"]
  style statementfroml5c22tol5c31 fill:#99FF99
  statementfroml6c22tol6c33("const a = 98;")
  statementfroml6c33tol6c42>"return 3;"]
  style statementfroml6c33tol6c42 fill:#99FF99
  statementfroml6c43tol6c44("Empty statement at line 6 column 43")
  statementfroml7c22tol7c27("y = 5;")
  statementfroml8c22tol8c26("y = 9;")
  statementfroml8c27tol8c33["break;"]
  statementfroml9c23tol9c31>"return 4;"]
  style statementfroml9c23tol9c31 fill:#99FF99
  statementfroml11c10tol11c25("console.log(y);")
  statementfroml12c10tol12c23>"return y + 1;"]
  style statementfroml12c10tol12c23 fill:#99FF99
  statementfroml3c10tol10c11 -- 0 --> statementfroml4c22tol4c46
  statementfroml3c10tol10c11 -- 1 --> statementfroml5c22tol5c31
  statementfroml6c22tol6c33 --> statementfroml6c33tol6c42
  statementfroml3c10tol10c11 -- 2 --> statementfroml6c22tol6c33
  statementfroml3c10tol10c11 -- 3 --> statementfroml7c22tol7c27
  statementfroml6c43tol6c44 --> statementfroml7c22tol7c27
  statementfroml8c22tol8c26 --> statementfroml8c27tol8c33
  statementfroml3c10tol10c11 -- 4 --> statementfroml8c22tol8c26
  statementfroml7c22tol7c27 --> statementfroml8c22tol8c26
  statementfroml3c10tol10c11 -- default --> statementfroml9c23tol9c31
  statementfroml2c10tol2c20 --> statementfroml3c10tol10c11
  statementfroml8c27tol8c33 --> statementfroml11c10tol11c25
  statementfroml11c10tol11c25 --> statementfroml12c10tol12c23`);
});
