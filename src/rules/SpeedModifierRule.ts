import Rule from './Rule';
import { JsonRule, PlayerTarget } from '../interfaces';
import Player from '../Player';
import Game from '../Game';

class SpeedModifierRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: JsonRule) {
    const { displayText, type, playerTarget, diceRolls, multiplier, numTurns } = json;
    super(displayText, type, playerTarget, diceRolls);
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }

  execute(): void {
    super.execute();

    this.selectPlayers()
      .then((value: Player[]) => {
        value.forEach((p: Player) => {
          // If somehow a user gets multiple modifiers on them, just cancel the original
          p.speedModifiers = [];
    
          for (let i = 0; i < this.numTurns; i ++) {
            p.speedModifiers.push(this.multiplier);
          }
          Game.modal.enableClose();
        });
      });
  }
}

export default SpeedModifierRule;