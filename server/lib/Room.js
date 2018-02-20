let log = require("winston");
let assert = require("assert");
let utils = require("./utils");
let Game = require("./Game");
let Timer = require("./Timer");
let settings = require("./settings");

class Room {
  constructor(server, host) {
    this.id = utils.uid(4);
    this.host = host;
    this.game = null;
    this.config = {};
    this.timers = {};
    this.clients = [];
    this.server = server.of(`/${this.id}`);

    this.server.on("connection", socket => this.join(socket));

    this.host.on("game.start", config => {
      this.transition(() => this.start(config));
      this.message("Host has started the game");
    });

    this.log("room created");
  }

  emit(event, ...args) {
    this.server.emit(event, ...args);
    this.host.emit(event, ...args);
  }

  message(text) {
    this.emit("room.message", { text });
  }

  timer(callback, seconds, notify=true) {
    let timer = new Timer(callback, seconds * 1000);

    if (notify) {
      timer.on("start", () => this.emit("timer.start", timer))
      timer.on("stop", () => this.emit("timer.stop", timer));
    }

    timer.start();

    return timer;
  }

  transition(callback) {
    return this.timer(callback, settings["timers.transition"], false);
  }

  log(message) {
    log.info(`(${this.id}) ${message}`);
  }

  join(socket) {
    if (this.hasStarted()) {
      return socket.emit("err", { message: "Game has already started" });
    }

    if (this.isFull()) {
      return socket.emit("err", { message: "Game is full" });
    }

    let id = `player-${utils.uid()}`;
    let client = { id, name: "", socket };

    this.clients.push(client);
    this.emit("player.join", client.id);
    this.log(`'${id}' joined`);

    socket.emit("game.init", {
      me: client.id,
      players: this.getPlayers(),
    });

    socket.on("disconnect", reason => {
      this.log(`'${client.name || client.id}' left the game`);
      this.leave(id);
    });

    socket.on("player.rename", name => {
      assert(this.hasStarted() === false, "Can't rename while playing");
      this.log(`'${client.name || client.id}' renamed to '${name}'`);
      this.emit("player.rename", { player: id, name });
      client.name = name;
    });

    socket.on("game.answer", ({ prompt, text }) => {
      this.log(`'${client.name}' answered with '${text}'`);
      this.game.answer({ player: id, prompt, text });
    });

    socket.on("game.vote", ({ answer }) => {
      this.log(`'${client.name}' voted for '${answer}'`);
      this.game.vote({ player: id, answer });
    });
  }

  leave(id) {
    assert(this.hasStarted() === false, "Can't leave during the game");
    this.clients = this.clients.filter(client => client.id !== id);
    this.emit("player.leave", id);
  }

  start(config) {
    this.log("host started the game");

    this.config = config;

    this.game = new Game({
      config: this.config,
      players: this.getPlayers()
    });

    this.game.on("next", event => {
      this.sendPrompts(event);
      this.startAnswering();
      this.host.emit("game.next", event);
    });

    this.game.on("answer", event => {
      this.emit("game.answer", event);
    });

    this.game.on("vote", event => {
      this.emit("game.vote", event)
    });

    this.game.on("reveal", event => {
      this.emit("game.reveal", event)
    });

    this.game.on("score", event => {
      this.emit("game.score", event)
    });

    this.game.on("finish", event => {
      this.emit("game.finish", event)
    });

    this.game.on("answered", event => {
      return this.timers.answering && this.timers.answering.skip();
    });

    this.game.on("voted", event => {
      return this.timers.voting && this.timers.voting.skip();
    });

    this.game.start();
  }

  close() {
    this.log("room closed");

    for (let client of this.clients) {
      client.socket.disconnect();
    }

    this.server.removeAllListeners();
  }

  sendPrompts(event) {
    for (let client of this.clients) {
      let prompts = this.game.getPromptsForPlayer(client.id);
      client.socket.emit("game.next", { round: event.round, prompts });
    }
  }

  startAnswering() {
    this.log("start answering");

    this.timers.answering = this.timer(
      () => this.startVoting(),
      settings["timers.answering"]
    );
  }

  startVoting() {
    this.log("start voting");

    let prompt = this.game.prompts[0];
    let answers = this.game.getAnswersForPrompt();
    this.emit("game.resolve", { prompt, answers });

    this.timers.voting = this.timer(
      () => this.endVoting(),
      settings["timers.voting"]
    );
  }

  endVoting() {
    this.log("end voting");

    let prompt = this.game.currentPrompt();
    let scores = this.game.calculateScores(prompt.id);

    this.game.applyScores(scores);
    this.game.removeCurrentPrompt();

    if (this.game.prompts.length > 0) {
      this.startVoting();
    } else {
      this.game.endRound();
    }
  }

  hasStarted() {
    return Boolean(this.game && this.game.started === false);
  }

  isFull() {
    return this.clients.length >= settings["players.max"];
  }

  getPlayers() {
    return this.clients.map(client => ({ id: client.id }))
  }
}

module.exports = Room;
