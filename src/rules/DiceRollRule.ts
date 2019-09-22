import Rule from './Rule';
import { JsonRule, DiceRoll, JsonOutcome } from '../interfaces';
import Game from '../engine/Game';
import Outcome from '../engine/Outcome';
import { createRule } from '../engine/BoardJsonConverter';

class DiceRollRule extends Rule {
  diceRolls: DiceRoll;
  outcomes: Outcome[];
  any: Outcome;

  constructor(json: JsonRule) {
    super(json);
    this.diceRolls = json.diceRolls;
    this.outcomes = [];

    if (this.diceRolls.outcomes && this.diceRolls.outcomes.length) {
      this.diceRolls.outcomes.forEach((outcome: JsonOutcome) => {
        this.outcomes.push(
          new Outcome(createRule(outcome.rule), outcome.criteria)
        );
      });
    }

    if (this.diceRolls.any) {
      this.any = new Outcome(
        createRule(this.diceRolls.any.rule), this.diceRolls.any.criteria
      );
    }
  }

  // This function is clearly not optimized
  getOutcomeForRolls(rolls: number[]): Rule {
    let outcomeRule: Rule = null;
    if (!this.outcomes && !this.any) return null;

    /**
     * If it's a cumulative check, make the array contain just the sum. [7] for instance.
     * Otherwise just use the list of rolls normally.
     */
    const rollsToCheck: number[] = this.diceRolls.cumulative ? 
      [rolls.reduce((acc: number, cur: number) => acc + cur)] : rolls;

    if (this.any) {
      for (let i = 0; i < rollsToCheck.length; i++) { // I'm a savage
        if (this.any.criteria.indexOf(rollsToCheck[i]) !== -1) {
          return this.any.rule;
        }
      }
    }

    rollsToCheck.forEach((roll: number) => {
      this.outcomes.forEach((outcome: Outcome) => {
        if (outcome.criteria.length && outcome.criteria.indexOf(roll) !== -1) {
          outcomeRule = outcome.rule;
        }
      });
    });

    return outcomeRule;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);

    Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
      const outcomeRule = this.getOutcomeForRolls(rolls);

      if (outcomeRule) {
        outcomeRule.execute(closedCb);
        // The outcome rule will call enableClose on the modal itself
      } else {
        Game.modal.enableClose();
      }
    });
  }
}

export default DiceRollRule;