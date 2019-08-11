import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

export default class ExtraTurnRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget } = json;
    super(displayText, type, playerTarget);
    // TODO - specify number of extra turns
  }

  execute(): void {
    super.execute();
    
    Game.playerTurns.unshift(Game.currentPlayer);
    Game.modal.enableClose();
  }
}