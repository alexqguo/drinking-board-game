abstract class Rule {
  type: string;
  playerTarget: string; // todo- should be enum or symbol

  constructor(type: string, playerTarget: string, diceRolls: any) {
    this.validateRequired(type);
    this.type = type;
    this.playerTarget = playerTarget;
    // todo - dice rolls
  }

  abstract execute(): void;

  validateRequired(...args: any[]): void {
    const errors = args
      .filter(arg => typeof arg === 'undefined' || arg === null || arg === '');
    
    if (errors.length) {
      throw new Error('TODO - missing fields for whatever class this is');
    }
  }
}

export default Rule;