import "./PlayerAvatar.css";
import { h } from "hyperapp";
import AnimatedEllipsis from "./AnimatedEllipsis";

function PlayerAvatar({ player }) {
  let style = {
    backgroundImage: `url(https://api.adorable.io/avatars/64/${player.id})`
  };

  return (
    <div class="player-avatar">
      <div class="player-avatar-image" style={style}></div>
      <br />
      <div class="player-avatar-label">{player.name || <AnimatedEllipsis />}</div>
    </div>
  );
}

export default PlayerAvatar
