import Rule from './Rule';

class DisplayRule extends Rule {
  constructor(json: any) {
    const { type, playerTarget, diceRolls } = json;
    super(type, playerTarget, diceRolls);
  }

  execute() {
    // todo
  }
}

export default DisplayRule;