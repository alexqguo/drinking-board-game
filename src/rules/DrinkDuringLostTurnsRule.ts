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
    Game.modal.disableClose();
    Game.modal.whenClosed(this.end);

    Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
      Game.currentPlayer.skippedTurns += rolls[0];
      // no-op on the second roll
      Game.modal.enableClose();
    });
  }
}

export default DrinkDuringLostTurnsRule;