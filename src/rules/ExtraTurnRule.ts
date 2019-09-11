import Rule from './Rule';
import Game from '../engine/Game';
import { JsonRule } from '../interfaces';

export default class ExtraTurnRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    // TODO - specify number of extra turns? now or later? need to involve playerTarget here
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);
    Game.currentPlayer.effects.extraTurns++;
    Game.modal.enableClose();
  }
}