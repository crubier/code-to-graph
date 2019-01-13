# code-to-graph

Transforms code (JS) into graphs (graphviz, mermaid flowchart, ...)

Turns this:

```javascript
x => {
  const a = f(x);
  if (x === 0) {
    let a = null;
    throw new Error("Nooes");
  } else {
    const c = 8;
    return 4;
  }
};
```

Into this:

```mermaid
graph TD
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
        statementfroml1c6tol1c19 --> statementfroml1c19tol1c90
```

Whichs renders into this:

![Example mermaid diagram](./mermaid-diagram-example.svg)

# Usage

Call the cli with a js file name, it prints out the Mermaid.js graph definition

```bash
code-to-graph example.js
```
