import "./Timer.css";
import { h } from "hyperapp";

function Timer({ timer }) {
  let ms = timer.ending - Date.now();
  let seconds = Math.floor(ms / 1000);

  return (
    <div class="timer">
      {seconds}
    </div>
  );
}

export default Timer
