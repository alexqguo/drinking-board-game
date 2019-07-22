import Rule from './Rule';
import { JsonRule } from '../interfaces';

class TeleportRule extends Rule {
  tileIndex: number;

  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls, tileIndex } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(tileIndex);
    this.tileIndex = tileIndex;
  }

  execute() {
    // todo
  }
}

export default TeleportRule;