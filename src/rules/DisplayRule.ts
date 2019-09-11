import Rule from './Rule';
import { JsonRule } from '../interfaces';
import Game from '../engine/Game';

class DisplayRule extends Rule {
  constructor(json: JsonRule) {
    super(json);
    this.validateRequired(json.displayText);
  }

  execute(closedCb: Function) {
    super.execute(closedCb)
    Game.modal.enableClose(); // Nothing to do
  }
}

export default DisplayRule;