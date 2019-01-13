import { toto } from "tutu";

function main(args) {
  function f() {
    const d = async () => {
      await 5;
      return toto;
    };
    let a = 5;
    a = a + 1;
    if (a > 3) {
      throw new Error("not normal");
    }
    return 1;
  }
}

export async function* totoGen(args) {
  yield 1;
  yield 5;
  const c = yield 21;
  const d = await coco(c);
  return d;
}

async function coucou(x) {
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

export default toto;
