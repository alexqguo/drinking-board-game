import Rule from './Rule';
import { JsonRule } from '../interfaces';
import { Game } from '../engine/App';

export default class AnchorRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.numTurns);
    this.numTurns = json.numTurns;
  }

  execute(closedCb: Function) {
    super.execute(closedCb);
    Game.currentPlayer.effects.anchors = this.numTurns;
    Game.modal.enableClose();
  }
}