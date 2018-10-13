import { h } from "hyperapp";
import App from "../components/App";
import Player from "../components/Player";
import NameChooser from "../components/NameChooser";
import AnswerEditor from "../components/AnswerEditor";
import AnswerVoter from "../components/AnswerVoter";
import * as selectors from "../selectors";

let router = {
  setup({ state, actions }) {
    let player = selectors.ownPlayer(state);

    return (
      <div>
        <h1>Quip</h1>
        {player && <Player player={player} />}
        <NameChooser
          value={state.name}
          onChange={actions.changeName}
          onSave={actions.saveName} />
      </div>
    );
  },

  answering({ state, actions }) {
    let { prompts, answerInputs } = state;

    return (
      <div>
        <h1>Answering</h1>
        {prompts.map(prompt =>
          <AnswerEditor
            key={prompt.id}
            prompt={prompt}
            value={answerInputs[prompt.id]}
            onSubmit={() => actions.submitAnswer({ prompt: prompt.id })}
            onChange={text => actions.editAnswer({ prompt: prompt.id, text })}
          />
        )}
      </div>
    );
  },

  voting({ state, actions }) {
    let { currentPrompt: prompt, answers, me } = state;
    let wasMyPrompt = prompt.players.includes(me);

    return (
      <div>
        <h1>{prompt.text}</h1>

        {wasMyPrompt ? (
          <strong>You don't get to vote on your own prompts</strong>
        ) : (
          answers.map(answer =>
            <AnswerVoter
              key={answer.id}
              answer={answer}
              onVote={() => actions.vote(answer.id)}
            />
          )
        )}
      </div>
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
