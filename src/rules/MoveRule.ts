import Rule from './Rule';

enum Direction {
  forward = 'forward',
  back = 'back',
}

class MoveRule extends Rule {
  direction: Direction;
  numSpaces: number;

  constructor(json: JSON) {
    const { type, playerTarget, diceRolls, direction, numSpaces } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(playerTarget, direction, numSpaces);
    this.direction = direction;
    this.numSpaces = numSpaces;
  }
}

export default MoveRule;