import settings from "./settings";

export function ownPlayer(state) {
  return findPlayer(state.me, state);
}

export function findPlayer(id, state) {
  return state.players.find(player => player.id === id);
}

export function countPlayers(state) {
  return state.players.length;
}

export function canStartGame(state) {
  return state.players.length >= settings["players.min"];
}

export function playersNeeded(state) {
  return Math.max(settings["players.min"] - state.players.length, 0);
}
