import "./PlayerList.css";
import { h } from "hyperapp";
import PlayerAvatar from "./PlayerAvatar";

function PlayerList({ players }) {
  return (
    <div class="player-list">
      <ul class="player-list-items">
        {players.map(player => (
          <li class="player-list-item" key={player.id}>
            <PlayerAvatar player={player} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList
