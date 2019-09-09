import Rule from './Rule';
import { JsonRule, PlayerTarget } from '../interfaces';
import Player from '../Player';
import Game from '../Game';

class SpeedModifierRule extends Rule {
  multiplier: number;
  numTurns: number;

  constructor(json: JsonRule) {
    super(json);
    const { multiplier, numTurns } = json;
    this.validateRequired(multiplier, numTurns); // TODO: playerTarget as well?
    this.multiplier = multiplier;
    this.numTurns = numTurns;
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);

    this.selectPlayers()
      .then((value: Player[]) => {
        value.forEach((p: Player) => {
          // If somehow a user gets multiple modifiers on them, just cancel the original
          p.effects.speedModifiers = [];
    
          for (let i = 0; i < this.numTurns; i ++) {
            p.effects.speedModifiers.push(this.multiplier);
          }
        });
        
        Game.modal.enableClose();
      });
  }
}

export default SpeedModifierRule;