import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';
import { showModal } from '../UIHelper';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute() {
    showModal(this.displayText);
  }
}

export default DisplayRule;