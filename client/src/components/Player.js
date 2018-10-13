import "./Player.css";
import { h } from "hyperapp";
import AnimatedEllipsis from "./AnimatedEllipsis";

function Player({ player, showScore=false }) {
  let style = {
    backgroundImage: `url(https://api.adorable.io/avatars/64/${player.id})`
  };

  return (
    <div class="player">
      <div>
        <div class="player-image" style={style}></div>
      </div>
      <div class="player-label">{player.name || <AnimatedEllipsis />}</div>
      {showScore && <div class="player-score">{player.score}</div>}
    </div>
  );
}

export default Player
