import "./AnswerVoter.css";
import { h } from "hyperapp";

function AnswerVoter({ answer, onVote }) {
  return (
    <div class="answer">
      <h2>{answer.text}</h2>
      <button onclick={onVote}>Vote</button>
    </div>
  );
}

export default AnswerVoter
