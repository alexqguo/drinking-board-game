import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class TeleportRule extends Rule {
  tileIndex: number;

  constructor(json: JsonRule) {
    super(json);
    const { tileIndex } = json;
    this.validateRequired(tileIndex);
    this.tileIndex = tileIndex;
  }

  execute(): void {
    super.execute();

    Game.currentPlayer.teleportToTile(this.tileIndex);
    Game.painter.drawPlayers();
    Game.modal.enableClose();
  }
}

export default TeleportRule;