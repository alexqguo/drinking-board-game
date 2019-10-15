import Rule from './Rule';
import Game from '../engine/Game';
import Player from '../engine/Player';
import { JsonRule, DiceRoll } from '../interfaces';
import { times } from '../utils';

/**
 * TODO: Delete this entirely and use DiceRollRule instead
 */
class DrinkDuringLostTurnsRule extends Rule {
  diceRolls: DiceRoll;

  constructor(json: JsonRule) {
    super(json);
    this.diceRolls = json.diceRolls;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);

    Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
      times(rolls[0], () => {
        Game.currentPlayer.effects.skippedTurns.push(
          Player.generateSkippedTurnText(`Drink ${rolls[1]}`)
        );
      });
      Game.modal.enableClose();
    });
  }
}

export default DrinkDuringLostTurnsRule;