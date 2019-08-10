import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class TeleportRule extends Rule {
  tileIndex: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, tileIndex } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(tileIndex);
    this.tileIndex = tileIndex;
  }

  execute() {
    Game.currentPlayer.moveToTile(this.tileIndex);
    Game.currentPlayer.currentPos = Game.currentPlayer.destinationPos;
    Game.painter.drawPlayers();

    Game.modal.show(this.displayText);
    Game.modal.enableClose();
    Game.modal.whenClosed(this.end);
  }
}

export default TeleportRule;