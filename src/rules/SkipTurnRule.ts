import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, numTurns } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute(): void {
    super.execute();
    Game.currentPlayer.skippedTurns += this.numTurns;
    Game.modal.enableClose();
  }
}

export default SkipTurnRule;