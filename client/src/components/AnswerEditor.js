import "./AnswerEditor.css";
import { h } from "hyperapp";

function AnswerEditor({ prompt, value, onChange, onSubmit }) {
  return (
    <div class="answer-editor">
      <h2 class="answer-editor-prompt">{prompt.text}</h2>
      <textarea
        class="answer-editor-input"
        value={value}
        placeholder="Enter an answer"
        oninput={event => {
          onChange(event.target.value);
        }}
        onkeypress={event => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
      />
      {value && <button onclick={onSubmit}>Submit</button>}
    </div>
  );
}

export default AnswerEditor
