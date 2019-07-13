const Rule = require('./Rule');

class SpeedModifierRule extends Rule {
  constructor(json) {
    const { type, playerTarget, diceRolls, multiplier, numTurns } = json;
    super(type, playerTarget, diceRolls);
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }
}

export default SpeedModifierRule;