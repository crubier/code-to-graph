#!/usr/bin/env node

const fs = require("fs");
const { transformJsStringToMermaidString } = require(".");

const [, , ...args] = process.argv;

console.log(`Hello world ${args}`);

function main(args) {
  const string = fs.readFileSync(args[0], { encoding: "utf8" });
  //   console.log(string);
  transformJsStringToMermaidString(string);
}

main(args);
