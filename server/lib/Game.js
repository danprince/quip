let EventEmitter = require("events");
let assert  = require("assert");
let Deck = require("./Deck");
let utils = require("./utils");

class Game extends EventEmitter {
  constructor({ config, players }) {
    super();

    this.players = players;
    this.prompts = [];
    this.answers = [];
    this.votes = [];
    this.round = 0;
    this.config = this.createConfig(config);
    this.deck = Deck.from(this.config.packs);
  }

  createConfig(config) {
    let defaults = { packs: ["default"], rounds: 3 };
    return Object.assign({}, defaults, config);
  }

  validate() {
    assert(this.players.length >= 3, "Need at least 3 players to play");
    assert(this.deck.length > 0, "Cannot play with empty deck");
  }

  findPlayer(id) {
    return this.players.find(player => player.id === id);
  }

  findPrompt(id) {
    return this.prompts.find(prompt => prompt.id === id);
  }

  findAnswer(id) {
    return this.answers.find(answer => answer.id === id);
  }

  findVote(id) {
    return this.votes.find(vote => vote.id === id);
  }

  getAnswersForPrompt(promptId) {
    return this.answers.filter(answer => answer.prompt === promptId);
  }

  getVotesForAnswer(answerId) {
    return this.votes.filter(vote => vote.answer === answerId);
  }

  getPromptsForPlayer(playerId) {
    return this.prompts.filter(prompt => prompt.players.includes(playerId));
  }

  restart() {
    this.prompts = [];
    this.answers = [];
    this.votes = [];
    this.round = 0;
    this.deck = Deck.of(this.config.packs);
    this.start();
  }

  start() {
    this.emit("start");
    this.validate();
    this.deck.shuffle();
    this.next();
  }

  next() {
    this.round += 1;
    this.prompts = this.createPrompts();
    this.answers = [];
    this.votes = [];
    this.emit("next", { prompts: this.prompts, round: this.round });
  }

  answer({ prompt, player, text }) {
    this.validateAnswer({ prompt, player, text });
    let answer = { id: `answer-${utils.uid()}`, player, prompt, text };
    this.answers.push(answer);
    this.emit("answer", answer);

    if (this.hasAllAnswers()) {
      this.emit("answered");
    }
  }

  vote({ answer, player }) {
    this.validateVote({ answer, player });
    let vote = { id: `vote-${utils.uid()}`, player, answer };
    this.votes.push(vote);
    this.emit("vote", vote);

    if (this.hasAllVotes()) {
      this.emit("voted");
    }
  }

  validateAnswer({ prompt: promptId, player: playerId, text }) {
    let prompt = this.findPrompt(promptId);
    let player = this.findPlayer(playerId);

    assert(prompt, "Prompt does not exist");
    assert(player, "Player does not exist");
    assert(prompt.players.includes(player.id), "Cannot answer this prompt");

    let answer = this.answers.find(answer => (
      answer.player === player.id &&
      answer.prompt === prompt.id
    ));

    assert(!answer, "Cannot answer twice");
  }

  validateVote({ answer: answerId, player: playerId }) {
    let answer = this.findAnswer(answerId);
    let player = this.findPlayer(playerId);

    assert(answer, "Answer does not exist");
    assert(player, "Player does not exist");

    let prompt = this.findPrompt(answer.prompt);
    assert(!prompt.players.includes(player.id), "Cannot vote for this answer");

    let vote = this.votes.find(vote => (
      vote.player === player.id &&
      vote.answer === answer.id
    ));

    assert(!vote, "Cannot vote twice");
  }

  calculateScores(promptId) {
    let prompt = this.findPrompt(promptId);

    assert(prompt, "Cannot resolve missing prompt");

    let answers = this.getAnswersForPrompt(prompt.id);
    let results = [];

    for (let answer of answers) {
      let votes = this.getVotesForAnswer(answer.id);
      let result = { player: answer.player, votes: votes.length };
      results.push(result);
    }

    results.sort((a, b) => a.votes - b.votes);

    return results;
  }

  applyScores(results) {
    this.emit("reveal");

    for (let result of results) {
      let player = this.findPlayer(result.player);

      if (result.votes > 0) {
        let score = result.votes * 100;
        player.score += score;
        this.emit("score", { player: player.id, score: player.score });
      }
    }
  }

  // FIXME: Prefer to let the room handle this, scoring each prompt
  endRound() {
    for (let prompt of this.prompts) {
      let scores = this.calculateScores(prompt.id);
      this.applyScores(scores);
    }

    if (this.round === this.config.rounds) {
      this.emit("finish");
    } else {
      this.next();
    }
  }

  createPrompts() {
    let pairs = utils.pairs(this.players);

    return pairs.map(pair => {
      let card = this.deck.next();

      let prompt = {
        id: `prompt-${utils.uid()}`,
        players: pair.map(player => player.id),
        text: card.text
      };

      return prompt;
    });
  }

  currentPrompt() {
    return this.prompts[0];
  }

  removeCurrentPrompt() {
    this.prompts.shift();
  }

  hasAllAnswers() {
    let expected = 0;

    for (let prompt of this.prompts)
      expected += prompt.players.length;

    return this.answers.length >= expected;
  }

  hasAllVotes() {
    let expected = this.players.length - 2;
    return this.votes.length >= expected;
  }
}

module.exports = Game;
