const { stringToMermaid } = require(".");

test("1", () => {
  expect(stringToMermaid("function f(x){return 5;}")).toEqual("");
});
