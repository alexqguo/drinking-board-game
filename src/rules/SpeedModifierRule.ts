import Rule from './Rule';
import { JsonRule, ModifierOperation, SpeedModifier } from '../interfaces';
import Player from '../engine/Player';
import Game from '../engine/Game';

class SpeedModifierRule extends Rule {
  modifier: [ModifierOperation, number];
  numTurns: number;

  constructor(json: JsonRule) {
    super(json);
    const { modifier, numTurns } = json;
    this.validateRequired(modifier, numTurns); // TODO: playerTarget as well?
    this.modifier = modifier;
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
            p.effects.speedModifiers.push(
              this.createSpeedModifierFn(this.modifier)
            );
          }
        });
        
        Game.modal.enableClose();
      });
  }
  
  createSpeedModifierFn(modifier: [ModifierOperation, number]): SpeedModifier {
    const operation: ModifierOperation = modifier[0];
    const value: number = modifier[1];

    switch (operation) {
      case ModifierOperation.addition:
        return {
          fn: (num: number) => num + value,
          description: `+ ${value}`,
        };
      case ModifierOperation.multiplication:
        return {
          fn: (num: number) => Math.ceil(value * num),
          description: `x${value}`,
        };
      case ModifierOperation.subtraction:
        return {
          fn: (num: number) => num - value,
          description: `- ${value}`
        }
      case ModifierOperation.equal:
        return {
          fn: () => value,
          description: `= ${value}`
        }
      default:
        throw `Operation ${operation} not supported.`
    }
  }
}

export default SpeedModifierRule;