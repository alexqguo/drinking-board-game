import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../engine/Game';

class SkipNextMandatoryRule extends Rule {
  numSpaces: number;

  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.numSpaces);
    this.numSpaces = json.numSpaces;
  }

  execute(closedCb: Function) {
    super.execute(closedCb)
    Game.currentPlayer.effects.mandatorySkips = this.numSpaces; // Yes, overwrite any existing
    Game.modal.enableClose();
  }
}

export default SkipNextMandatoryRule;