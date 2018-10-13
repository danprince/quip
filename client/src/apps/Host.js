import { h } from "hyperapp";
import App from "../components/App";
import Container from "../components/Container";
import PlayerList from "../components/PlayerList";
import CodeViewer from "../components/CodeViewer";
import Prompt from "../components/Prompt";
import Answer from "../components/Answer";
import Document from "../components/Document";
import settings from "../settings";
import * as selectors from "../selectors";

let router = {
  setup({ state, actions }) {
    let { id, players } = state;
    let canStart = selectors.canStartGame(state);
    let playersNeeded = selectors.playersNeeded(state);
    let playerCount = selectors.countPlayers(state);

    return (
      <div>
        <h3>You are the host</h3>
        <Container>
          <CodeViewer value={id} />
        </Container>
        <Container>
          <PlayerList players={players} />
        </Container>
        <Container>
          {canStart && <button onclick={actions.startGame}>Start</button>}

          {canStart ? (
            <div>{playerCount}/{settings["players.max"]} players</div>
          ) : (
            <div>Need {playersNeeded} more players</div>
          )}
        </Container>
      </div>
    );
  },

  answering({ state, actions }) {
    return (
      <div>
        <Document title="Answering" />
        <h1>Answering</h1>
        <Container>
          <PlayerList players={state.players} showScores />
        </Container>
      </div>
    );
  },

  voting({ state, actions }) {
    let { players, answers, currentPrompt } = state;

    return (
      <div>
        <Document title="Voting" />
        <Container>
          <Prompt prompt={currentPrompt} />
        </Container>
        <Container>
          {answers.map(answer =>
            <Answer key={answer.id} answer={answer} />
          )}
        </Container>
      </div>
    );
  }
};

function Host({ state, actions }) {
  let View = router[state.status];

  return (
    <App>
      <View state={state} actions={actions} />
    </App>
  );
}

export default Host
