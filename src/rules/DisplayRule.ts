import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';
import GameEvents, { RULE_END } from '../GameEvents';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute() {
    Game.modal.show(this.displayText);
    Game.modal.enableClose();
    Game.modal.whenClosed(this.end);
  }
}

export default DisplayRule;