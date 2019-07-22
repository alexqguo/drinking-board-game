import Rule from './Rule';
import { JsonRule } from '../interfaces';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls, numTurns } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute() {
    // todo
  }
}

export default SkipTurnRule;