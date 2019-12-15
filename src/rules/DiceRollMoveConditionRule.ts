import Rule from './Rule';
import { JsonRule, DiceRoll } from '../interfaces';
import Outcome from '../engine/Outcome';
import Game from '../engine/Game';
import Player from '../engine/Player';
import DiceRollRule from './DiceRollRule';

/**
 * For move conditions that depend on more complicated dice roll logic rather than
 * just what the player is trying to roll for their turn. This move condition would happen
 * before the player rolls. Essentially, it puts the dice roll mechanic into a move condition.
 * 
 * In the future, need to add some of the complexity from MoveConditionRule into this, such as
 * successes/immediate/etc.
 */
export default class DiceRollMoveConditionRule extends DiceRollRule {
  constructor(json: JsonRule) {
    super(json);
  }

  execute(closedCb: Function) {
    super.execute(closedCb);

    this.selectPlayers()
      .then((value: Player[]) => {
        value.forEach((p: Player) => {
          const canPlayerMove: Function = (rolls: number[]) => {
            const outcome: Rule = this.getOutcomeForRolls(rolls);

            console.log(outcome);

          };
        });
      });

    

    Game.modal.enableClose();
    // Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
    //   const outcomeRule = this.getOutcomeForRolls(rolls);

    //   if (outcomeRule) {
    //     outcomeRule.execute(closedCb);
    //     // The outcome rule will call enableClose on the modal itself
    //   } else {
    //     Game.modal.enableClose();
    //   }
    // });
  }
}