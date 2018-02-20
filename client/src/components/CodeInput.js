import "./CodeInput.css";
import { h } from "hyperapp";

function CodeInput({ length, value, onChange }) {
  return (
    <input
      type="text"
      class="code-input"
      value={value}
      placeholder="Code"
      size={length}
      spellcheck={false}
      oninput={event => {
        onChange(event.target.value);
      }}
      onkeypress={event => {
        if (value.length >= length) {
          event.preventDefault();
        }
      }}
      style={{
        textAlign: "center"
      }}
    />
  );
}

export default CodeInput
