import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../engine/Game';

class ApplyMandatoryRule extends Rule {
  tileIndex: number;

  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.tileIndex);
    this.tileIndex = json.tileIndex;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    Game.currentPlayer.effects.customMandatoryTiles.push(this.tileIndex);
    Game.modal.enableClose();
  }
}

export default ApplyMandatoryRule;