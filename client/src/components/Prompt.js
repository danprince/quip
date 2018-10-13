import "./Prompt.css";
import { h } from "hyperapp";

function Prompt({ prompt }) {
  return (
    <div class="prompt">
      {prompt.text}
    </div>
  );
}

export default Prompt
