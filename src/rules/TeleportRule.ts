import Rule from './Rule';
import { JsonRule } from '../interfaces';

class TeleportRule extends Rule {
  tileIndex: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, tileIndex } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(tileIndex);
    this.tileIndex = tileIndex;
  }

  execute() {
    // todo
    console.log('Executing teleport rule');
  }
}

export default TeleportRule;