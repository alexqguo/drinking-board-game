import Rule from './Rule';
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
    // todo
    console.log('Executing Skip turn rule');
    showModal(`(todo) ${this.displayText}`);
  }
}

export default SkipTurnRule;