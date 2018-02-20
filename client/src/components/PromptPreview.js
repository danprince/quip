import "./PromptPreview.css";
import { h } from "hyperapp";

function PromptPreview({ prompt }) {
  return (
    <div class="prompt-preview">
      {prompt.text}
    </div>
  );
}

export default PromptPreview
