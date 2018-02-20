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
  let ids = ["a", "b", "c", "d"];
  let pairs = utils.pairs(ids);

  t.is(pairs.length, ids.length, "should be a pair for each id");

  for (let id of ids) {
    t.is(
      pairs.filter(pair => pair.includes(id)).length,
      2,
      `should be two pairs that include '${id}'`
    );
  }

  t.same(
    pairs.filter(pair => pair[0] === pair[1]),
    [],
    "should be no pairs that contain duplicate ids"
  );

  t.end();
});
