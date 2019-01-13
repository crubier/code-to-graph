#!/usr/bin/env node

const fs = require("fs");
const opn = require("opn");
const { transformJsStringToMermaidString } = require(".");

const [, , ...args] = process.argv;

// console.log(`Hello world ${args}`);

function main(args) {
  const string = fs.readFileSync(args[0], { encoding: "utf8" });
  const result = transformJsStringToMermaidString(string);
  console.log("\n\n");
  console.log(result);
  console.log("\n\n");
  try {
    const base64Result = Buffer.from(result).toString("base64");
    opn(
      `https://mermaidjs.github.io/mermaid-live-editor/#/edit/${base64Result}`,
      { wait: false }
    );
  } catch (e) {
    return;
  }
}

main(args);
