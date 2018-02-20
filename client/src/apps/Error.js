import { h } from "hyperapp";
import App from "../components/App";
import Message from "../components/Message";

function Error({ state, actions }) {
  return (
    <App>
      <Message type="error" title="Something went wrong">
        {state.error}
      </Message>
    </App>
  );
}

export default Error
