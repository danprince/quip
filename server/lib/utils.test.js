let test = require("tape");
let utils = require("./utils");

test("utils.random", t => {
  let xs = [1, 2, 3];
  let x = utils.random(xs);

  t.ok(
    x === 1 || x === 2 || x === 3,
    "should pick an item from an array"
  );

  t.end();
});

test("utils.uid", t => {
  t.equal(
    utils.uid(6).length,
    6,
    "should generate a uid with fixed length"
  );

  t.not(
    utils.uid(),
    utils.uid(),
    "should generate unique ids"
  );

  t.end();
});

test("utils.pairs", t => {
  let ids = ["a", "b", "c"];
  let pairs = utils.pairs(ids);

  t.is(pairs.length, 3, "should be a pair for each id");

  t.is(
    pairs.filter(pair => pair.includes("a")).length,
    2,
    "should be two pairs that include 'a'"
  );

  t.is(
    pairs.filter(pair => pair.includes("b")).length,
    2,
    "should be two pairs that include 'b'"
  );

  t.is(
    pairs.filter(pair => pair.includes("c")).length,
    2,
    "should be two pairs that include 'c'"
  );

  t.same(
    pairs.filter(pair => pair[0] === pair[1]),
    [],
    "should be no pairs that contain duplicate ids"
  );

  t.end();
});
