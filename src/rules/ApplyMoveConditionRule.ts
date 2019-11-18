import Rule from './Rule';
import { JsonRule, JsonMoveCondition, PlayerTarget, DiceRollType } from '../interfaces';
import Player from '../engine/Player';
import Game from '../engine/Game';
import { createRule } from '../engine/BoardJsonConverter';

class ApplyMoveConditionRule extends Rule {
  condition: JsonMoveCondition;
  successes: Map<Player, number>;
  consequence: Rule;

  constructor(json: JsonRule) {
    super(json);
    const { condition } = json;
    this.validateRequired(condition);
    // Tracks successes per player for this particular tile/rule instance. One success = one turn
    this.successes = new Map();
    this.condition = condition;

    if (condition.consequence) {
      this.consequence = createRule(condition.consequence);
    }
  }

  isDiceRollSuccessful(rolls: number[]): boolean {
    const { diceRolls, criteria } = this.condition;

    if (!diceRolls || diceRolls.numRequired === 1) {
      return criteria.indexOf(rolls[0]) !== -1;
    }

    if (diceRolls && diceRolls.type === DiceRollType.allMatch) {
      return rolls.every((roll: number) => criteria.indexOf(roll) !== -1);
    }

    return true; // Shouldn't happen, but let the player proceed if so
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);

    this.selectPlayers()
      .then((value: Player[]) => {

        value.forEach((p: Player) => {
          const numDiceRollsRequired: number = this.condition.diceRolls ? this.condition.diceRolls.numRequired : 1;

          // Initialize (or reset) successes for the selected player
          this.successes.set(p, 0);

          /**
           * For now, the move condition is just a function which takes in a roll and decides whether or not
           * you can move based on the number. Will probably be expanded in the future with a "type" for the condition.
           * Could be a roll type, or something else.
           */
          const canPlayerMove: Function = (rolls: number[]): [boolean, string] => {
            const isSuccess = this.isDiceRollSuccessful(rolls);

            if (!isSuccess) {
              /**
               * A bit confusing. If successes are required, you still have to achieve the criteria on your next turn.
               * However if successes are NOT required, even if you fail you will move normally on your next turn.
               * So in that case we clear the condition even in a failure case.
               */
              if (!this.condition.numSuccessesRequired) {
                p.effects.moveCondition = null;
                this.successes.delete(p);
              }

              if (this.consequence) {
                this.consequence.execute(() => {
                  // Need to override the closedCb, otherwise the next player's turn will get skipped
                });
              }

              return [false, `Condition not met: ${this.condition.description}\n\nYour roll: ${rolls.join(', ')}`];
            }

            const currentSuccesses: number = this.successes.get(p);
            this.successes.set(p, currentSuccesses + 1);

            if (!this.condition.numSuccessesRequired || 
              this.successes.get(p) >= this.condition.numSuccessesRequired) {
              p.effects.moveCondition = null;
              this.successes.delete(p);
              return [true, ''];
            }

            return [false, `Successful roll.\n\n${this.successes.get(p)}/${this.condition.numSuccessesRequired}`];
          };

          p.effects.moveCondition = {
            fn: canPlayerMove,
            description: this.condition.description,
            diceRollsRequired: numDiceRollsRequired
          };

          // Will fail with a custom player target as the modal will close immediately
          // Immediate means the condition takes effect the turn the player landed there
          if (this.condition.immediate) {
            Game.modal.requireDiceRolls(numDiceRollsRequired, (rolls: number[]) => {
              canPlayerMove(rolls);
            });
          }
        });

        if (this.playerTarget === PlayerTarget.custom) {
          // If it was a click, close the modal immediately
          Game.modal.close();
        } else {
          // Otherwise, just enable the user to close it themself
          Game.modal.enableClose();
        }
      });
  }
}

export default ApplyMoveConditionRule;