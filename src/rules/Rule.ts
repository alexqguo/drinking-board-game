import { JsonDiceRoll, PlayerTarget } from '../interfaces';
import GameEvents, { RULE_END } from '../GameEvents';
import Game from '../Game';
import Player from '../Player';

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
  execute(): void {
    Game.modal.show(this.displayText);
    Game.modal.disableClose();
    Game.modal.whenClosed(this.end);
  };

  end(): void {
    GameEvents.trigger(RULE_END);
  }

  selectPlayers(): Promise<Player[]> {
    const targetPlayers: Player[] = [];
    
    return new Promise((resolve: Function) => {
      switch(this.playerTarget) {
        case PlayerTarget.allOthers:
          targetPlayers.push(...Game.getInactivePlayers());
          resolve(targetPlayers);
          break;

        case PlayerTarget.custom:
          Game.modal.requirePlayerSelection(Game.getInactivePlayers())
            .then((playerList: Player[]) => {
              resolve(playerList);
            });
          break;

        default:
          targetPlayers.push(Game.currentPlayer);
          resolve(targetPlayers);
      }
    });
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