import "./index.css";
import { h, app } from "hyperapp";
import actions from "./actions";
import * as apps from "./apps";
import * as helpers from "./helpers";
import Message from "./components/Message";
import Timer from "./components/Timer";

let id = helpers.parseRoomId();

let state = {
  // Meta state
  socket: undefined,
  connected: false,
  mode: id ? "play" : "home",
  status: "setup",

  // UI state
  message: undefined,
  error: undefined,
  timer: undefined,

  // Game state
  id: id,
  round: 0,
  players: [],
  prompts: [],
  answers: [],
  votes: [],

  // Utility state
  name: "",
  me: undefined,
  currentPrompt: undefined,
  answerInputs: {}
};

let router = {
  home: apps.Home,
  host: apps.Host,
  play: apps.Play,
  default: apps.Error
};

let view = (state, actions) => {
  let App = router[state.mode];

  return (
    <div class="view" oncreate={actions.setup}>
      {state.timer && <Timer timer={state.timer} />}
      {state.message && <Message>{state.message.text}</Message>}
      <App state={state} actions={actions} />
    </div>
  );
};

app(state, actions, view, document.getElementById("root"));
