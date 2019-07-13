const Rule = require('./Rule');

class TeleportRule extends Rule {
  constructor(json) {
    const { type, playerTarget, diceRolls, tileIndex } = json;
    this.validateRequired(tileIndex);
    super(type, playerTarget, diceRolls);
    this.tileIndex = tileIndex;
  }
}

export default TeleportRule;