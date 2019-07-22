import Rule from './Rule';
import { JsonRule } from '../interfaces';

class SpeedModifierRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls, multiplier, numTurns } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }

  execute() {
    // todo
  }
}

export default SpeedModifierRule;