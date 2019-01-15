import { toto } from "tutu";

function tryCatchExample(args) {
  function f() {
    const d = async () => {
      await 5;
      return toto;
    };
    const ff = 45;
    try {
      let a = 5;
      a = a + 1;
      if (a > 3) {
        throw new Error("not normal");
      }
    } catch (e) {
      console.log("in the catch");
      if (v) return 5;
      if (ftw) throw new Error("Real bad");
    } finally {
      console.log("in the finally");
      if (u) return 8;
    }
    return 1;
  }
}

export async function* generatorExample(args) {
  yield 1;
  yield 5;
  if (myCond) {
    const c = yield 21;
    const d = await coco(c);
  } else {
    yield 25;
    let u = yield f(45 + 6);
  }
  for await (let a of b) {
    const b = await f(a);
    yield b + b;
    frameElement(2);
    const u = yield 6;
  }
  return d;
}

async function controlFlowExample(x) {
  const a = 5;
  const b = await toto(44);
  while (b > 0) {
    if (b) {
      return 5;
    } else if (c) {
      throw new Error("Not");
    } else {
      b = 52;
    }
  }
  do {
    b = b + 1;
    c = f(k);
    if (k) {
      break;
    }
  } while (b < 4);
  if (k++ == 5) {
    coucou2 = 24;
  }
  for (let t = 0; t < 5; t++) {
    if (l) {
      f(h);
    } else {
      webkitCancelAnimationFrame(32);
    }
  }
  return a * 3;
}

class ExampleClass {
  myMethod(x) {
    console.log("lol");
    return;
  }
  exampleMethod(x) {
    if (myCondition) return 5;
    return 6;
  }
  property = 8;
  static staticProp = 19;
  render() {
    return (
      <div>
        <span>Toto</span>
        <span>Titi</span>
      </div>
    );
  }
}

export default toto;
