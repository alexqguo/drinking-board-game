import Rule from './Rule';
import { JsonRule, Direction } from '../interfaces';

class MoveRule extends Rule {
  direction: Direction;
  numSpaces: number;

  constructor(json: JsonRule) {
    const { type, playerTarget, diceRolls, direction, numSpaces } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(playerTarget, direction, numSpaces);
    this.direction = direction;
    this.numSpaces = numSpaces;
  }

  execute() {
    // todo
    console.log('executing move rule');
  }
}

export default MoveRule;