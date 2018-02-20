let test = require("tape");
let Deck = require("./Deck");

test("Deck#next", t => {
  let deck = new Deck([
    { text: "foo" },
    { text: "bar" },
    { text: "baz" }
  ]);

  t.same(
    deck.next(),
    { text: "foo" },
    "should take first prompt"
  );

  t.equal(deck.cursor, 1, "should have incremented cursor");

  t.end();
});

test("Deck#take", t => {
  let deck = new Deck([
    { text: "foo" },
    { text: "bar" },
    { text: "baz" }
  ]);

  t.same(
    deck.take(2),
    [ { text: "foo" }, { text: "bar" } ],
    "should take multiple cards"
  );

  t.is(deck.cursor, 2, "should have incremented cursor");

  t.same(
    deck.take(2),
    [ { text: "baz" }, { text: "foo" } ],
    "should be circular"
  );

  t.end();
});

