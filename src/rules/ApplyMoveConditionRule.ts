import Rule from './Rule';
import { JsonRule, PlayerTarget } from '../interfaces';
import Player from '../Player';
import Game from '../Game';

class ApplyMoveConditionRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired();
  }

  execute(): void {
    super.execute();
    // TODO
  }
}

export default ApplyMoveConditionRule;