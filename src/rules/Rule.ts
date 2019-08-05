import { JsonDiceRoll } from "../interfaces";

abstract class Rule {
  displayText: string;
  type: string;
  playerTarget: string; // todo- should be enum or symbol

  constructor(displayText: string, type: string, playerTarget: string, diceRolls: JsonDiceRoll) {
    this.validateRequired(type);
    this.type = type;
    this.displayText = displayText;
    this.playerTarget = playerTarget;
    // todo - dice rolls
  }

  // Should this return a promise instead?
  abstract execute(): void;

  validateRequired(...args: any[]): void {
    const errors = args
      .filter(arg => typeof arg === 'undefined' || arg === null || arg === '');
    
    if (errors.length) {
      throw new Error('TODO - alert missing fields for whatever class this is');
    }
  }
}

export default Rule;