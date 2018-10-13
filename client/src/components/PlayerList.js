import "./PlayerList.css";
import { h } from "hyperapp";
import Player from "./Player";

function PlayerList({ players, showScores=false }) {
  return (
    <div class="player-list">
      <ul class="player-list-items">
        {players.map(player => (
          <li class="player-list-item" key={player.id}>
            <Player player={player} showScore={showScores} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList
