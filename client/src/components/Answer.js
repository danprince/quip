//import "./Answer.css";
import { h } from "hyperapp";

function Answer({ answer }) {
  return (
    <div class="answer">
      <h2>{answer.text}</h2>
    </div>
  );
}

export default Answer
