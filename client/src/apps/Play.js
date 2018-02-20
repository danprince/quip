import { h } from "hyperapp";
import App from "../components/App";
import PlayerAvatar from "../components/PlayerAvatar";
import NameChooser from "../components/NameChooser";
import * as selectors from "../selectors";

let router = {
  setup({ state, actions }) {
    let player = selectors.ownPlayer(state);

    return (
      <div>
        <h1>Quip</h1>
        {player && <PlayerAvatar player={player} />}
        <NameChooser
          value={state.name}
          onChange={actions.changeName}
          onSave={actions.saveName} />
      </div>
    );
  },

  answering({ state, actions }) {
    let { prompts } = state;

    return (
      <div>
        <h1>Answering</h1>
        {prompts.map(prompt => (
          <div key={prompt.id}>{prompt.text}</div>
        ))}
      </div>
    );
  },

  voting({ state, actions }) {
    return (
      <h1>Voting</h1>
    );
  }
};

function Play({ state, actions }) {
  let View = router[state.status];

  return (
    <App>
      <View state={state} actions={actions} />
    </App>
  );
}

export default Play
