import { JsonDiceRoll } from '../interfaces';
import GameEvents, { RULE_END } from '../GameEvents';

abstract class Rule {
  displayText: string;
  type: string;
  playerTarget: string; // todo- should be enum or symbol
  diceRolls: JsonDiceRoll;

  constructor(displayText: string, type: string, playerTarget: string, diceRolls?: JsonDiceRoll) {
    this.validateRequired(type);
    this.type = type;
    this.displayText = displayText;
    this.playerTarget = playerTarget;
    this.diceRolls = diceRolls;
  }

  // Should this return a promise instead?
  abstract execute(): void;

  end(): void {
    GameEvents.trigger(RULE_END);
  }

  validateRequired(...args: any[]): void {
    const errors = args
      .filter(arg => typeof arg === 'undefined' || arg === null || arg === '');
    
    if (errors.length) {
      throw new Error('TODO - alert missing fields for whatever class this is');
    }
  }
}

export default Rule;