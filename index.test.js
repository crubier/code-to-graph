const {
  transformJsStringToMermaidString,
  transformJsStringToJsAst
} = require(".");

// test("1", () => {
//   const res = transformJsStringToMermaidString("function f(x){return 5;}");
//   console.log(res);
//   expect(res).toEqual(
//     `graph TD
//   statementfroml1c14tol1c23>\"return 5\"]
// `
//   );
// });

// test("2", () => {
//   const res = transformJsStringToMermaidString("(x)=>{return 5;}");

//   console.log(res);
//   expect(res).toEqual(`graph TD
//   statementfroml1c6tol1c15>return 5]
// `);
// });

// test("3", () => {
//   const res = transformJsStringToMermaidString(
//     "(x)=>{if(x===0){return 5;}else{return 4}}"
//   );
//   console.log(res);
//   expect(res).toEqual(`graph TD
//   statementfroml1c6tol1c40{x = 0}
//   statementfroml1c15tol1c26(  return 5)
//   statementfroml1c30tol1c40(  return 4)
//   statementfroml1c6tol1c40 -- true --> statementfroml1c15tol1c26
//   statementfroml1c6tol1c40 -- false --> statementfroml1c30tol1c40`);
// });

test("4", () => {
  const res = transformJsStringToMermaidString(
    "(x)=>{const a=f(x);if(x===0){return 5;}else{const c=8;return 4}}"
  );
  console.log(res);
  expect(res).toEqual(``);
});
