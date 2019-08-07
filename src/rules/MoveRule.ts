import Rule from './Rule';
import { JsonRule, Direction } from '../interfaces';
import { showModal } from '../UIHelper';

class MoveRule extends Rule {
  direction: Direction;
  numSpaces: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, direction, numSpaces } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(playerTarget, direction, numSpaces);
    this.direction = direction;
    this.numSpaces = numSpaces;
  }

  execute() {
    // todo
    console.log('executing move rule');
    showModal(`(todo) ${this.displayText}`);
  }
}

export default MoveRule;