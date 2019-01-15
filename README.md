# code-to-graph

Transforms code (JS) into graphs (graphviz, mermaid flowchart, ...)

## Interactive Demo

https://crubier.github.io/code-to-graph/

[A bigger example](https://crubier.github.io/code-to-graph/?code=aW1wb3J0IHsgdG90byB9IGZyb20gInR1dHUiOwoKZnVuY3Rpb24gbWFpbihhcmdzKSB7CiAgZnVuY3Rpb24gZigpIHsKICAgIGNvbnN0IGQgPSBhc3luYyAoKSA9PiB7CiAgICAgIGF3YWl0IDU7CiAgICAgIHJldHVybiB0b3RvOwogICAgfTsKICAgIGxldCBhID0gNTsKICAgIGEgPSBhICsgMTsKICAgIGlmIChhID4gMykgewogICAgICB0aHJvdyBuZXcgRXJyb3IoIm5vdCBub3JtYWwiKTsKICAgIH0KICAgIHJldHVybiAxOwogIH0KfQoKZXhwb3J0IGFzeW5jIGZ1bmN0aW9uKiB0b3RvR2VuKGFyZ3MpIHsKICB5aWVsZCAxOwogIHlpZWxkIDU7CiAgY29uc3QgYyA9IHlpZWxkIDIxOwogIGNvbnN0IGQgPSBhd2FpdCBjb2NvKGMpOwogIHJldHVybiBkOwp9Cgphc3luYyBmdW5jdGlvbiBjb3Vjb3UoeCkgewogIGNvbnN0IGEgPSA1OwogIGNvbnN0IGIgPSBhd2FpdCB0b3RvKDQ0KTsKICB3aGlsZSAoYiA-IDApIHsKICAgIGlmIChiKSB7CiAgICAgIHJldHVybiA1OwogICAgfSBlbHNlIGlmIChjKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigiTm90Iik7CiAgICB9IGVsc2UgewogICAgICBiID0gNTI7CiAgICB9CiAgfQogIGRvIHsKICAgIGIgPSBiICsgMTsKICAgIGMgPSBmKGspOwogICAgaWYgKGspIHsKICAgICAgYnJlYWs7CiAgICB9CiAgfSB3aGlsZSAoYiA8IDQpOwogIGlmIChrKysgPT0gNSkgewogICAgY291Y291MiA9IDI0OwogIH0KICBmb3IgKGxldCB0ID0gMDsgdCA8IDU7IHQrKykgewogICAgaWYgKGwpIHsKICAgICAgZihoKTsKICAgIH0gZWxzZSB7CiAgICAgIHdlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lKDMyKTsKICAgIH0KICB9CiAgcmV0dXJuIGEgKiAzOwp9CgpleHBvcnQgZGVmYXVsdCB0b3RvOwo)

## CLI Usage

Call the cli with a js file name, it prints out the Mermaid.js graph definition

```bash
yarn global add code-to-graph
code-to-graph example.js
```

To see the result visualy, paste it in

https://mermaidjs.github.io/mermaid-live-editor

Or you can use it on gitlab using the ```mermaid language in comments, descriptions or markdown files.

## Explanation

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
