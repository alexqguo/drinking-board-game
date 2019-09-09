import Rule from './Rule';
import { JsonRule, DiceRoll } from '../interfaces';
import Game from '../Game';
import { createRule } from '../BoardJsonConverter';

class ChoiceRule extends Rule {
  choiceRules: Rule[];
  diceRolls: DiceRoll;

  constructor(json: JsonRule) {
    super(json);
    const { choices, diceRolls } = json;
    this.validateRequired(choices);
    this.choiceRules = [];
    this.diceRolls = diceRolls;

    if (choices && choices.length) {
      choices.forEach((rule: JsonRule) => {
        this.choiceRules.push(createRule(rule));
      });
    }
  }

  execute(closedCb: Function) {
    super.execute(closedCb)

    if (this.diceRolls) {
      Game.modal.requireDiceRolls(this.diceRolls.numRequired, () => {});
    }

    Game.modal.requireChoice(this.choiceRules)
      .then((value: Rule) => {
        if (!value) { // Should never happen
          Game.modal.enableClose();
          return;
        }
        value.execute();
      });
  }
}

export default ChoiceRule;