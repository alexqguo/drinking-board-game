import Rule from './Rule';
import Game from '../engine/Game';
import { JsonRule } from '../interfaces';
import { times } from '../utils';
import Player from '../engine/Player';

class SkipTurnRule extends Rule {
  numTurns: number;

  constructor(json: JsonRule) {
    super(json);
    const { numTurns } = json;
    this.validateRequired(numTurns);
    this.numTurns = numTurns;
  }

  execute(closedCb: Function): void {
    super.execute(closedCb);
    times(this.numTurns, () => {
      Game.currentPlayer.effects.skippedTurns.push(Player.generateSkippedTurnText());
    })
    Game.modal.enableClose();
  }
}

export default SkipTurnRule;