import { toto } from "tutu";

function main(args) {
  return 1;
}

export function toto(args) {
  return 2;
}

async function coucou(x) {
  const a = 5;
  const b = await toto(44);
  if (b) {
    return 5;
  }
  return a * 3;
}

export default toto;
