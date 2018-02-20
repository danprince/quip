let test = require("tape");
let Game = require("./Game");

test("Game", t => {
  let game = new Game({
    config: { packs: ["default"] },
    players: [
      { id: "dan", name: "Dan", score: 0 },
      { id: "ed", name: "Ed", score: 0 },
      { id: "pete", name: "Pete", score: 0 }
    ]
  });

  game.on("start", () => t.pass("should emit 'start' event"));
  game.on("next", () => t.pass("should emit 'next' event"));

  game.start();

  t.is(game.round, 1, "should start at round 1");
  t.same(game.answers, [], "should reset answers");
  t.same(game.votes, [], "should reset votes");
  t.is(game.prompts.length, 3, "should create two prompts for each player");

  t.is(
    game.getPromptsForPlayer("dan").length, 2,
    "should create two prompts for dan"
  );

  t.is(
    game.getPromptsForPlayer("ed").length, 2,
    "should create two prompts for ed"
  );

  t.is(
    game.getPromptsForPlayer("pete").length, 2,
    "should create two prompts for pete"
  );

  // Override the generated prompts so that we can test answering for
  // specific players.
  game.prompts = [
    { id: "a", players: ["dan", "ed"], text: "foo" },
    { id: "b", players: ["ed", "pete"], text: "bar" },
    { id: "c", players: ["pete", "dan"], text: "baz" }
  ];

  t.throws(
    () => game.answer({
      prompt: "a",
      player: "barry",
      text: "fun"
    }),
    /Player does not exist/,
    "should not accept answers from missing players"
  );

  t.throws(
    () => game.answer({
      prompt: "z",
      player: "dan",
      text: "fun"
    }),
    /Prompt does not exist/,
    "should not accept answers for missing prompts"
  );

  t.throws(
    () => game.answer({
      prompt: "a",
      player: "pete",
      text: "fun"
    }),
    /Cannot answer this prompt/,
    "should not be able to answer another players prompt"
  );

  game.on("answer", () => t.pass("should emit 'answer' event"));

  game.answer({ prompt: "a", player: "dan", text: "woop" });
  game.answer({ prompt: "a", player: "ed", text: "foop" });
  game.answer({ prompt: "b", player: "pete", text: "shoop" });
  game.answer({ prompt: "b", player: "ed", text: "floop" });
  game.answer({ prompt: "c", player: "dan", text: "gloop" });
  game.answer({ prompt: "c", player: "pete", text: "noop" });

  t.throws(
    () => game.answer({ prompt: "a", player: "dan", text: "yoop" }),
    /Cannot answer twice/,
    "should not be able to answer a prompt twice"
  );

  // Override the generated answers so that we can test voting
  // for specific players.
  game.answers = [
    { id: "a", prompt: "a", player: "dan", text: "woop" },
    { id: "b", prompt: "a", player: "ed", text: "foop" },
    { id: "c", prompt: "b", player: "pete", text: "shoop" },
    { id: "d", prompt: "b", player: "ed", text: "floop" },
    { id: "e", prompt: "c", player: "dan", text: "gloop" },
    { id: "f", prompt: "c", player: "pete", text: "noop" }
  ];

  game.on("vote", () => t.pass("should emit 'vote' event"));

  t.throws(
    () => game.vote({
      answer: "z",
      player: "pete"
    }),
    /Answer does not exist/,
    "should not be able vote for missing answer"
  );

  t.throws(
    () => game.vote({
      answer: "a",
      player: "barry"
    }),
    /Player does not exist/,
    "should not be able vote as missing player"
  );

  t.throws(
    () => game.vote({
      answer: "a",
      player: "ed"
    }),
    /Cannot vote for this answer/,
    "should not be able vote on opposing prompt"
  );

  game.vote({ answer: "a", player: "pete" });
  game.vote({ answer: "c", player: "dan" });
  game.vote({ answer: "e", player: "ed" });

  t.throws(
    () => game.calculateScores("z"),
    /Cannot resolve missing prompt/,
    "should not be able to resolve a missing prompt"
  );

  game.on("resolve", () => t.pass("should emit 'resolve' event"));
  game.on("score", () => t.pass("should emit 'score' event"));

  t.same(
    game.calculateScores("a"),
    [{ player: "ed", votes: 0 }, { player: "dan", votes: 1 }],
    "dan should win prompt a"
  );

  t.same(
    game.calculateScores("b"),
    [{ player: "ed", votes: 0 }, { player: "pete", votes: 1 }],
    "pete should win prompt b"
  );

  t.same(
    game.calculateScores("c"),
    [{ player: "pete", votes: 0 }, { player: "dan", votes: 1 }],
    "dan should win prompt c"
  );

  game.on("reveal", () => t.pass("should emit 'reveal' event"));

  game.endRound();

  t.is(game.findPlayer("dan").score, 200, "dan should have 200 points");
  t.is(game.findPlayer("pete").score, 100, "pete should have 100 points");
  t.is(game.findPlayer("ed").score, 0, "ed should have 0 points");

  t.same(game.round, 2, "should advance to round 2");
  t.same(game.answers, [], "should reset answers");
  t.same(game.votes, [], "should reset votes");

  t.end();
});
