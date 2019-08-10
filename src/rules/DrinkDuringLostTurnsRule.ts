import Rule from './Rule';
import Game from '../Game';
import { JsonRule } from '../interfaces';

class DrinkDuringLostTurnsRule extends Rule {
  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
  }

  execute() {
    Game.modal.show(this.displayText);
  }
}

export default DrinkDuringLostTurnsRule;