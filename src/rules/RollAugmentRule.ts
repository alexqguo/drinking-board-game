import Game from '../engine/Game';
import Rule from './Rule';
import { JsonRule, ModifierOperation, RollAugmentation } from '../interfaces';

export default class RollAugmentRule extends Rule {
  modifier: [ModifierOperation, number];

  constructor(json: JsonRule) {
    super(json);
    const { modifier } = json;
    this.validateRequired(modifier);
    this.modifier = modifier;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    Game.modal.enableClose();

    Game.currentPlayer.effects.rollAugmentation = this.generateRollAugmentation();
  }

  generateRollAugmentation(): RollAugmentation {
    // TODO: May need to expand RollAugmentation to be a Function rather than a Number
    // in case we have more complicated operations. For now, just allow addition/subtraction
    let description: string;
    const numSpaces: number = this.modifier[1];
    const operation: ModifierOperation = this.modifier[0];

    switch(operation) {
      case ModifierOperation.addition:
        description = `Can add ${numSpaces} to roll`;
        break;
      case ModifierOperation.subtraction:
        description = `Can subtract ${numSpaces} from roll`;
        break;
      default:
        throw 'Operation not supported yet for Roll Augmentation';
    }

    return {
      description,
      numSpaces,
    };
  }
}