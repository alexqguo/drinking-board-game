import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    super(json);
    const { numTurns } = json;
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);
    Game.currentPlayer.effects.skippedTurns += this.numTurns;
    Game.modal.enableClose();
  }
}

export default SkipTurnRule;