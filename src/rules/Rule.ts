class Rule {
  type: string;
  playerTarget: string; // todo- should be enum or symbol

  constructor(type: string, playerTarget: string, diceRolls: any) {
    if (false /* todo: check for direct instantiation */) {
      throw new Error('Rule is abstract, cannot instantiate directly');
    }
    this.validateRequired(type);
    this.type = type;
    this.playerTarget = playerTarget;
    // todo - dice rolls
  }

  // TODO: any shared implementations or function definitions

  execute() {
    // ???
  }

  validateRequired(...args: any[]) {
    const errors = args
      .filter(arg => typeof arg === 'undefined' || arg === null || arg === '');
    
    if (errors.length) {
      throw new Error('TODO - missing fields for whatever class this is');
    }
  }
}

export default Rule;