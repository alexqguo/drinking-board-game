import Rule from './Rule';

class DisplayRule extends Rule {
  constructor(json) {
    const { type, playerTarget, diceRolls } = json;
    super(type, playerTarget, diceRolls);
  }
}

export default DisplayRule;