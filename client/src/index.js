import "./index.css";
import { h, app } from "hyperapp";
import actions from "./actions";
import * as apps from "./apps";
import * as helpers from "./helpers";
import Message from "./components/Message";

let id = helpers.parseRoomId();

let state = {
  socket: undefined,
  connected: false,
  mode: id ? "play" : "home",
  status: "setup",
  name: "",
  id: id,
  message: undefined,
  me: undefined,
  error: undefined,
  currentPrompt: undefined,
  round: 0,
  players: [],
  prompts: [],
  answers: [],
  votes: [],
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
      {state.message && <Message>{state.message.text}</Message>}
      <App state={state} actions={actions} />
    </div>
  );
};

app(state, actions, view, document.getElementById("root"));
