import io from "socket.io-client";
import { delay } from "./helpers";

export default {
  setup: () => (state, actions) => {
    let socket = io(`http://localhost:3333/${state.id}`);
    socket.on("err", actions.onError);
    socket.on("error", actions.onFatalError);
    socket.on("player.join", actions.onPlayerJoin);
    socket.on("player.leave", actions.onPlayerLeave);
    socket.on("player.rename", actions.onPlayerRename);
    socket.on("game.init", actions.onGameInit);
    socket.on("game.next", actions.onGameNext);
    socket.on("game.answer", actions.onGameAnswer);
    socket.on("game.vote", actions.onGameVote);
    socket.on("game.score", actions.onGameScore);
    socket.on("game.reveal", actions.onGameReveal);
    socket.on("game.finish", actions.onGameFinish);
    socket.on("game.resolve", actions.onGameResolve);
    socket.on("timer.start", actions.onTimerStart);
    socket.on("timer.stop", actions.onTimerStop);
    socket.on("room.message", actions.onRoomMessage);
    socket.on("room.init", actions.switchToHosting);

    delay(actions.initialize);

    return { socket };
  },

  initialize: () => (state, actions) => {
    if (state.mode === "play") actions.loadName();
  },

  createGame: () => (state, actions) => {
    let { socket } = state;
    socket.emit("room.setup");
    socket.once("room.init", room => actions.switchToHosting(room));
  },

  joinGame: () => (state, actions) => {
    location.hash = state.id;
    location.reload();
  },

  startGame: () => (state, actions) => {
    let config = {};
    state.socket.emit("game.start", config);
  },

  switchToHosting: room => state => {
    document.title = room.id;
    return { mode: "host", id: room.id };
  },

  switchToPlaying: room => state => {
    return { mode: "play", id: room.id };
  },

  onError: error => state => {
    console.error("Error:", error);
    return { error }
  },

  onFatalError: error => state => {
    console.error("Fatal Error", error);
    return { error };
  },

  onPlayerJoin: id => state => {
    console.info(`player joined: '${id}'`);
    let player = { id, name: "", score: 0 };
    return { players: [...state.players, player] };
  },

  onPlayerLeave: id => state => {
    console.info(`player left: '${id}'`);
    let players = state.players.filter(player => player.id !== id)
    return { players };
  },

  onPlayerRename: event => state => {
    console.info(`player renamed: '${event.player}' to '${event.name}'`);

    let players = state.players.map(player => {
      if (player.id === event.player) {
        return { ...player, name: event.name };
      } else {
        return player;
      }
    });

    return { players };
  },

  onGameInit: event => state => {
    let players = event.players.map(player => ({ ...player, score: 0 }));
    return { players, me: event.me, connected: true };
  },

  onGameNext: ({ round, prompts }) => state => {
    return { status: "answering", round, prompts };
  },

  onGameAnswer: answer => state => {
    return { answers: [...state.answers, answer] };
  },

  onGameVote: vote => state => {
    return { votes: [...state.votes, vote] };
  },

  onGameResolve: event => state => {
    return { status: "voting", currentPrompt: event.prompt, answers: event.answers };
  },

  onGameReveal: () => state => {
    // TODO: Show authors of answers
  },

  onGameScore: event => state => {
    let players = state.players.map(player => {
      if (player.id === event.player) {
        return { ...player, score: event.score };
      } else {
        return player;
      }
    })

    return { players };
  },

  onGameFinish: event => state => {
    return { mode: "scores" };
  },

  onTimerStart: timer => (state, actions) => {
    if (state.timer === undefined) {
      delay(actions.onTimerTick);
    }

    return { timer: { ...timer, ticks: 0 } };
  },

  onTimerStop: event => (state, actions) => {
    return { timer: undefined };
  },

  onTimerTick: () => (state, actions) => {
    let { timer } = state;

    if (timer === undefined) {
      return {};
    }

    let now = Date.now();
    let ended = now > timer.ending;

    if (!ended) {
      delay(actions.onTimerTick, 1000);
    }

    return { ...timer, ticks: timer.ticks + 1 };
  },

  onRoomMessage: event => (state, actions) => {
    delay(actions.hideMessage, 2000);
    return { message: event };
  },

  hideMessage: () => state => {
    return { message: undefined };
  },

  onUpdateId: text => state => {
    let id = text.slice(0, 4);
    return { id };
  },

  changeName: name => state => {
    return { name };
  },

  saveName: () => state => {
    state.socket.emit("player.rename", state.name);
    localStorage.name = state.name;
  },

  loadName: () => (state, actions) => {
    actions.changeName(localStorage.name);
    actions.saveName();
  },

  submitAnswer: event => (state, actions) => {
    let text = state.answerInputs[event.prompt];
    let answer = { prompt: event.prompt, text };
    state.socket.emit("game.answer", answer);
    actions.removePrompt(answer.prompt);
  },

  editAnswer: event => state => {
    let answerInputs = {
      ...state.answerInputs,
      [event.prompt]: event.text
    };

    return { answerInputs };
  },

  removePrompt: id => state => {
    let prompts = state.prompts.filter(prompt => prompt.id !== id);
    return { prompts };
  },

  vote: answerId => state => {
    state.socket.emit("game.vote", { answer: answerId });
  }
};
