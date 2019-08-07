import Rule from './Rule';
import { JsonRule } from '../interfaces';
import { showModal } from '../UIHelper';

class SpeedModifierRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, multiplier, numTurns } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }

  execute() {
    // todo
    console.log('Executing speed modifier rule');
    showModal(`(todo) ${this.displayText}`);
  }
}

export default SpeedModifierRule;