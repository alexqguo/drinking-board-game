import Rule from './Rule';
import { JsonRule, DiceRoll } from '../interfaces';
import Game from '../Game';
import { createRule } from '../BoardJsonConverter';

class DiceRollRule extends Rule {
  diceRolls: DiceRoll;
  outcomeRules: Rule[];
  any: Rule;

  constructor(json: JsonRule) {
    super(json);
    this.diceRolls = json.diceRolls;
    this.outcomeRules = [];

    if (this.diceRolls.outcomes && this.diceRolls.outcomes.length) {
      this.diceRolls.outcomes.forEach((rule: JsonRule) => {
        this.outcomeRules.push(createRule(rule));
      });
    }

    if (this.diceRolls.any) {
      this.any = createRule(this.diceRolls.any);
    }
  }

  // This function is clearly not optimized
  getOutcomeForRolls(rolls: number[]): Rule {
    let outcomeRule: Rule = null;

    if (!this.outcomeRules && !this.any) return null;

    if (this.any) {
      for (let i = 0; i < rolls.length; i++) { // I'm a savage
        if (this.any.criteria.indexOf(rolls[i]) !== -1) {
          return this.any;
        }
      }
    }

    rolls.forEach((roll: number) => {
      this.outcomeRules.forEach((rule: Rule) => {
        if (rule.criteria && rule.criteria.length && rule.criteria.indexOf(roll) !== -1) {
          outcomeRule = rule;
        }
      });
    });

    return outcomeRule;
  }

  execute() {
    super.execute();

    // set the outcome, once you find one then break
    // set the any

    Game.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls: number[]) => {
      const outcomeRule = this.getOutcomeForRolls(rolls);

      if (outcomeRule) {
        outcomeRule.execute();
        // the rule will call enableClose on the modal itself
      } else {
        Game.modal.enableClose();
      }
    });
  }
}

export default DiceRollRule;