import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute() {
    super.execute()
    Game.modal.enableClose(); // Nothing to do
  }
}

export default DisplayRule;