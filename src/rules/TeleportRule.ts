import Rule from './Rule';
import { JsonRule } from '../interfaces';
import { showModal } from '../UIHelper';
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
    showModal(this.displayText);
    Game.currentPlayer.moveToTile(this.tileIndex);
    Game.currentPlayer.currentPos = Game.currentPlayer.destinationPos;
    Game.painter.drawPlayers();
  }
}

export default TeleportRule;