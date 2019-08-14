import Rule from './Rule';
import Game from '../Game';
import { JsonRule, DiceRoll } from '../interfaces';

/**
 * TODO: Delete this entirely and use DiceRollRule instead
 */
class DrinkDuringLostTurnsRule extends Rule {
  diceRolls: DiceRoll;

  constructor(json: JsonRule) {
    super(json);
    this.diceRolls = json.diceRolls;
  }

  execute() {
    super.execute();

    Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
      Game.currentPlayer.skippedTurns += rolls[0]; // no-op on the second roll
      Game.modal.enableClose();
    });
  }
}

export default DrinkDuringLostTurnsRule;