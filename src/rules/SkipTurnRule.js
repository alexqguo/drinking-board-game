const Rule = require('./Rule');

class SkipTurnRule extends Rule {
  constructor(json) {
    const { type, playerTarget, diceRolls, numTurns } = json;
    this.validateRequired(numTurns);
    super(type, playerTarget, diceRolls);
    this.numTurns = numTurns;
  }
}

export default SkipTurnRule;