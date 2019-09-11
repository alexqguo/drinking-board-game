import { DiceRoll, PlayerTarget, JsonRule } from '../interfaces';
import GameEvents, { RULE_END } from '../engine/GameEvents';
import Game from '../engine/Game';
import Player from '../engine/Player';

abstract class Rule {
  displayText: string;
  type: string;
  playerTarget: PlayerTarget;
  criteria: number[];

  constructor(json: JsonRule/*displayText: string, type: string, playerTarget: PlayerTarget, diceRolls?: DiceRoll*/) {
    const { displayText, type, playerTarget, criteria } = json;
    this.validateRequired(type);

    this.type = type;
    this.displayText = displayText;
    this.playerTarget = playerTarget;
    this.criteria = criteria;
  }

  // Should this return a promise instead? YES! Not super clean to have childen always passing through args
  execute(closedCb: Function = this.end): void {
    Game.modal.show(this.displayText);
    Game.modal.disableClose();
    Game.modal.whenClosed(closedCb);
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