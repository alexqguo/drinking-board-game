import Rule from './Rule';
import { JsonRule } from '../interfaces';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute() {
    // todo
    console.log('executing display rule');
    alert(this.displayText);
  }
}

export default DisplayRule;