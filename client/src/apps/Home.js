import { h } from "hyperapp";
import App from "../components/App";
import CodeInput from "../components/CodeInput";
import Container from "../components/Container";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";

function Home({ state, actions }) {
  let id = state.id;
  let invalid = id.length < 4;

  return (
    <App>
      <Title>Quip</Title>
      <Subtitle>An open source version of Quiplash.</Subtitle>
      <Container>
        <CodeInput value={state.id} length={4} onChange={actions.onUpdateId} />
      </Container>
      <div class="controls">
        <button class="blue" disabled={invalid} onclick={actions.joinGame}>Join</button>
        <div>Or <a onclick={actions.createGame}>create a new game</a></div>
      </div>
    </App>
  )
}

export default Home
