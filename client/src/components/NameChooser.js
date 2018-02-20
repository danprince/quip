import { h } from "hyperapp";
import Container from "./Container";

function NameChooser({ value, onChange, onSave }) {
  let valid = Boolean(value);

  return (
    <div class="name-chooser">
      <Container>
        <input
          type="text"
          value={value}
          placeholder="Pick a name"
          oninput={event => onChange(event.target.value)}
          onkeypress={event => {
            if (event.key === "Enter") onSave()
          }}
        />
      </Container>
      <Container>
        <button disabled={!valid} onclick={onSave}>Save</button>
      </Container>
    </div>
  );
}

export default NameChooser
