import Rule from './Rule';
import { JsonRule } from '../interfaces';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls } = json;
    super(type, playerTarget, diceRolls);
  }

  execute() {
    // todo
    console.log('executing display rule');
  }
}

export default DisplayRule;