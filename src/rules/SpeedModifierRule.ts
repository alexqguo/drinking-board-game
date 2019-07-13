import Rule from './Rule';

class SpeedModifierRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: any) {
    const { type, playerTarget, diceRolls, multiplier, numTurns } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }

  execute() {
    // todo
  }
}

export default SpeedModifierRule;