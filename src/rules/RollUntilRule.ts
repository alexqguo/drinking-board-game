import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class RollUntilRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.displayText);
  }

  execute(closedCb: Function) {
    super.execute(closedCb)

    const rollUntilFn = () => {
      Game.modal.requireDiceRolls(1, (rolls: number[]) => {
        if (this.criteria.indexOf(rolls[0]) !== -1) {
          Game.modal.enableClose();
        } else {
          rollUntilFn();
        }
      });
    }

    rollUntilFn();
  }
}

export default RollUntilRule;