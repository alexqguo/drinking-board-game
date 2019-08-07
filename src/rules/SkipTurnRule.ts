import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';
import { showModal } from '../UIHelper';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, numTurns } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute() {
    showModal(this.displayText);
    Game.currentPlayer.skippedTurns += this.numTurns;
  }
}

export default SkipTurnRule;