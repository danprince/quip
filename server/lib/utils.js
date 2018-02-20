let { pull } = require("lodash");

function random(xs) {
  let index = Math.floor(Math.random() * xs.length);
  return xs[index];
}

function uid(length=8) {
  let valid = "abcdefghijklmnopqrstuvwxyz";
  let chars = Array.from({ length }).map(() => random(valid));
  return chars.join("");
}

function id(prefix, length) {
  return `${prefix}-${uid(length)}`;
}

function pairs(xs) {
  let pairs = [];
  let ys = [...xs];

  for (let x of xs) {
    let y = random(ys);

    while (x === y) {
      y = random(ys);
    }

    pull(ys, y);
    pairs.push([x, y]);
  }

  return pairs;
}

module.exports = {
  random,
  uid,
  id,
  pairs
}
