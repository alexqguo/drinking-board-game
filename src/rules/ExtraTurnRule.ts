import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';
import { showModal } from '../UIHelper';

export default class ExtraTurnRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget } = json;
    super(displayText, type, playerTarget);
    // TODO - specify number of extra turns
  }

  execute(): void {
    showModal(this.displayText);
    Game.playerTurns.unshift(Game.currentPlayer);
  }
}