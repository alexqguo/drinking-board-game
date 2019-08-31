import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../Game';

class SkipNextMandatoryRule extends Rule {
  numSpaces: number;

  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.numSpaces);
    this.numSpaces = json.numSpaces;
  }

  execute() {
    super.execute()
    Game.currentPlayer.effects.mandatorySkips = this.numSpaces; // Yes, overwrite any existing
    Game.modal.enableClose();
  }
}

export default SkipNextMandatoryRule;