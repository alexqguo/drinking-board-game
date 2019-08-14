import Rule from './Rule';
import { JsonRule, MoveCondition } from '../interfaces';
import Player from '../Player';
import Game from '../Game';

class ApplyMoveConditionRule extends Rule {
  condition: MoveCondition;
  successes: Map<Player, number>;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, condition } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(condition);
    // Tracks successes per player for this particular tile/rule instance. One success = one turn
    this.successes = new Map();
    this.condition = condition;
  }

  execute(): void {
    super.execute();

    this.selectPlayers()
      .then((value: Player[]) => {
        value.forEach((p: Player) => {

          // Initialize (or reset) successes for the selected player
          this.successes.set(p, 0);

          /**
           * For now, the move condition is just a function which takes in a roll and decides whether or not
           * you can move based on the number. Will probably be expanded in the future with a "type" for the condition.
           * Could be a roll type, or something else.
           */
          const canPlayerMove: Function = (roll: number) => {
            console.log(`roll: ${roll}`);
            console.log(this.condition);
            if (this.condition.criteria.indexOf(roll) === -1) {
              /**
               * A bit confusing. If successes are required, you still have to achieve the criteria on your next turn.
               * However if successes are NOT required, even if you fail you will move normally on your next turn.
               * So in that case we clear the condition even in a failure case.
               */
              if (!this.condition.numSuccessesRequired) {
                p.moveCondition = null;
                this.successes.delete(p);
              }

              return false;
            }

            const currentSuccesses: number = this.successes.get(p);
            this.successes.set(p, currentSuccesses + 1);

            if (!this.condition.numSuccessesRequired || 
              this.successes.get(p) >= this.condition.numSuccessesRequired) {
              p.moveCondition = null;
              this.successes.delete(p);
              return true;
            }

            return false;
          };

          p.moveCondition = canPlayerMove;
          Game.modal.enableClose();
        });
      });
  }
}

export default ApplyMoveConditionRule;